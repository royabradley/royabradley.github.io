// src/config.ts is the single entry point for site settings. Every site-specific value lives here; never hardcode them in components.
import defaultOgImage from './assets/og-default.png';

export const site = {
  name: 'Pilcrow',
  description: 'A minimal, typography-first Astro theme.',
  url: 'https://example.com',
  locale: 'en', // 'en' | 'ko'
  author: 'Ada Marlow', // Fictional demo author. Replace with your name
  defaultOgImage, // 1200×630. A post's heroImage takes precedence
} as const;

// pro-only. Color preset (data-preset blocks in global.css) and font pairing (data-fonts)
export const theme = {
  preset: 'paper' as 'paper' | 'ink' | 'sage' | 'plum',
  fonts: 'classic' as 'classic' | 'modern' | 'book', // serif body + sans UI | all Inter | all Newsreader
  ogImages: true, // Build a titled OG image per post (/og/<slug>.png). A heroImage takes precedence
};

export const nav = {
  header: [
    { label: 'Blog', href: '/blog' },
    { label: 'Work', href: '/work' }, // pro-only
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  footer: [
    // pro-only
    {
      title: 'Theme demo',
      links: [
        { label: 'Newsletter', href: '/newsletter/' },
        { label: 'Pricing', href: '/pricing/' },
        { label: 'Features', href: '/features/' },
        { label: 'Team', href: '/team/' },
        { label: 'Docs', href: '/docs/' },
        { label: 'Changelog', href: '/changelog/' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
        { label: 'Cookies', href: '/cookies/' }, // pro-only
        { label: 'Accessibility', href: '/accessibility/' }, // pro-only
      ],
    },
  ],
  social: [
    { label: 'GitHub', href: 'https://github.com/', icon: 'lucide:github' },
    // Icons are Lucide names (https://lucide.dev/icons), e.g. { label: 'Mastodon', href: '…', icon: 'lucide:at-sign' }
  ],
} as const;

export const seo = {
  titleTemplate: '%s · Pilcrow',
  twitterHandle: '',
  jsonLd: { type: 'Person' as 'Person' | 'Organization', name: site.author },
};

export const blog = {
  postsPerPage: 10,
  relatedPosts: 3,
  showReadingTime: true,
  dropCap: true, // Drop the first letter of a post two lines, in the accent color
  sidenotes: true, // pro-only. On wide screens, also show footnotes in the right margin
};

export const features = {
  darkMode: true,
  search: true, // pro-only. Build a Pagefind index and enable the /search page
  i18nRouting: true, // pro-only. Languages other than site.locale are served under /<locale>/blog/…
  comments: false, // pro-only. Giscus comments under posts (requires the giscus values below)
  styleguide: true, // pro-only. Build /styleguide (token and preset preview, noindex). It is always on in dev
};

// pro-only. Copy the data-* values https://giscus.app gives you for your repo (enable Discussions and install the giscus app first)
export const giscus = {
  repo: '', // 'owner/name'
  repoId: '',
  category: '',
  categoryId: '',
  mapping: 'pathname', // one discussion per post path
};

// Forms post to static form services. With empty values the forms render but don't submit.
// pro-only. site.locale, not the first entry, is the default (unprefixed) language. Each needs src/i18n/<locale>.ts
export const i18n = {
  locales: { en: 'English', ko: '한국어' },
};

export const forms = {
  web3formsKey: '', // /contact: access key from https://web3forms.com
  newsletter: {
    // 'custom': put the subscribe URL (accepting a single email field) in action
    provider: 'custom' as 'custom' | 'buttondown' | 'kit', // pro-only: buttondown·kit
    id: '', // pro-only. buttondown: username / kit: form ID (/forms/<id>/ in the embed code)
    action: '',
  },
};

export const analytics = {
  provider: null as null | 'plausible' | 'ga4',
  id: '',
};
