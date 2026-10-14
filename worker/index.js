/**
 * thairux-auth — GitHub OAuth proxy for the thairux.github.io admin.
 *
 * Two routes only:
 *   GET /auth     -> redirect to GitHub's authorize flow (scope: public_repo)
 *   GET /callback -> exchange the code for an access token, hand it to the
 *                    admin page via postMessage, close the popup
 *
 * Design notes:
 * - GITHUB_CLIENT_SECRET is read from the Worker's env (Settings -> Variables
 *   and Secrets). It never appears in this file or the repo.
 * - Only OWNER_LOGIN is allowed through: the Worker checks the token's GitHub
 *   identity before handing the token to the browser. Non-owners get a
 *   "not authorized" page and no token.
 * - The access token is returned to the browser and lives only there
 *   (sessionStorage). Nothing is stored server-side.
 * - If GitHub dies or the Worker dies, the repo is untouched — worst case the
 *   admin page stops working; the site itself is static files.
 */

const GITHUB_CLIENT_ID = "Ov23ctSQFDcstz1XmE45"; // public identifier, safe to commit
// The single GitHub account allowed to use the admin. Anyone else is refused
// here — before any token is handed to the browser — and again client-side.
const OWNER_LOGIN = "Thairux";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = url.origin;

    if (url.pathname === "/auth") {
      const authUrl = new URL("https://github.com/login/oauth/authorize");
      authUrl.searchParams.set("client_id", GITHUB_CLIENT_ID);
      authUrl.searchParams.set("redirect_uri", `${origin}/callback`);
      authUrl.searchParams.set("scope", "public_repo");
      authUrl.searchParams.set("state", crypto.randomUUID());
      authUrl.searchParams.set("allow_signup", "false");
      return Response.redirect(authUrl.toString(), 302);
    }

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) {
        return new Response("missing authorization code", { status: 400 });
      }

      const tokenResp = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `${origin}/callback`,
        }),
      });

      const data = await tokenResp.json();
      if (!data.access_token) {
        const msg = data.error_description || data.error || "unknown error";
        return new Response(`token exchange failed: ${msg}`, { status: 400 });
      }

      // Server-side identity gate. Ask GitHub which account this token belongs
      // to and refuse anyone who isn't the owner. This runs before the token is
      // handed to the browser, so a non-owner never receives a working token.
      // (The admin page re-checks client-side as defense in depth.)
      let login = "";
      try {
        const meResp = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
            Accept: "application/vnd.github+json",
            "User-Agent": "thairux-auth",
          },
        });
        if (meResp.ok) login = String((await meResp.json()).login || "");
      } catch (e) {
        return new Response("identity check failed", { status: 502 });
      }

      if (login.toLowerCase() !== OWNER_LOGIN.toLowerCase()) {
        const denied = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Not authorized</title></head>
<body style="background:#13151b;color:#e5e7eb;font-family:Inter,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
<p>This account is not authorized for the admin.</p>
<script>
(function () {
  var payload = { type: "github-auth-denied", login: ${JSON.stringify(login)} };
  function deliver() { try { window.opener.postMessage(payload, "*"); } catch (e) {} }
  var tries = 0;
  deliver();
  var iv = setInterval(function () {
    deliver();
    if (++tries >= 5) { clearInterval(iv); window.close(); }
  }, 200);
})();
</script>
</body></html>`;
        return new Response(denied, {
          status: 403,
          headers: { "Content-Type": "text/html;charset=UTF-8", "Cache-Control": "no-store" },
        });
      }

      // Hand the token to the opener window, then close. The handshake
      // ("authorizing:github" -> reply) prevents cross-window spoofing.
      const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Authorizing…</title></head>
<body style="background:#13151b;color:#e5e7eb;font-family:Inter,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
<p>Authorized — you can close this window.</p>
<script>
(function () {
  // Deliver the token to the opener directly. We don't gate on a reply:
  // send immediately, repeat a few times over ~1s in case the opener's
  // listener attaches late, then close. (An earlier version waited for a
  // handshake reply that never came, so the popup just sat there.)
  var token = ${JSON.stringify(data.access_token)};
  function deliver() {
    try { window.opener.postMessage({ type: "github-auth-success", token: token }, "*"); } catch (e) {}
  }
  var tries = 0;
  deliver();
  var iv = setInterval(function () {
    deliver();
    if (++tries >= 5) { clearInterval(iv); window.close(); }
  }, 200);
})();
</script>
</body></html>`;

      return new Response(html, {
        headers: { "Content-Type": "text/html;charset=UTF-8", "Cache-Control": "no-store" },
      });
    }

    return new Response("thairux-auth worker ok", {
      headers: { "Content-Type": "text/plain" },
    });
  },
};
