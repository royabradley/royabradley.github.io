---
layout: page
title: Study papers
description: Biblical studies, theology, church history 
img: assets/img/berry-at-work.jpg
importance: 3
category: work
years: [2022, 2021, 2017, 2009, 2008]
---

<!-- _pages/publications.md -->
<div class="publications">

{%- for y in page.years %}
  <h2 class="year">{{y}}</h2>
  {% bibliography -f study-papers -q @*[year={{y}}]*%}
{% endfor %}

</div>


