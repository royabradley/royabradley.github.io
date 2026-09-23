# Changelog

All notable changes to this project are documented here. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.3.0] - 2026-09-23

### Added

- Hungarian UI strings, `src/i18n/hu.ts`. Set `site.locale: 'hu'` for a Hungarian site, or add
  `hu` to `i18n.locales` to serve it alongside another language.
- Latin Extended font subsets for Newsreader, Inter, and JetBrains Mono. Characters such as `ő`,
  `ű`, `ł`, `ř`, and `ş` now render in the theme fonts instead of falling back to a system font.
  Each subset is its own `@font-face` with a `unicode-range`, so a page only downloads it when it
  uses one of those characters: an English site loads exactly what it did before.

### Changed

- The language switcher moved from the header to the footer, as one more link group titled
  "Language". It lists every language in its own name with the current one marked; before, the
  header showed only the other languages, and with three or more they read as extra nav items.
  The header also gets back the room it needs at 360px.

### Fixed

- Generated OG images drew empty boxes for Latin Extended characters: the title check accepted
  any Latin-script character, but the OG fonts only had the basic Latin subset. The OG fonts now
  include Latin Extended, and a title with a character they still lack gets the default OG image
  rather than a broken one.
- Removing a language from `i18n.locales` while its folder of translated posts was still in
  `src/content/blog/<locale>/` failed the build with `Missing parameter: slug`. The build now
  stops with a message naming the folder and the two ways to fix it.
- Adding a language no longer needs a registration step. Every `src/i18n/<locale>.ts` is picked
  up automatically; before, a new file was silently ignored until it was also imported in
  `src/i18n/t.ts`.

## [1.2.3] - 2026-09-23

### Fixed

- `CLAUDE.md`, which is a symlink to `AGENTS.md`, is no longer written into the release
  snapshot. An unzip that ignores the symlink bit — Windows Explorer, 7-Zip — left a broken
  file where the guide should be.

## [1.2.2] - 2026-09-22

### Changed

- The author name is spelled in lowercase — `ondelva` — in `LICENSE.md`. The license terms are
  unchanged.

## [1.2.1] - 2026-09-21

### Fixed

- The Lighthouse config listed only demo pages, so deleting one failed CI with a 404 that reads
  like a performance problem. `lighthouserc.cjs` now filters the list down to the pages that are
  actually there; restore a page and it is measured again.

## [1.2.0] - 2026-09-21

### Added

- Section components can be embedded in the body of a post, page, or work entry. Wrap one in
  `<div class="not-prose breakout">` and it keeps the width and look it has on the home page; the
  prose around it stays at the reading measure. `breakout` is a new `@utility` in `global.css`, and
  no section component had to change. A worked example ships at `/work/how-people-read-long-essays/`.
- Work entries can use the long-form features posts have: `work.series`, `work.sidenotes`, and
  `work.toc` in `src/config.ts`, plus an optional `series` field in work frontmatter. This makes the
  collection usable for essays, studies, and guides, not only portfolio case studies. All three
  default to `true`. `series` and `sidenotes` render nothing until an entry has a `series` value or
  a footnote; `toc` follows the same rule posts do and appears on an entry with 3 or more headings,
  so set it to `false` for a portfolio of short case studies.

### Fixed

- `.not-prose` now opts a block out of every `.prose` rule. Quotes, tables, list spacing, link
  underlines, and image rounding still leaked through, which restyled a section component embedded
  in a post. The only visible change to existing content is the `/docs/` index, where the list rows
  lose the body-text margin they were never meant to inherit.

## [1.1.2] - 2026-09-21

### Fixed

- The Lighthouse gate measures each URL three times instead of once. The first URL in the list
  absorbs the runner's cold start, so a page could fail the 95 threshold with the site unchanged.

## [1.1.1] - 2026-09-21

### Fixed

- The search page loaded the Pagefind index and its wasm as soon as it opened, which blocked the
  main thread for a visitor who never typed. Both are loaded on the first keystroke now; a page
  opened with `?q=` still loads them straight away.
- CI uploads the Lighthouse report when the performance gate fails. `.lighthouseci` is a dotted
  directory, and `upload-artifact` skips hidden files by default, so the report that explains a
  failure was never actually attached.

## [1.1.0] - 2026-09-21

### Added

- Umami as an analytics provider, next to Plausible and GA4. `analytics.host` points a self-hosted
  Plausible or Umami at your own origin; leave it empty for the hosted service. The default is
  still `provider: null`, and a build with nothing set loads no third-party script.

## [1.0.4] - 2026-09-19

### Fixed

- No more `[astro-icon] Failed to load icons from "src/icons"` warning on every build. `src/icons/` now ships empty, ready for your own SVG icons.

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
