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

## MDX features

- `<Callout type="note" title="Optional title">...</Callout>` — usable in any `.mdx` file with no import. `type` is `'note'`, `'tip'`, or `'warning'` (default `'note'`); `title` defaults to a locale string for the type if omitted. Defined in `src/components/mdx/Callout.astro`.
- Code blocks get a copy button automatically.
- Footnotes and tables (GFM) are supported out of the box. With `blog.sidenotes` on, wide screens show footnotes in the margin.
- A table of contents appears automatically once a post has 3 or more `h2`/`h3` headings (`src/components/blog/TableOfContents.astro`).
- Reading time is computed automatically and shown when `blog.showReadingTime` is `true` in `src/config.ts`.
- Translated posts: put the translation in `src/content/blog/<locale>/`, with a file name matching the original-language post.
