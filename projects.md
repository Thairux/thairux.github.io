---
layout: default
title: Projects
permalink: /projects/
---

<section class="article-head">
  <div class="page">
    <p class="kicker" style="font-family: var(--mono); font-size: 12px; color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em;">Work</p>
    <h1>Projects</h1>
    <p class="lead">Real systems, built and maintained. Each one exists because I had the problem myself.</p>
  </div>
</section>

<div class="page" style="padding-bottom: 80px;">
  <div class="projects-grid">

    <div class="project-card">
      <span class="badge">Developer infrastructure</span>
      <h3>Cross-Agent Memory Protocol</h3>
      <p>An open protocol that lets multiple AI coding assistants share one persistent memory — plans, decisions, and project context follow you across tools instead of resetting each session.</p>
      <p>Built the core engine with a compressed knowledge store (symbol counts and content hashes rather than full text overhead), the protocol server exposing the memory as standard tools, and integrations across three agent platforms. Full-text search, version history, and change tracking. Fully tested, shipped, and in daily use.</p>
      <div class="project-stack"><span>TypeScript</span><span>SQLite</span><span>Full-text search</span><span>MCP</span></div>
      <span class="project-link">In active development →</span>
    </div>

    <div class="project-card">
      <span class="badge">Desktop application</span>
      <h3>Local AI Life Agent</h3>
      <p>A privacy-first desktop agent that runs entirely on local models — remembers everything, generates media, and manages personal workflows without any cloud dependency.</p>
      <p>Complete Electron application with an embedded agent runtime, local LLM inference, and a media generation pipeline covering illustrations, voice synthesis, and comic layouts. Includes a boot-level health gate that verifies the local stack is usable before the app starts.</p>
      <div class="project-stack"><span>Electron</span><span>React</span><span>TypeScript</span><span>Ollama</span></div>
      <span class="project-link">In active development →</span>
    </div>

    <div class="project-card">
      <span class="badge">Platform</span>
      <h3>Trading Signals Platform</h3>
      <p>A full-stack market analysis platform combining a Python backend, signal processing pipeline, and an Electron dashboard for real-time market monitoring and analysis.</p>
      <p>Backend ingests and normalizes market data, applies signal strategies, and serves results through a REST API consumed by the desktop dashboard.</p>
      <div class="project-stack"><span>Python</span><span>Electron</span><span>REST APIs</span></div>
      <span class="project-link">Shipped →</span>
    </div>

    <div class="project-card">
      <span class="badge">Automation</span>
      <h3>Developer Workflow Tooling</h3>
      <p>A personal suite of skills, hooks, and rules that automate how AI assistants work across my machine — read-enforcement, auto-caching, session handoffs, and context injection.</p>
      <p>The system that keeps five separate AI tools in sync with one shared memory, enforces safe file practices, and automates context capture between sessions. The tooling behind almost everything else on this list.</p>
      <div class="project-stack"><span>Bash</span><span>TypeScript</span><span>Automation</span><span>Hooks</span></div>
      <span class="project-link">Shipped →</span>
    </div>

  </div>
</div>
