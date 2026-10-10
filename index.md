---
layout: default
title: Home
---

<section class="hero">
  <div class="page">
    <p class="availability">Available for new opportunities</p>
    <h1>Peter Thairu Muigai — <em>AI-primary developer</em> building intelligent tooling and automation.</h1>
    <p class="lead">Computer Science graduate with hands-on experience building AI agent tooling, automation systems, and cross-platform developer infrastructure. Currently interning at Pixel Academy, teaching robotics and AI fundamentals to young learners while shipping production-grade developer tools on the side.</p>
    <div class="actions">
      <a href="{{ '/projects/' | relative_url }}" class="btn btn-primary">View my work</a>
      <a href="{{ '/cv/' | relative_url }}" class="btn btn-secondary">Read the CV</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="page">
    <div class="section-head">
      <p class="kicker">Skills</p>
      <h2>The stack I build with</h2>
      <p>Tools I use daily to ship real systems — not tutorials, working infrastructure.</p>
    </div>
    <div class="skills-grid">
      <div class="skill-group">
        <h3>Languages</h3>
        <div class="skill-tags">
          <span class="skill-tag">TypeScript</span>
          <span class="skill-tag">JavaScript</span>
          <span class="skill-tag">Python</span>
          <span class="skill-tag">SQL</span>
          <span class="skill-tag">Bash</span>
        </div>
      </div>
      <div class="skill-group">
        <h3>Applications &amp; Desktop</h3>
        <div class="skill-tags">
          <span class="skill-tag">Electron</span>
          <span class="skill-tag">React</span>
          <span class="skill-tag">Node.js</span>
          <span class="skill-tag">REST APIs</span>
        </div>
      </div>
      <div class="skill-group">
        <h3>Data &amp; Storage</h3>
        <div class="skill-tags">
          <span class="skill-tag">SQLite</span>
          <span class="skill-tag">Full-text search</span>
          <span class="skill-tag">Schema design</span>
        </div>
      </div>
      <div class="skill-group">
        <h3>AI &amp; Agents</h3>
        <div class="skill-tags">
          <span class="skill-tag">MCP servers</span>
          <span class="skill-tag">Local LLMs</span>
          <span class="skill-tag">Ollama</span>
          <span class="skill-tag">Agent automation</span>
          <span class="skill-tag">Prompt engineering</span>
        </div>
      </div>
      <div class="skill-group">
        <h3>Engineering practices</h3>
        <div class="skill-tags">
          <span class="skill-tag">Test-driven</span>
          <span class="skill-tag">Automation-first</span>
          <span class="skill-tag">Cross-tool integration</span>
          <span class="skill-tag">Security-minded</span>
        </div>
      </div>
      <div class="skill-group">
        <h3>Also comfortable with</h3>
        <div class="skill-tags">
          <span class="skill-tag">Git &amp; GitHub</span>
          <span class="skill-tag">Jekyll</span>
          <span class="skill-tag">Cloudflare</span>
          <span class="skill-tag">ffmpeg</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="page">
    <div class="section-head">
      <p class="kicker">Experience</p>
      <h2>Where I've worked</h2>
    </div>
    <div class="timeline">
      <div class="timeline-item current">
        <p class="timeline-role">Intern, Office &amp; Instruction — <span class="org">Pixel Academy</span></p>
        <p class="timeline-meta">Current · Nakuru, Kenya</p>
        <ul>
          <li>Serve as assistant instructor supporting lead instructors in robotics and AI education programs for children and teens</li>
          <li>Translate complex technical concepts (programming logic, robotics, AI fundamentals) into age-appropriate lessons and hands-on exercises</li>
          <li>Coordinate day-to-day academy operations: scheduling, learner records, resource preparation, and equipment setup</li>
          <li>Maintain and troubleshoot the academy's teaching hardware — laptops, robotics kits, and classroom tech</li>
          <li>Skills gained: technical instruction, curriculum support, mentoring young learners, operational coordination</li>
        </ul>
      </div>
      <div class="timeline-item">
        <p class="timeline-role">ICT Attachment — <span class="org">Nakuru Teaching &amp; Referral Hospital</span></p>
        <p class="timeline-meta">3 months · ICT Department</p>
        <ul>
          <li>Provided first-line technical support to clinical and administrative staff across hardware, software, and network issues</li>
          <li>Diagnosed and resolved day-to-day ICT problems to minimize downtime of systems supporting hospital operations</li>
          <li>Supported routine system maintenance, user account management, and department documentation</li>
          <li>Collaborated with the ICT team on infrastructure reliability in a high-demand healthcare environment</li>
        </ul>
      </div>
      <div class="timeline-item">
        <p class="timeline-role">BSc Computer Science — <span class="org">Kabarak University</span></p>
        <p class="timeline-meta">Final results pending</p>
        <ul>
          <li>Core training in software engineering, systems, and problem-solving</li>
          <li>Computer Networking short-course certification completed alongside degree</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="page">
    <div class="section-head">
      <p class="kicker">Work</p>
      <h2>Selected projects</h2>
      <p>Real systems, built and maintained — each one solving a problem I actually had.</p>
    </div>
    <div class="projects-grid">
      <div class="project-card">
        <span class="badge">Developer infrastructure</span>
        <h3>Cross-Agent Memory Protocol</h3>
        <p>An open protocol that lets multiple AI coding assistants share one persistent memory — plans, decisions, and project context follow you across tools instead of resetting each session. Built the core engine, the MCP server, and integrations across three agent platforms. Fully tested, in daily use.</p>
        <div class="project-stack"><span>TypeScript</span><span>SQLite</span><span>MCP</span><span>FTS</span></div>
        <span class="project-link">In active development →</span>
      </div>
      <div class="project-card">
        <span class="badge">Desktop application</span>
        <h3>Local AI Life Agent</h3>
        <p>A privacy-first desktop agent that runs entirely on local models — remembers everything, generates media (illustrations, voice, comics), and manages personal workflows without any cloud dependency. Full Electron application with media generation pipeline.</p>
        <div class="project-stack"><span>Electron</span><span>React</span><span>Ollama</span><span>Python</span></div>
        <span class="project-link">In active development →</span>
      </div>
      <div class="project-card">
        <span class="badge">Platform</span>
        <h3>Trading Signals Platform</h3>
        <p>A full-stack market analysis platform combining a Python backend, signal processing pipeline, and an Electron dashboard for real-time market monitoring and analysis.</p>
        <div class="project-stack"><span>Python</span><span>Electron</span><span>REST APIs</span></div>
        <span class="project-link">Shipped →</span>
      </div>
      <div class="project-card">
        <span class="badge">Automation</span>
        <h3>Developer Workflow Tooling</h3>
        <p>A personal suite of skills, hooks, and rules that automate how AI assistants work across my machine — read-enforcement, auto-caching, session handoffs, and context injection. The system that keeps five AI tools in sync with one memory.</p>
        <div class="project-stack"><span>Bash</span><span>TypeScript</span><span>Automation</span></div>
        <span class="project-link">Shipped →</span>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="page">
    <div class="now-panel">
      <div class="now-head">
        <h3><span class="pulse"></span> Currently building</h3>
        <time>Updated continuously</time>
      </div>
      <div class="now-body">
        <ul>
          <li>Formalizing the cross-agent memory protocol for public release as an open standard</li>
          <li>Building the media generation pipeline for the local AI agent — illustrations and voice synthesis</li>
          <li>Teaching robotics and AI fundamentals at Pixel Academy while continuing to ship</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="page">
    <div class="section-head">
      <p class="kicker">Contact</p>
      <h2>Get in touch</h2>
    </div>
    <div class="contact-grid">
      <div class="contact-card">
        <p class="label">Email</p>
        <p class="value">ptmthairu@gmail.com</p>
      </div>
      <div class="contact-card">
        <p class="label">Phone</p>
        <p class="value">0715 538 259</p>
      </div>
      <div class="contact-card">
        <p class="label">Location</p>
        <p class="value">Lanet, Nakuru, Kenya</p>
      </div>
      <div class="contact-card">
        <p class="label">GitHub</p>
        <p class="value">{{ site.social_profiles.github }}</p>
      </div>
    </div>
  </div>
</section>
