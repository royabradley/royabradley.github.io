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
