---
name: add-post
description: Add a blog post to the Pilcrow theme, or a translation of one. Use when asked to write, add, or translate a post.
---

1. Pick a slug (lowercase, hyphens). The file is `src/content/blog/<slug>.mdx`.
   A translation goes in `src/content/blog/<locale>/<slug>.mdx` with the same file name as the original.
2. Frontmatter (schema in `src/content.config.ts`):
   ```yaml
   title: 'Plain title'
   description: 'One or two sentences, 160 characters at most.'
   pubDate: 2026-09-17
   tags: ['notes']
   # optional: updatedDate, heroImage + heroAlt, author (id in src/content/authors.json), series, draft
   ```
   A `heroImage` path is relative to the post and must point under `src/assets/`. Set `heroAlt` with it.
3. Write the body in Markdown. `<Callout>` works without an import. Footnotes (`[^1]`) render as sidenotes on wide screens.
4. Reuse existing tags where they fit; tag pages are generated from them.
5. Run `pnpm check && pnpm build`. Check the post at `/blog/<slug>/` with `pnpm dev`.
