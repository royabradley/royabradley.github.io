// Checks that every color preset meets WCAG AA (4.5:1) text contrast in light and dark. Exits 1 on failure.
import { readFileSync } from 'node:fs';
import { palette, presetNames } from '../src/utils/palette.js';

const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');

const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const presets = presetNames(css);
let failed = false;
for (const preset of presets) {
  for (const dark of [false, true]) {
    const p = palette(css, preset, dark);
    const tokens = ['background', 'foreground', 'muted', 'border', 'primary'];
    if (tokens.some((t) => !p[t]))
      throw new Error(`${preset}: missing tokens ${JSON.stringify(p)}`);
    const row = ['foreground', 'muted', 'primary'].map((t) => {
      const r = ratio(p[t], p.background);
      if (r < 4.5) failed = true;
      return `${t} ${r.toFixed(1)}${r < 4.5 ? ' ✗' : ''}`;
    });
    console.log(`${preset.padEnd(6)} ${dark ? 'dark ' : 'light'}  ${row.join('  ')}`);
  }
}
if (presets.length < 4) failed = !!console.error('Fewer than 4 presets found');
process.exit(failed ? 1 : 0);
