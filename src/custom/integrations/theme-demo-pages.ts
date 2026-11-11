// rab: Removes the theme's demo pages from a production build. The page files in src/pages stay
// untouched, so a theme merge never conflicts on them, and `pnpm dev` still serves them as examples.
// The list lives in src/custom/theme-demo.ts. Registered in astro.config.mjs before pagefind, so the
// search index never sees these pages; the sitemap leaves them out through its filter.
import type { AstroIntegration } from 'astro';
import { rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { themeDemoPages } from '../theme-demo';

export const themeDemoPagesIntegration = (): AstroIntegration => ({
  name: 'rab-theme-demo-pages',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      const root = fileURLToPath(dir);
      for (const page of themeDemoPages) {
        await rm(root + page.slice(1), { recursive: true, force: true });
      }
      logger.info(`removed ${themeDemoPages.length} theme demo page paths`);
    },
  },
});
