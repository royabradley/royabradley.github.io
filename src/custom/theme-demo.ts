// rab: Theme demo content that stays in the repo but is left out of production builds.
//
// Pilcrow ships these entries and may change them in a release. Leaving the files untouched means a
// theme merge never conflicts on them, and they still show in `pnpm dev` as working examples of the
// theme's features. `pnpm build` (and so the published site) leaves them out entirely: no page, no
// listing, no tag, RSS item, OG image or sitemap entry.
//
// Paths are relative to src/content/<collection>/. scripts/theme-status.sh lists any upstream file in
// those folders that is missing here, so a demo post added by a new release doesn't publish unnoticed.
// The Korean demo posts (blog/ko/) were deleted instead; see the Korean row in CUSTOMIZATIONS.md.
export const themeDemo = {
  blog: [
    'a-due-date-from-1987.mdx',
    'a-short-history-of-the-serif.mdx',
    'footnotes-are-a-form-of-honesty.mdx',
    'marginalia-and-other-small-rebellions.mdx',
    'notes-august.mdx',
    'on-rereading.mdx',
    'on-the-pleasure-of-slow-reading.mdx',
    'the-commonplace-book-revisited.mdx',
    'the-unhurried-newsletter.mdx',
    'typography-sampler.mdx',
    'why-i-still-write-with-a-fountain-pen.mdx',
  ],
  work: [
    'how-people-read-long-essays.mdx',
    'ledger-press-style-guide.mdx',
    'small-hours-newsletter.mdx',
    'the-margin-review-redesign.mdx',
    'what-we-thought-readers-wanted.mdx',
  ],
};

/** Glob patterns for a collection's loader: every entry, minus the theme demo entries in production. */
export const contentPattern = (collection: keyof typeof themeDemo) => [
  '**/*.{md,mdx}',
  ...(import.meta.env.PROD ? themeDemo[collection].map((path) => `!${path}`) : []),
];
