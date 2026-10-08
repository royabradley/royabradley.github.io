// pro-only. Draws post OG images (1200×630 PNG) with satori. Route: src/pages/og/[...slug].png.ts
import { readFile } from 'node:fs/promises';
import satori from 'satori';
import sharp from 'sharp';
import css from '../styles/global.css?raw';
import { site, theme } from '../config';
import { formatDate, postLocale, type Post } from './posts';
import { palette } from './palette.js';

const WIDTH = 1200;
const HEIGHT = 630;

// OG fonts cover the latin + latin-ext subsets (the unicode-ranges in global.css). A title with any other
// character (Korean, Cyrillic, Vietnamese tone marks, emoji) uses the default OG image instead of rendering tofu.
// To support another script, add its font files to fonts below and widen this range
const ogCovered = (text: string) =>
  /^[\u0000-\u02FF\u0304\u0308\u0329\u1D00-\u1DBF\u1E00-\u1E9F\u1EF2-\u1EFF\u2000-\u206F\u20A0-\u20C0\u2113\u2122\u2191\u2193\u2212\u2215\u2C60-\u2C7F\uA720-\uA7FF\uFEFF\uFFFD]*$/.test(
    text,
  );

/** Image info for SEO when the post gets a generated image, otherwise undefined (default OG image). */
export const ogImage = (post: Post) =>
  theme.ogImages && !post.data.heroImage && ogCovered(post.data.title + site.name)
    ? { src: `/og/${post.id}.png`, width: WIDTH, height: HEIGHT }
    : undefined;

// Builds run from the repo root
const font = (file: string) => readFile(`src/assets/fonts/og/${file}`);

// satori ignores unicode-range and picks one font per family name, so each latin file gets a
// latin-ext twin under "<name> Ext", and styles list both: fontFamily: 'Newsreader, Newsreader Ext'
const withExt = async (name: string, file: string, weight: 400 | 500) => {
  const [latin, ext] = await Promise.all([
    font(file),
    font(file.replace('-latin-', '-latin-ext-')),
  ]);
  return [
    { name, data: latin, weight },
    { name: `${name} Ext`, data: ext, weight },
  ];
};
const family = (name: string) => `${name}, ${name} Ext`;

export async function renderOgImage(post: Post) {
  const c = palette(css, theme.preset);
  const fonts = (
    await Promise.all([
      withExt('Newsreader', 'newsreader-latin-500-normal.woff', 500),
      theme.fonts === 'book'
        ? withExt('UI', 'newsreader-latin-500-normal.woff', 400)
        : withExt('UI', 'inter-latin-400-normal.woff', 400),
      ...(theme.fonts === 'modern'
        ? [withExt('Inter Title', 'inter-latin-500-normal.woff', 500)]
        : []),
    ])
  ).flat();
  const titleFont = family(theme.fonts === 'modern' ? 'Inter Title' : 'Newsreader');

  const { title, pubDate } = post.data;
  const meta = { fontFamily: family('UI'), fontSize: 28, color: c.muted };
  const svg = await satori(
    {
      type: 'div',
      key: null,
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 88px',
          background: c.background,
          color: c.foreground,
          borderTop: `12px solid ${c.primary}`,
        },
        children: [
          {
            type: 'div',
            key: null,
            props: {
              style: { display: 'flex', alignItems: 'center', gap: 16, ...meta },
              children: [
                {
                  type: 'span',
                  key: null,
                  props: {
                    style: { color: c.primary, fontFamily: family('Newsreader'), fontSize: 44 },
                    children: '¶',
                  },
                },
                site.name,
              ],
            },
          },
          {
            type: 'div',
            key: null,
            props: {
              style: {
                fontFamily: titleFont,
                fontSize: title.length > 60 ? 60 : 76,
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
                display: 'block',
                lineClamp: 3,
              },
              children: title,
            },
          },
          {
            type: 'div',
            key: null,
            props: {
              style: {
                display: 'flex',
                paddingTop: 28,
                borderTop: `2px solid ${c.border}`,
                ...meta,
              },
              children: formatDate(pubDate, postLocale(post)),
            },
          },
        ],
      },
    },
    { width: WIDTH, height: HEIGHT, fonts },
  );
  return sharp(Buffer.from(svg)).png().toBuffer();
}
