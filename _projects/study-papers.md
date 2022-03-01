---
layout: page
title: Study papers
description: Biblical studies and theology
img: assets/img/trinity-shield.jpg
importance: 
category: work
years: [2022, 2021, 2008]
---

<!-- _pages/publications.md -->
<div class="publications">

{%- for y in page.years %}
  <h2 class="year">{{y}}</h2>
  {% bibliography -f study-papers -q @*[year={{y}}]*%}
{% endfor %}

</div>


