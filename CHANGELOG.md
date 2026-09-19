# Changelog

All notable changes to this project are documented here. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.3] - 2026-09-19

### Fixed

- `pnpm install` works with pnpm 9 and older pnpm 10 releases. The project now pins pnpm 10.34.5 instead of pnpm 12, which older pnpm could not read or switch to.

### Changed

- README: HTTPS clone URL, install steps for the zip download, and the required Node.js and pnpm versions.
- `docs/deploy.md`: removed deploy buttons (they need a public repository) and added steps to push your copy to your own repository first.

## [1.0.2] - 2026-09-17

### Fixed

- Lists marked `not-prose` no longer get prose bullets or numbers (the `/docs` index showed numbers outside the page margin on phones).

## [1.0.1] - 2026-09-17

### Changed

- README links to the Pro checkout page.

## [1.0.0] - 2026-09-17

### Changed

- Home is now a writer's front page: the latest essay set large, earlier posts, and the newsletter. Theme marketing moved to `/features`.
- Section labels are serif italic in a hanging left column (`section-label`, `hang`), replacing small uppercase labels.
- Buttons and inputs have square corners; the newsletter, split, and pricing blocks use rules instead of rounded cards.
- Section headings use regular weight; spacing now varies by section.
- Footer shows its link group titles. Demo author is "Ada Marlow".
- Rewritten page copy and sample essays; two short posts added.

### Added

- Tag index at `/blog/tag/`, linked from each tag page.
- `/styleguide` is built for production too; turn it off with `features.styleguide`.
- Agent files: `.cursor/rules/pilcrow.mdc` and Claude Code skills in `.claude/skills/` (new post, section, color preset).
- Rubricated drop cap (`blog.dropCap`) and margin sidenotes on wide screens (`blog.sidenotes`).
- User docs: `docs/customization.md`, `docs/content.md`, `docs/deploy.md`. `AGENTS.md` map updated.
- Integrations: newsletter providers (Buttondown, Kit), Giscus comments, contact form submitted without a page reload.
- Four color presets, three font pairings, generated per-post OG images (satori).
- Blog: authors, series, table of contents, reading time, related posts, `Callout` and code copy button in MDX.
- Pages: Pricing, Features, Team, Newsletter, Changelog, Cookies, Accessibility; `docs` and `work` collections.
- 20 home sections, all shown on `/sections`.
- Pagefind search (`/search`) and i18n routing (`/<locale>/blog/…`, language switcher, hreflang).
- Project scaffold (Astro 7, Tailwind v4, MDX, sitemap, RSS, astro-icon).
