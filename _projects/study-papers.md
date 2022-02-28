---
layout: page
title: study papers
description: unpublished theology papers
img: trinity-shield.jpg
importance: 4
category: work
years: [2021]
nav: false
---

<!-- _pages/publications.md -->
<div class="publications">

{%- for y in page.years %}
  <h2 class="year">{{y}}</h2>
  {% bibliography -f study-papers -q @*[year={{y}}]*%}
{% endfor %}

</div>


