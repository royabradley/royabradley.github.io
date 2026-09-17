---
name: add-section
description: Add a home page section component to the Pilcrow theme. Use when asked for a new section or block on a page.
---

1. Check `src/components/sections/` first. If an existing section fits with different props, use it.
   Don't change the props of an existing component; create a new one instead.
2. Create `src/components/sections/<Name>.astro`. It takes everything through `Props` and fetches nothing.
3. Follow the theme conventions in `AGENTS.md`:
   - Put the label in the `hang` grid with the `section-label` utility.
   - Separate with `border-t`/`border-y`. Controls use `rounded-xs`. No cards, pills, gradients, or shadows.
   - Colors come from `@theme` tokens (`text-primary`, `border-border`, …). No hex values in classes.
   - UI strings (button labels, aria-labels) go in `src/i18n/<locale>.ts`, not in the component.
   - It must not overflow at 360px.
4. Use it in the page that needs it (`src/pages/index.astro` for the home page), passing the data as props.
5. Add an example to `src/pages/sections.astro`, the section showcase.
6. Run `pnpm check && pnpm build`, then look at `/sections` in `pnpm dev` at 360px and desktop, light and dark.
