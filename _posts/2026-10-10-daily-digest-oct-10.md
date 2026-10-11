---
layout: post
title: "Daily Digest  Oct 10: TKC v2 Shared Brain, Security Guard, and Global Board"
date: "2026-10-10 20:00:00 +0000"
author: Thairux
permalink: /daily-digest-oct-10/
description: daily digest oct 10
---
A quiet Saturday of deep work on the cross-agent memory subsystem. No new project starts â just sharp, focused commits pushing the foundation layer forward.

## TKC v2: Shared Brain goes live

The biggest milestone landed today: **TKC v2: Shared Brain**, a single commit that introduces the core primitives that let multiple AI assistants share one persistent memory instead of resetting each session.

This isn't scaffolding â it's the engine. The commit touches twenty source files and ships four fully new subsystems:

- **Comments** â threaded notes anchored to files, queries, or symbols
- **Symbols** â a persistent index of functions, classes, and declarations across tools
- **History** â append-only event log for all memory mutations
- **Write-through** â changes made by any tool propagate into shared storage
- **Rules** â enforced policies (read-enforcement, auto-caching, handoffs)
- **Fingerprint** â content identity and change detection
- **Board** â a global message board for cross-tool visibility
- **Handoffs** â session-to-session context transfer

The test suite came along for the ride: **board.test.ts**, **comments.test.ts**, **diff.test.ts**, **docs.test.ts**, and **export.test.ts** â forty tests, all green. The README was rewritten to match the new shape.

## Security hardening: path guard

Before write-through goes anywhere near real disks, it needs to be safe. A second commit added **pathguard.ts** with 100 lines of guards covering:

- Path traversal prevention
- Symlink escape blocking
- Secret-content sweep (writes containing sensitive patterns are refused)

The write module was extended to route every mutation through the guard, and **pathguard.test.ts** (135 lines) plus updates to **write.test.ts** keep the behavior locked.

## Global message board

A third commit extended the board from a local scratch space into a **global message board** â 690 insertions across `board.ts`, `server.ts`, and a new `board-global.test.ts`. This is the cross-tool visibility layer that lets assistants leave structured notes for whatever shows up next, wherever it runs.

## DB fork fix + debug surface

A smaller infra fix made the bundled database the unconditional default while exposing a `TKC_DEBUG` flag that surfaces the resolved storage path â the kind of thing that either saves ten minutes or costs ten minutes every day.

## Comment CLI refinement

The final commit improved the comment CLI to support the `add` subcommand form plus an `--author` flag, so structured notes can be written programmatically instead of only through the MCP server.

## Stack snapshot

| Layer | Technology |
|---|---|
| Memory protocol | TKC v2 |
| Runtime | Bun |
| Storage | SQLite + FTS5 |
| Server | Custom MCP server |
| Tests | Bun test runner, 40 passing |

## What's next

- Hook TKC v2 into Hermes and OpenCode via their plugin interfaces
- Wire TKC memory into Mosse (the Windows AI desktop agent) as its shared brain
- Surface the global board through a lightweight web view for quick eyeballing

---

*This is the architecture layer â invisible to end users, essential to everything that runs on top. Ship it, then build on it.*
