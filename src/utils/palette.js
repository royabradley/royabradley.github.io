// @ts-check
// pro-only. Reads preset colors from global.css. Shared by OG images (src/pages/og/) and scripts/check-contrast.mjs.
// Note: regex parsing, so preset blocks in global.css must keep one variable per line with 6-digit hex

/** @param {string | undefined} block */
const vars = (block = '') =>
  Object.fromEntries(
    [...block.matchAll(/--color-([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [
      m[1],
      m[2].toLowerCase(),
    ]),
  );

/** @param {string} css @param {string} head regex source */
const block = (css, head) => css.match(new RegExp(`^\\s*${head}\\s*\\{([^}]*)\\}`, 'm'))?.[1];

/** @param {string} css */
export const presetNames = (css) => [
  'paper',
  ...new Set([...css.matchAll(/data-preset='([\w-]+)'/g)].map((m) => m[1])),
];

/**
 * A preset's color tokens (background, foreground, muted, border, primary → hex).
 * @param {string} css global.css source @param {string} preset @param {boolean} [dark]
 * @returns {Record<string, string>}
 */
export function palette(css, preset, dark = false) {
  const sel = `html\\[data-preset='${preset}'\\]`;
  return {
    ...vars(block(css, '@theme')),
    ...(dark ? vars(block(css, '\\.dark')) : {}),
    ...vars(block(css, sel)),
    ...(dark ? vars(block(css, `${sel}\\.dark`)) : {}),
  };
}
