# Pilcrow — Guide for AI agents

This is the first file AI agents (Claude Code, Cursor, etc.) should read before editing this theme.
Humans can read it too, but sentences are written so an agent can act on them without guessing.

## Commands

```sh
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # outputs dist/
pnpm check      # astro check (types + templates)
pnpm check:contrast  # WCAG AA check for every color preset
pnpm lint
pnpm format
```

After any change, `pnpm check && pnpm build` must pass.

## Where to edit

| To change                                | File                                                                                          | Notes                                                                                             |
| ---------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Site name, URL, description, social, nav | `src/config.ts`                                                                               | No site-specific values are hardcoded anywhere else                                               |
| Color palette                            | `@theme` block in `src/styles/global.css`                                                     | Tailwind v4 CSS variables. There is no `tailwind.config.*`                                        |
| Fonts                                    | `@theme` in `src/styles/global.css` + `src/assets/fonts/`                                     | Self-hosted. Never link external font services                                                    |
| Pick a color preset or font pairing      | `theme.preset` / `theme.fonts` in `src/config.ts`                                             | Values map to `data-preset` / `data-fonts` blocks in `global.css`. Preview: `/styleguide?preset=` |
| Add a color preset                       | `html[data-preset='…']` blocks in `src/styles/global.css`                                     | Light and dark both. Then run `pnpm check:contrast` (AA)                                          |
| Post OG image design                     | `src/utils/og.ts`                                                                             | satori. Disable with `theme.ogImages: false`. Fonts in `src/assets/fonts/og/` (woff)              |
| Logo, favicon                            | `src/assets/logo.svg`, `public/favicon.svg`                                                   |                                                                                                   |
| Default OG image                         | `src/assets/og-default.png`                                                                   | 1200×630. Imported by `site.defaultOgImage` in `config.ts`                                        |
| Home section order and content           | `src/pages/index.astro`                                                                       | Assembles components from `src/components/sections/` via props                                    |
| Add a section                            | `src/components/sections/<Name>.astro`                                                        | Props only, no data fetching. Add it to `src/pages/sections.astro` (showcase) too                 |
| Add a blog post                          | `src/content/blog/<slug>.mdx`                                                                 | Frontmatter schema below                                                                          |
| Authors                                  | `src/content/authors.json`                                                                    | Entry `id` is the post's `author` value. Page: `/blog/author/<id>/`                               |
| Docs pages, case studies                 | `src/content/docs/`, `src/content/work/`                                                      | Layouts: `src/layouts/DocsLayout.astro`, `CaseStudyLayout.astro`                                  |
| Long-form options for work               | `work` in `src/config.ts`                                                                     | `series`/`sidenotes`/`toc`, all on. The first two need frontmatter; `toc` needs 3+ headings       |
| Section inside a post or work entry      | Wrap it in `<div class="not-prose breakout">` in the `.mdx`                                   | `breakout` is an `@utility` in `global.css`. Never modify the section component itself            |
| MDX components in posts                  | `src/components/mdx/Callout.astro`, `CopyCode.astro`                                          | `Callout` is injected via `components`, no import needed                                          |
| Content schema fields                    | `src/content.config.ts`                                                                       | Never remove fields; add new ones as optional                                                     |
| Header, footer                           | `src/components/common/Header.astro`, `Footer.astro`                                          | Link lists live in `config.ts`                                                                    |
| SEO meta                                 | `src/components/common/SEO.astro`                                                             | Pages only pass `title` / `description` props                                                     |
| New page                                 | `src/pages/<name>.astro` using `PageLayout`                                                   |                                                                                                   |
| UI strings (buttons, labels)             | `src/i18n/<locale>.ts`                                                                        | Never write UI strings inside components                                                          |
| Add a language, translate posts          | `i18n.locales` in `config.ts` + `src/i18n/<locale>.ts`; posts in `src/content/blog/<locale>/` | Components use `useT(Astro.currentLocale)`. A translation uses the same file name as the original |
| Newsletter, comments, contact form       | `forms`, `giscus`, `features.comments` in `config.ts`                                         | Newsletter providers: `src/utils/forms.ts`. Comments: `src/components/blog/Comments.astro`        |
| Search                                   | `features.search` in `config.ts`, `src/pages/_search.astro`                                   | Pagefind builds the index at the end of `pnpm build`. Scope is `data-pagefind-body`               |
| Analytics                                | `analytics` in `config.ts`                                                                    | Rendered by `src/components/common/Analytics.astro`                                               |

## Don't

- Don't change the props signature of components in `src/components/ui/`. Create a new component instead.
- Don't add client-side framework islands (React/Vue/Svelte). Use `<script>` tags and CSS for interaction.
- Don't use `<img>` directly. Use `<Image>` / `<Picture>` from `astro:assets`.
- Don't put images in `public/` (favicon and robots excepted). Put them in `src/assets/`.
- Don't link external CDNs (fonts, scripts, icons).
- Don't remove accessibility features (skip link, focus ring, alt, aria-label).
- Don't add third-party assets that aren't listed in `THIRD-PARTY-NOTICES.md`. If you add one, add the notice too.
- Don't add a `.prose` rule in `global.css` without the `:not(:where(.not-prose, .not-prose *))` guard. Embedded section components rely on it.

## Content schema (`src/content.config.ts`)

```
blog:
  title: string           # required
  description: string     # required, max 160 chars
  pubDate: date           # required
  updatedDate?: date
  heroImage?: image       # path relative to the post, under src/assets
  heroAlt?: string        # required when heroImage is set
  tags: string[]          # default []
  draft: boolean          # default false; true excludes it from the build
  author?: string         # id in src/content/authors.json; falls back to site.author
  series?: string         # posts with the same value are grouped, ordered by pubDate

authors (src/content/authors.json):
  id, name, bio, url?

docs:
  title, description (max 160), order (default 0, sidebar ascending)

work:
  title, description (max 160), year, client?, role?, heroImage?, heroAlt?, draft
  series?                 # entries sharing a value are grouped; needs work.series in config.ts
```

Human-readable version: `docs/content.md`.

## Theme conventions

- Section components work from props only. The page passes the data.
- Use `@theme` variables (`--color-primary`, etc.) for color. No arbitrary hex values in classes.
- Dark mode uses the `dark:` variant, driven by the `html.dark` class.
- Mobile first. Anything that breaks at 360px is a bug.
- Section labels use the `section-label` utility (serif italic), placed in a `hang` grid so the label sits in the left margin. Don't use small uppercase text with wide letter-spacing.
- Rules, not boxes: separate content with `border-t`/`border-y`. Controls use `rounded-xs`. No pill buttons, `rounded-2xl` cards, gradients, glass, or heavy shadows.
- Vary section spacing and alignment to fit the content; don't give every section the same padding or center the closing block by default.
- Write copy in the site owner's voice: plain and specific.
- One component per file. No barrel `index.ts` files.

## Workflow

1. Find the file in the map above. If the request isn't covered, tell the user which files you plan to touch first.
2. Make the change.
3. Run `pnpm check && pnpm build` and report the result.
4. For visual changes (layout, color), start `pnpm dev` and ask the user to check.

## Tool notes

- Step-by-step skills for common tasks (new post, section, color preset) are in `.claude/skills/`. Cursor loads `.cursor/rules/pilcrow.mdc`, which points here.
- Run the dev server in the background: `pnpm astro dev --background` / `astro dev stop|status|logs`.
- TypeScript is pinned to 6.x. 7.x (native compiler) is not yet supported by `astro check` or typescript-eslint.
- pnpm is pinned to 10.x via the `packageManager` field. pnpm 9 can't read a pnpm 11+ lockfile, and pnpm 10 below 10.34 can't switch to pnpm 11+ (native binary), so a higher pin breaks installs for buyers with an older global pnpm. Keep `pnpm-workspace.yaml` in pnpm 10 syntax (`onlyBuiltDependencies`, not `allowBuilds`).
