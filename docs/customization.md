# Customization

Everything site-specific lives in `src/config.ts`, `src/styles/global.css`, and `src/assets/`. You should not need to touch component files for the changes below.

## Site identity

`src/config.ts`, `site` object:

- `name` — shown in the header and page titles.
- `description` — used for meta description and RSS.
- `url` — your production URL. Set this before deploying; it feeds canonical links, RSS, and sitemap.
- `locale` — `'en'` or `'ko'`, picks the default interface strings.
- `author` — shown in the footer and JSON-LD structured data.
- `defaultOgImage` — imported from `src/assets/og-default.png` (see below).

## Navigation and social links

`src/config.ts`, `nav` object:

- `nav.header` — top bar links (`label`, `href`). Keep it short; four links fit a phone.
- `nav.footer` — array of groups, each with a `title` and a `links` array.
- `nav.social` — icon links (`label`, `href`, `icon`; icon names are `lucide:*` via astro-icon). Your own SVG icons go in `src/icons/`; `src/icons/logo.svg` is referenced as `logo`.

## Color tokens

`src/styles/global.css`, inside the `@theme` block:

- `--color-background`, `--color-foreground`, `--color-muted`, `--color-border`, `--color-primary`.
- Dark mode values for the default preset are set in the adjacent `.dark` block (same variable names).
- Use hex values only. Changing a color requires re-checking contrast: `pnpm check:contrast` (WCAG AA, 4.5:1).
- Only use these `@theme` tokens in components; do not put arbitrary hex values in classes.

## Color presets

`src/config.ts`, `theme.preset`: one of `'paper'` (default), `'ink'`, `'sage'`, `'plum'`.

Each preset is a block in `src/styles/global.css`: `html[data-preset='ink']` (light) and `html[data-preset='ink'].dark` (dark), and likewise for `sage` and `plum`. The preset name is applied to the `<html>` element as `data-preset`.

To add a preset:

1. Add a `html[data-preset='<name>']` block and a `html[data-preset='<name>'].dark` block in `global.css`, defining the same five color variables as the `@theme`/`.dark` blocks.
2. Run `pnpm check:contrast` and fix any variable that fails AA.
3. Preview it in dev at `/styleguide?preset=<name>&fonts=<fonts>`. The `/styleguide` route is also built for production (marked `noindex`, left out of the sitemap). Set `features.styleguide: false` in `src/config.ts` to build it in dev only.

## Font pairings

`src/config.ts`, `theme.fonts`: one of `'classic'` (default, Newsreader serif body + Inter UI), `'modern'` (Inter throughout), `'book'` (Newsreader throughout).

Blocks live in `src/styles/global.css` as `html[data-fonts='modern']` and `html[data-fonts='book']` (no block needed for the default `classic`).

## Self-hosted fonts

Font files live in `src/assets/fonts/` (woff2, self-hosted, licensed under the OFL files alongside them) and are declared with `@font-face` at the top of `src/styles/global.css`. Do not add external font CDN links (e.g. Google Fonts `<link>` tags); add a self-hosted file instead.

## Logo and favicon

- Logo: `src/assets/logo.svg`.
- Favicon: `public/favicon.svg` (favicon is one of the few files allowed directly under `public/`).

## Default OG image

`src/assets/og-default.png`, 1200x630. Imported by `src/config.ts` as `site.defaultOgImage` and used whenever a page or post has no more specific image.

## Generated per-post OG images

`src/utils/og.ts` renders a 1200x630 PNG per post with satori at build time, served from `/og/<slug>.png`. Controlled by `theme.ogImages` in `src/config.ts` (`true`/`false`). If a post has its own `heroImage`, that image is used instead of a generated one. Generated OG images only support Latin-script titles; a non-Latin title (e.g. a Korean post) falls back to the default OG image. Fonts used for generation live in `src/assets/fonts/og/` (woff).

## Home page sections

`src/pages/index.astro` imports section components from `src/components/sections/` and passes them props to compose the home page; edit this file to reorder or change home page content. Available section components (all of `src/components/sections/`) can be previewed together at `/sections`. Section components only accept props; they do not fetch their own data.

## UI strings

`src/i18n/<locale>.ts` (e.g. `src/i18n/en.ts`, `src/i18n/ko.ts`). Do not hardcode user-facing strings inside components; add a key here and read it with `useT(Astro.currentLocale)`.

## Languages

`src/config.ts`, `i18n.locales` — a map of locale code to display name (e.g. `{ en: 'English', de: 'Deutsch' }`). `site.locale` is the default locale and is served without a path prefix; every other locale in `i18n.locales` is served under `/<locale>/...`. Adding a locale requires a matching `src/i18n/<locale>.ts` strings file. Translated posts live in `src/content/blog/<locale>/`, with file names matching the original-language post they translate.

## Search

`src/config.ts`, `features.search` (`true`/`false`). When enabled, Pagefind builds a search index during `pnpm build` and the `/search` route is enabled. Only pages/elements marked `data-pagefind-body` are indexed.

## Dark mode

`src/config.ts`, `features.darkMode` (`true`/`false`). Dark styling uses the `dark:` Tailwind variant, toggled by a `dark` class on `<html>`.

## Comments

`src/config.ts`, `features.comments` (`true`/`false`), plus the `giscus` object (`repo`, `repoId`, `category`, `categoryId`, `mapping`). Get these values from [giscus.app](https://giscus.app) after enabling GitHub Discussions on your repository and installing the giscus app. Comments render via `src/components/blog/Comments.astro`.

## Forms

`src/config.ts`, `forms` object:

- `forms.web3formsKey` — access key from [web3forms.com](https://web3forms.com), used by `/contact`.
- `forms.newsletter.provider` — `'custom'`, `'buttondown'`, or `'kit'`.
  - `'custom'`: leave `id` empty and put the subscribe URL in `action`.
  - `'buttondown'`: `id` is your Buttondown username.
  - `'kit'`: `id` is the Kit form ID (the number in `/forms/<id>/`).
- Until these are filled in, the forms render but do not submit. Provider handling lives in `src/utils/forms.ts`.

## Analytics

`src/config.ts`, `analytics.provider` (`null`, `'plausible'`, `'ga4'`, or `'umami'`) and
`analytics.id` (the Plausible domain, the GA4 measurement id, or the Umami website id).

`analytics.host` points a self-hosted Plausible or Umami at your own origin, with no trailing slash
(`https://stats.example.com`). Leave it empty for the hosted service, and for GA4.

## Blog options

`src/config.ts`, `blog` object:

- `blog.postsPerPage` — pagination size.
- `blog.relatedPosts` — number of related posts shown at the end of a post.
- `blog.showReadingTime` — show/hide estimated reading time.
- `blog.dropCap` — drop the first letter of a post two lines, in the accent color (browsers without `initial-letter` show a plain letter).
- `blog.sidenotes` — on screens 1280px and wider, show footnotes in the right margin next to their reference.

## SEO

`src/config.ts`, `seo` object:

- `seo.titleTemplate` — e.g. `'%s · Pilcrow'`.
- `seo.twitterHandle`.
- `seo.jsonLd` — `{ type: 'Person' | 'Organization', name }`, used for structured data.
