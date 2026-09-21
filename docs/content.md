# Content

Content lives under `src/content/`, one folder per collection, defined in `src/content.config.ts`. Files are Markdown (`.md`) or MDX (`.mdx`) with a frontmatter block. Do not delete a schema field; new fields should be optional.

Images go in `src/assets/`, not `public/` (except favicon/robots). Reference `heroImage` with a path relative to the content file, and it is processed through `astro:assets`.

## blog

Files: `src/content/blog/<slug>.mdx` (default locale) or `src/content/blog/<locale>/<slug>.mdx` (translations; file name must match the original post).

Fields:

- `title` (string, required)
- `description` (string, required, max 160 characters)
- `pubDate` (date, required)
- `updatedDate` (date, optional)
- `heroImage` (image, optional) — relative path from the post to a file in `src/assets/`, e.g. `../../assets/cover.jpg`
- `heroAlt` (string, required if `heroImage` is set)
- `tags` (string array, default `[]`)
- `draft` (boolean, default `false`) — `true` excludes the post from the production build
- `author` (optional) — an id referencing an entry in `src/content/authors.json`; if omitted, the post attributes to `site.author`
- `series` (string, optional) — posts sharing the same `series` value are grouped together, ordered by `pubDate`

Example:

```md
---
title: On the pleasure of slow reading
description: A short case for reading fewer books, more carefully.
pubDate: 2026-03-02
tags: [reading]
author: jane
series: Reading notes
---
```

## authors

File: `src/content/authors.json` (a single JSON array; each entry's `id` is what posts put in `author`).

Fields:

- `id` (string, required)
- `name` (string, required)
- `bio` (string, required)
- `url` (string, optional)

Example entry:

```json
[
  {
    "id": "jane",
    "name": "Jane Doe",
    "bio": "Writes about typography and slow reading.",
    "url": "https://example.com"
  }
]
```

Each author gets a page at `/blog/author/<id>/`.

## docs

Files: `src/content/docs/<id>.mdx`.

Fields:

- `title` (string, required)
- `description` (string, required, max 160 characters)
- `order` (number, default `0`) — sidebar position, lowest first

Example:

```md
---
title: Configuration
description: Site name, navigation, forms, and analytics all live in one file.
order: 2
---
```

Rendered at `/docs/<id>/`.

## work

Files: `src/content/work/<id>.mdx`.

Fields:

- `title` (string, required)
- `description` (string, required, max 160 characters)
- `year` (number, required)
- `client` (string, optional)
- `role` (string, optional)
- `heroImage` (image, optional)
- `heroAlt` (string, required if `heroImage` is set)
- `draft` (boolean, default `false`)
- `series` (string, optional) — entries with the same value are grouped, oldest year first. Needs `work.series` in `src/config.ts`

Example:

```md
---
title: Rebuilding a publishing platform
description: A year-long redesign for a mid-size newsroom.
year: 2025
client: Acme News
role: Lead designer
---
```

Rendered at `/work/<id>/`.

### Work as long-form

Work entries use the same reading column and body styles as posts, so the collection also suits
essays, studies, guides, and multi-part editorial projects — anything ordered by year rather than
by date. Three post features are available here too, in the `work` object of `src/config.ts`:

- `work.series` — groups entries that share a `series` value, using the same navigation posts use.
  Renders nothing until an entry has a `series` value.
- `work.sidenotes` — on screens 1280px and wider, footnotes move into the right margin. Renders
  nothing until an entry has a footnote.
- `work.toc` — contents list above the body, on entries with 3 or more `h2`/`h3` headings. Same rule
  posts follow. Unlike the other two this needs nothing from the frontmatter, so it appears on any
  entry long enough to qualify; set it to `false` for a portfolio of short case studies.

All three default to `true`. To break a section component out of the reading column inside an entry,
see [Section components in long-form
content](customization.md#section-components-in-long-form-content).

Worked examples ship at `src/content/work/how-people-read-long-essays.mdx` (five embedded sections)
and `what-we-thought-readers-wanted.mdx` (series and footnotes).

## MDX features

- `<Callout type="note" title="Optional title">...</Callout>` — usable in any `.mdx` file with no import. `type` is `'note'`, `'tip'`, or `'warning'` (default `'note'`); `title` defaults to a locale string for the type if omitted. Defined in `src/components/mdx/Callout.astro`.
- Code blocks get a copy button automatically.
- Footnotes and tables (GFM) are supported out of the box. With `blog.sidenotes` on, wide screens show footnotes in the margin.
- A table of contents appears automatically once a post has 3 or more `h2`/`h3` headings (`src/components/blog/TableOfContents.astro`). In `work` entries this is opt-in via `work.toc`.
- Section components can be embedded in the body of any post, page, or work entry. See [Section components in long-form content](customization.md#section-components-in-long-form-content).
- Reading time is computed automatically and shown when `blog.showReadingTime` is `true` in `src/config.ts`.
- Translated posts: put the translation in `src/content/blog/<locale>/`, with a file name matching the original-language post.
