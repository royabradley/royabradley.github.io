# src/custom — the site overlay

Everything in this folder is mine, not Pilcrow's. A theme update never touches it, so code here
survives every upgrade without conflicts. See `CUSTOMIZATIONS.md` at the repo root for the full
architecture and the update procedure.

| Folder        | What goes here                                                                       |
| ------------- | ------------------------------------------------------------------------------------ |
| `components/` | New components (figures, diagrams, marginalia), and forks of theme components        |
| `styles/`     | `custom.css`, loaded by one `@import` in `src/styles/global.css`                     |
| `utils/`      | Helpers for overlay components (data loaders, formatting)                             |

Import from content or pages with the alias, which works at any folder depth:

```mdx
import Figure from '@custom/components/Figure.astro';
```

A fork of a theme component keeps the theme's file name, and its first line records where it came
from, for example `<!-- rab: forked from src/components/blog/Sidenotes.astro at Pilcrow v1.3.0 -->`.

## Figure

A numbered figure whose caption states the message. See the header comment in
`components/Figure.astro` for the rules on SVG names and the one emphasis color, and
`src/content/blog/figure-reference.mdx` for working examples of each.

```mdx
import Figure from '@custom/components/Figure.astro';
import chart from '../../assets/chart.png';

<Figure src={chart} alt="…" caption="Completion falls fastest between 2,000 and 4,000 words." />

<Figure width="wide" caption="Only Sunday essays held readers past halfway." source="Site analytics, 2026">
  <svg role="img" viewBox="0 0 1000 240">…</svg>
</Figure>

<Figure width="margin" caption="Weekly visits rose steadily all year.">…</Figure>
```

`width` is `column` (default), `wide` or `margin`. Figures number themselves ("Figure 1.") in page
order, independently of theorems.
