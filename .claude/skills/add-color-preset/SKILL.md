---
name: add-color-preset
description: Add a color preset to the Pilcrow theme. Use when asked for a new palette, color scheme, or preset.
---

1. In `src/styles/global.css`, copy an existing pair of `html[data-preset='…']` and `html[data-preset='…'].dark` blocks
   and rename them. Set all five tokens in both: `--color-background`, `--color-foreground`, `--color-muted`,
   `--color-border`, `--color-primary`. Keep one variable per line with 6-digit hex values
   (`src/utils/palette.js` parses them for OG images and the contrast check).
2. Add the name to the `theme.preset` type union in `src/config.ts`.
3. Add the name to the `presets` list in `src/pages/_styleguide.astro`.
4. Run `pnpm check:contrast`. Every text color must reach WCAG AA (4.5:1) in light and dark; adjust until it passes.
5. Preview at `/styleguide?preset=<name>` in `pnpm dev`, in both modes.
6. Run `pnpm check && pnpm build`.
