---
layout: default
title: Writing
permalink: /blog/
---

<section class="article-head">
  <div class="page">
    <p class="kicker">Writing</p>
    <h1>Notes from the build desk</h1>
    <p class="lead">Short reflections, experiments, and lessons learned while building products, refining interfaces, and exploring new ideas.</p>
  </div>
</section>

<div class="page" style="padding-bottom: 80px;">
  <div class="post-list">
    {% for post in site.posts %}
    <article class="post-card">
      <time datetime="{{ post.date | date: '%Y-%m-%d' }}">{{ post.date | date: "%B %d, %Y" }}</time>
      <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
      {% if post.excerpt %}
      <p>{{ post.excerpt | strip_html | truncatewords: 40 }}</p>
      {% else %}
      <p>{{ post.content | strip_html | truncatewords: 40 }}</p>
      {% endif %}
      <a href="{{ post.url | relative_url }}" class="read-more">Read more →</a>
    </article>
    {% endfor %}
  </div>
</div>
