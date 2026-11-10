# Working on this site

This is Roy A. Bradley's personal site, built on the Pilcrow Pro Astro theme. Read `AGENTS.md`
(the theme's guide) for commands and theme conventions, then `CUSTOMIZATIONS.md` for how this
fork stays updatable. Where the two differ, this file and `CUSTOMIZATIONS.md` win.

## Rules for this repo

- Never commit, push, or switch branches. Write changes into the working tree; Roy reviews them
  on `pnpm dev` and commits them himself.
- Put new code in `src/custom/` (components, styles, helpers). Leave theme files under
  `src/components`, `src/layouts`, `src/utils` and `src/styles/global.css` alone unless there is
  no other way.
- When a theme file must change, keep the change minimal, mark it with a `rab:` comment, and add
  a row to the seam ledger in `CUSTOMIZATIONS.md`.
- To change how a theme component behaves, fork it into `src/custom/components/` and record the
  fork in `CUSTOMIZATIONS.md`, rather than editing the original.
- Import overlay components with the `@custom/` alias:
  `import Figure from '@custom/components/Figure.astro';`
- Visual work follows Roy's Data Ink design system (Tufte, Doumont): label things directly, at
  most one emphasis color, no decoration.
- After any change, `pnpm check && pnpm build` must pass.
