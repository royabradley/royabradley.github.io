---
layout: page
title: projects
permalink: /projects/
subtitle: Hello
description:
nav: true
display_categories: [work]
horizontal: false
---

<blockquote>
    <p align="left">Good human work honors God's work. Good work uses no thing without respect, both for what it is in itself and for its origin. It uses neither tool nor material that it does not respect and that it does not love.... To work without pleasure or affection, to make a product that is not both useful and beautiful, is to dishonor God, nature, the thing that is made, and whomever it is made for. This is blasphemy: to make shoddy work of the work of God.</p>
    <figcaption align="right">— Wendell Berry, <em>Our Real Work</em></figcaption>
</blockquote>


<!-- pages/projects.md -->
<div class="projects">
{%- if site.enable_project_categories and page.display_categories %}
  <!-- Display categorized projects -->
  {%- for category in page.display_categories %}
  <h2 class="category">{{ category }}</h2>
  {%- assign categorized_projects = site.projects | where: "category", category -%}
  {%- assign sorted_projects = categorized_projects | sort: "importance" %}
  <!-- Generate cards for each project -->
  {% if page.horizontal -%}
  <div class="container">
    <div class="row row-cols-2">
    {%- for project in sorted_projects -%}
      {% include projects_horizontal.html %}
    {%- endfor %}
    </div>
  </div>
  {%- else -%}
  <div class="grid">
    {%- for project in sorted_projects -%}
      {% include projects.html %}
    {%- endfor %}
  </div>
  {%- endif -%}
  {% endfor %}

{%- else -%}
<!-- Display projects without categories -->
  {%- assign sorted_projects = site.projects | sort: "importance" -%}
  <!-- Generate cards for each project -->
  {% if page.horizontal -%}
  <div class="container">
    <div class="row row-cols-2">
    {%- for project in sorted_projects -%}
      {% include projects_horizontal.html %}
    {%- endfor %}
    </div>
  </div>
  {%- else -%}
  <div class="grid">
    {%- for project in sorted_projects -%}
      {% include projects.html %}
    {%- endfor %}
  </div>
  {%- endif -%}
{%- endif -%}
</div>
