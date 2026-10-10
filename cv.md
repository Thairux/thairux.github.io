---
layout: default
title: CV
permalink: /cv/
---

{% assign cv = site.data.cv %}

<section class="article-head">
  <div class="page">
    <p class="kicker">Curriculum Vitae</p>
    <h1>{{ cv.contact.name }}</h1>
    <p class="lead">{{ cv.contact.tagline }}</p>
    <p class="cv-contact">
      {{ cv.contact.location }} &nbsp;·&nbsp; {{ cv.contact.phone }} &nbsp;·&nbsp;
      <a href="mailto:{{ cv.contact.email }}">{{ cv.contact.email }}</a> &nbsp;·&nbsp;
      <a href="{{ cv.contact.website }}" target="_blank" rel="noopener noreferrer">{{ cv.contact.website | remove: 'https://' }}</a>
    </p>
    <p class="cv-actions">
      <a href="{{ '/admin/' | relative_url }}" class="btn btn-secondary">Edit this CV</a>
      <button type="button" class="btn btn-primary" id="cv-print-btn">Export as PDF</button>
    </p>
  </div>
</section>

<div class="page" style="padding-bottom: 80px;">
  <div class="article-body cv-body" id="cv-document">

    <h2>Professional Summary</h2>
    <p>{{ cv.summary }}</p>

    <h2>Professional Experience</h2>
    {% for role in cv.experience %}
    <h3>{{ role.role }} — {{ role.org }}</h3>
    <p class="cv-meta">{{ role.period }}{% if role.location %} · {{ role.location }}{% endif %}</p>
    <ul>
      {% for bullet in role.bullets %}<li>{{ bullet }}</li>{% endfor %}
    </ul>
    {% if role.skills %}
    <p class="cv-skills"><strong>Skills gained:</strong> {{ role.skills | join: ', ' }}</p>
    {% endif %}
    {% endfor %}

    <h2>Education</h2>
    {% for entry in cv.education %}
    <h3>{{ entry.qualification }}</h3>
    <p class="cv-meta">{{ entry.institution }}{% if entry.status %} · {{ entry.status }}{% endif %}</p>
    {% if entry.detail %}<p>{{ entry.detail }}</p>{% endif %}
    {% endfor %}

    <h2>Technical Skills</h2>
    {% for group in cv.skills %}
    <h3>{{ group.name }}</h3>
    <ul class="cv-skill-list">
      {% for item in group.items %}<li>{{ item }}</li>{% endfor %}
    </ul>
    {% endfor %}

    <h2>Selected Projects</h2>
    {% for project in cv.projects %}
    <h3>{{ project.name }} <span class="cv-status">{{ project.status }}</span></h3>
    <p>{{ project.description }}</p>
    {% if project.stack %}<p class="cv-stack">{{ project.stack | join: ' · ' }}</p>{% endif %}
    {% endfor %}

    <h2>Languages</h2>
    <ul class="cv-skill-list">
      {% for lang in cv.languages %}<li>{{ lang.name }} — {{ lang.level }}</li>{% endfor %}
    </ul>

    <h2>Referees</h2>
    <p>{{ cv.referees }}</p>

  </div>
</div>
