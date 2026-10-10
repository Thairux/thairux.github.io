---
layout: default
title: Admin
permalink: /admin/
---

<section class="article-head">
  <div class="page">
    <p class="kicker">Admin</p>
    <h1>Content editor</h1>
    <p class="lead">Edit posts, projects, and the CV through GitHub. Commits are made as you, straight to main — Pages rebuilds automatically.</p>
  </div>
</section>

<div class="page" style="padding-bottom: 80px;">
  <div class="article-body">
    <p>The admin editor lives at <a href="{{ '/admin/index.html' | relative_url }}">/admin/index.html</a>.
    It edits posts (<code>_posts/</code>), projects (<code>_projects/</code>), and the CV
    (<code>_data/cv.yml</code>) through the GitHub API, authenticated with the GitHub OAuth worker
    (<code>thairux-auth.ptmthairu.workers.dev</code>).</p>

    <p>The CV page renders from <code>_data/cv.yml</code> — the single source of truth — and its
    <strong>Export as PDF</strong> button uses the browser print pipeline with a dedicated print
    stylesheet, so the exported PDF is a clean, ink-friendly document rather than a screenshot of
    the dark site.</p>

    <p>Because the CV renders from the same data the pages do, every section added to
    <code>_data/cv.yml</code> (experience, education, skills, projects, languages) appears on both
    the CV page and the PDF export — nothing is lost between the base CV and the living site.</p>
  </div>
</div>
