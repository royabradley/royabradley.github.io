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

// Note: OG fonts are Latin subsets only. Titles with other scripts (Korean posts, etc.) use the default OG image.
// To support them, add that script's font (woff/ttf) to fonts and widen this check
const latinOnly = (text: string) =>
  /^[\p{Script=Latin}\p{Script=Common}\p{Script=Inherited}]*$/u.test(text);

/** Image info for SEO when the post gets a generated image, otherwise undefined (default OG image). */
export const ogImage = (post: Post) =>
  theme.ogImages && !post.data.heroImage && latinOnly(post.data.title + site.name)
    ? { src: `/og/${post.id}.png`, width: WIDTH, height: HEIGHT }
    : undefined;

// Builds run from the repo root
const font = (file: string) => readFile(`src/assets/fonts/og/${file}`);

export async function renderOgImage(post: Post) {
  const c = palette(css, theme.preset);
  const [serif, sans] = await Promise.all([
    font('newsreader-latin-500-normal.woff'),
    font(
      theme.fonts === 'book' ? 'newsreader-latin-500-normal.woff' : 'inter-latin-400-normal.woff',
    ),
  ]);
  const titleFont = theme.fonts === 'modern' ? 'Inter Title' : 'Newsreader';
  const fonts = [
    { name: 'Newsreader', data: serif, weight: 500 as const },
    { name: 'UI', data: sans, weight: 400 as const },
  ];
  if (theme.fonts === 'modern')
    fonts.push({
      name: 'Inter Title',
      data: await font('inter-latin-500-normal.woff'),
      weight: 500,
    });

  const { title, pubDate } = post.data;
  const meta = { fontFamily: 'UI', fontSize: 28, color: c.muted };
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
                    style: { color: c.primary, fontFamily: 'Newsreader', fontSize: 44 },
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
