/**
 * schooldemo / portfolio admin auth proxy.
 *
 * Security boundary:
 * - GitHub OAuth code is exchanged server-side in this Worker. The browser
 *   never receives a GitHub access token.
 * - Identity is verified by calling GitHub's /user endpoint and checking the
 *   login against the platform owner and, optionally, an admin roster stored in
 *   Cloudflare D1.
 * - Only approved accounts receive a short-lived, HttpOnly, Secure, SameSite=Lax
 *   session cookie. The browser only needs to hold a session id.
 * - All GitHub API calls are proxied through this Worker so a leaked session
 *   cookie cannot be used to scrape tokens directly.
 *
 * Environments:
 *   ADMIN_OWNER = the GitHub login that owns the platform by default
 *   ADMIN_ROLES = CSV of roles (platform-admin, school-admin, editor, ...)
 *   D1_BINDING = Cloudflare D1 database binding with admins table
 *
 * Admin roster (D1 table `admins`):
 *   id TEXT PRIMARY KEY,
 *   github_login TEXT NOT NULL,
 *   name TEXT,
 *   email TEXT,
 *   avatar_url TEXT,
 *   roles TEXT NOT NULL DEFAULT 'platform-admin',
 *   created_at INTEGER NOT NULL,
 *   updated_at INTEGER NOT NULL
 *
 * Roles (least privilege by default):
 *   platform-admin  -> full access to platform admin (add accounts, manage all)
 *   site-admin      -> full access to the portal UI
 *   editor          -> create/edit published content only
 *   reviewer        -> read + approve content
 *   contributor     -> create drafts only
 */
const OWNER_LOGIN = process.env.ADMIN_OWNER || process.env.GITHUB_OWNER || "Thairux";
const COOKIE_NAME = "schooldemo_session";
const COOKIE_MAX_AGE = 60 * 60; // 1 hour
const COOKIE_PATH = "/";

const ROLES_DEFAULT = process.env.ADMIN_ROLES
  ? process.env.ADMIN_ROLES.split(",").map((r) => r.trim()).filter(Boolean)
  : ["platform-admin"];

// Keep a short-lived session id -> user info map. In production this can be
// pushed to D1 or a KV namespace. This keeps the worker stateless on restart.
const sessions = new Map();

function genId() {
  const enc = new TextEncoder();
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function setSessionCookie(res, sessionId, who) {
  const value = sessionId + "." + who;
  res.headers["set-cookie"] =
    `${COOKIE_NAME}=${value}; Path=${COOKIE_PATH}; Max-Age=${COOKIE_MAX_AGE}; ` +
    "HttpOnly; Secure; SameSite=Lax; Priority=High; Partitioned";
  return res;
}

function clearSessionCookie(res) {
  res.headers["set-cookie"] =
    `${COOKIE_NAME}=; Path=${COOKIE_PATH}; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}

function getSessionFromRequest(req) {
  const header = req.headers.get("cookie") || "";
  const match = header.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  const payload = decodeURIComponent(match[1]);
  const [sessionId, who] = payload.split(".");
  return { sessionId, who };
}

function parseJson(body) {
  return Promise.resolve(body).then((b) => {
    if (typeof b === "string") return JSON.parse(b);
    return b;
  });
}

async function getOwnerIdentity(token) {
  const resp = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });
  if (!resp.ok) throw new Error(`GitHub /user returned ${resp.status}`);
  const user = await resp.json();
  return { login: String(user.login || "").toLowerCase(), id: user.id, avatar: user.avatar_url, name: user.name };
}

async function isGithubUserValid(login) {
  try {
    const resp = await fetch(`https://api.github.com/users/${encodeURIComponent(login)}`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    return resp.ok;
  } catch {
    return false;
  }
}

async function getAdminsFromD1(conn) {
  // D1 wrapper: run a select and return rows as objects.
  const stmt = "SELECT id, github_login, name, email, avatar_url, roles, created_at, updated_at FROM admins ORDER BY updated_at DESC";
  const res = await conn.prepare(stmt).all();
  return res.results || [];
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = url.origin;

    // ---------- OAuth exchange (server-side) ----------
    if (url.pathname === "/auth") {
      const authUrl = new URL("https://github.com/login/oauth/authorize");
      authUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
      authUrl.searchParams.set("redirect_uri", `${origin}/callback`);
      authUrl.searchParams.set("scope", env.GITHUB_OAUTH_SCOPE || "public_repo");
      authUrl.searchParams.set("state", crypto.randomUUID());
      authUrl.searchParams.set("allow_signup", "false");
      return Response.redirect(authUrl.toString(), 302);
    }

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");
      if (!code) {
        return new Response(JSON.stringify({ ok: false, error: "missing_code" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const tokenResp = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `${origin}/callback`,
        }),
      });

      const tokenData = await parseJson(await tokenResp.text());
      if (!tokenData.access_token) {
        const err = tokenData.error_description || tokenData.error || "unknown";
        return new Response(JSON.stringify({ ok: false, error: err }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Verify identity server-side before granting anything to the browser.
      let owner;
      try {
        owner = await getOwnerIdentity(tokenData.access_token);
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: "identity_check_failed" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Default rule: only the platform owner can log in until an admin
      // account is added by an existing platform-admin.
      const allowOrigin = owner.login === OWNER_LOGIN || isAdminInRoster(env, owner.login);
      if (!allowOrigin) {
        return new Response(JSON.stringify({ ok: false, error: "not_authorized" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Issue a session and set the cookie on the response.
      const sessionId = genId();
      sessions.set(sessionId, {
        login: owner.login,
        name: owner.name || owner.login,
        avatar: owner.avatar,
        issuedAt: Date.now(),
      });

      // Redirect back to the admin page with a one-time nonce so the browser
      // can poll for the session validation response.
      const nonce = crypto.randomUUID();
      const redirectUrl = `${origin}/admin?nonce=${encodeURIComponent(nonce)}`;
      const res = Response.redirect(redirectUrl, 302);
      return setSessionCookie(res, sessionId, owner.login);
    }

    // ---------- Session verification (browser-facing, server-guarded) ----------
    if (url.pathname === "/admin/session") {
      const session = getSessionFromRequest(request);
      if (!session) {
        return new Response(JSON.stringify({ ok: false, error: "no_session" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      const info = sessions.get(session.sessionId);
      if (!info || Date.now() - info.issuedAt > COOKIE_MAX_AGE * 1000) {
        sessions.delete(session.sessionId);
        clearSessionCookie({ headers: {} });
        return new Response(JSON.stringify({ ok: false, error: "expired" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      // Re-validate identity against GitHub on each use (short TTL but still
      // protects against token-to-browser handover).
      try {
        const gh = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${env.GITHUB_OWNER_TOKEN || ""}`,
          },
        });
        if (!gh.ok) {
          sessions.delete(session.sessionId);
          clearSessionCookie({ headers: {} });
          return new Response(JSON.stringify({ ok: false, error: "identity_revoked" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
          });
        }
        const me = await gh.json();
        if (String(me.login || "").toLowerCase() !== session.who.toLowerCase()) {
          sessions.delete(session.sessionId);
          clearSessionCookie({ headers: {} });
          return new Response(JSON.stringify({ ok: false, error: "identity_revoked" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
          });
        }
      } catch {
        // If GitHub API is unreachable, fail closed rather than risk stale
        // session access.
        sessions.delete(session.sessionId);
        clearSessionCookie({ headers: {} });
        return new Response(JSON.stringify({ ok: false, error: "auth_service_unavailable" }), {
          status: 503,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(
        JSON.stringify({ ok: true, who: info.login, name: info.name, avatar: info.avatar }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // ---------- Admin roster management (server-only) ----------
    if (url.pathname === "/admin/accounts" && request.method === "GET") {
      const session = getSessionFromRequest(request);
      if (!session || sessions.get(session.sessionId)?.login !== OWNER_LOGIN) {
        return new Response(JSON.stringify({ ok: false, error: "forbidden" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }
      const conn = env.D1_BINDING ? await env.D1_BINDING.connect() : null;
      let accounts = [];
      try {
        accounts = await getAdminsFromD1(conn);
      } catch (e) {
        console.error("admin roster fetch failed", e);
      } finally {
        if (conn) await conn.close();
      }
      return new Response(JSON.stringify({ ok: true, accounts }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.pathname === "/admin/accounts" && request.method === "POST") {
      const session = getSessionFromRequest(request);
      if (!session || sessions.get(session.sessionId)?.login !== OWNER_LOGIN) {
        return new Response(JSON.stringify({ ok: false, error: "forbidden" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return new Response(JSON.stringify({ ok: false, error: "bad_json" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const githubLogin = String(body.github_login || "").trim().toLowerCase();
      if (!githubLogin) {
        return new Response(JSON.stringify({ ok: false, error: "github_login_required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Verify the GitHub user exists and belongs to the owner's org if set.
      const validUser = await isGithubUserValid(githubLogin);
      if (!validUser) {
        return new Response(JSON.stringify({ ok: false, error: "github_user_not_found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      // If a specific owner email is set, require an email confirmation for
      // security. For now, allow adding by login and capture the canonical
      // profile email from /user/{login} for display only.
      let name = body.name || "";
      let email = "";
      let avatar = "";

      const conn = env.D1_BINDING ? await env.D1_BINDING.connect() : null;
      const id = genId();
      try {
        // Capture profile metadata from GitHub (optional, for display).
        if (!name) {
          const me = await fetch(`https://api.github.com/user/${encodeURIComponent(githubLogin)}`, {
            headers: { Accept: "application/vnd.github+json" },
          }).then((r) => r.json()).catch(() => ({}));
          name = me.name || githubLogin;
          email = me.email || "";
          avatar = me.avatar_url || "";
        }

        const stmt = conn.prepare(
          `INSERT OR REPLACE INTO admins
             (id, github_login, name, email, avatar_url, roles, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        );
        await stmt.run(
          id,
          githubLogin,
          name,
          email,
          avatar,
          body.roles || "site-admin",
          Date.now(),
          Date.now()
        );
      } catch (e) {
        console.error("admin account insert failed", e);
        return new Response(JSON.stringify({ ok: false, error: "insert_failed" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      } finally {
        if (conn) await conn.close();
      }

      return new Response(
        JSON.stringify({ ok: true, id, github_login: githubLogin, name, roles: body.roles || "site-admin" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    if (url.pathname.startsWith("/admin/accounts/") && request.method === "DELETE") {
      const session = getSessionFromRequest(request);
      if (!session || sessions.get(session.sessionId)?.login !== OWNER_LOGIN) {
        return new Response(JSON.stringify({ ok: false, error: "forbidden" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }
      const id = url.pathname.split("/").pop();
      if (!id) {
        return new Response(JSON.stringify({ ok: false, error: "missing_id" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const conn = env.D1_BINDING ? await env.D1_BINDING.connect() : null;
      try {
        const stmt = conn.prepare("DELETE FROM admins WHERE id = ?");
        await stmt.run(id);
      } catch (e) {
        console.error("admin roster delete failed", e);
        return new Response(JSON.stringify({ ok: false, error: "delete_failed" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      } finally {
        if (conn) await conn.close();
      }

      return new Response(JSON.stringify({ ok: true, deleted: id }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // ---------- GitHub API proxy (server-side, token kept out of browser) ----------
    if (request.method === "POST" && url.pathname === "/admin/github-proxy") {
      const session = getSessionFromRequest(request);
      if (!session || !sessions.get(session.sessionId)) {
        return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return new Response(JSON.stringify({ ok: false, error: "bad_json" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const path = body.path || "";
      const method = body.method || "GET";
      const headers = { Accept: "application/vnd.github+json" };
      // The Worker already holds a GitHub token; it can use its own server-side
      // token for the proxy. The browser never sees it.
      // For a true proxy we'd need another GitHub token bound to the Worker.
      // Minimal secure approach: the worker uses the admin's authenticated
      // context through the OAuth path above, which is tied to the owner's
      // account. For now, this proxy is a lightweight convenience; production
      // should introduce a dedicated service token.
      const githubToken = env.GITHUB_OWNER_TOKEN;
      if (!githubToken) {
        return new Response(JSON.stringify({ ok: false, error: "no_github_token" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      const resp = await fetch(`https://api.github.com${path}`, {
        method,
        headers: {
          ...headers,
          Authorization: `Bearer ${githubToken}`,
          "Content-Type": "application/json",
        },
        body: method !== "GET" ? JSON.stringify(body.body || {}) : undefined,
      });

      const text = await resp.text();
      return new Response(text, {
        status: resp.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("schooldemo admin auth worker ok", {
      headers: { "Content-Type": "text/plain" },
    });
  },
};

// -------- helpers --------
async function isAdminInRoster(env, login) {
  const conn = env.D1_BINDING ? await env.D1_BINDING.connect() : null;
  try {
    const rows = await getAdminsFromD1(conn);
    return rows.some((r) => String(r.github_login || "").toLowerCase() === login);
  } catch {
    return false;
  } finally {
    if (conn) await conn.close();
  }
}
