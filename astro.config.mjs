// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { close, createIndex } from 'pagefind';
import { satteri } from '@astrojs/markdown-satteri';
import { features, i18n, site } from './src/config.ts';

// GFM task-list checkboxes have no accessible name and fail Lighthouse's 'label' audit. Wrap each item in a <label>
const taskListLabels = {
  name: 'pilcrow-task-list-labels',
  element: {
    filter: ['li'],
    /** @param {any} node hast Element */
    visit(node) {
      const [first] = node.children;
      if (first?.type !== 'element' || first.tagName !== 'input') return;
      return {
        ...node,
        children: [{ type: 'element', tagName: 'label', properties: {}, children: node.children }],
      };
    },
  },
};

// pro-only. Index dist with Pagefind. Only pages with data-pagefind-body (posts, docs, work, plain pages) are included
const pagefind = {
  name: 'pilcrow-pagefind',
  hooks: {
    /** @param {{ dir: URL, logger: import('astro').AstroIntegrationLogger }} options */
    'astro:build:done': async ({ dir, logger }) => {
      const { index, errors } = await createIndex({});
      if (!index) throw new Error(errors.join('\n'));
      const { page_count } = await index.addDirectory({ path: fileURLToPath(dir) });
      await index.writeFiles({ outputPath: fileURLToPath(new URL('pagefind/', dir)) });
      await close();
      logger.info(`indexed ${page_count} pages`);
    },
  },
};

// https://astro.build/config
export default defineConfig({
  // SITE_URL overrides config.ts at build time (used by the demo deploys)
  site: process.env.SITE_URL ?? site.url,
  markdown: {
    processor: satteri({ hastPlugins: [taskListLabels] }),
    // Emit both light and dark themes as CSS variables. Colors are applied at the end of global.css
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' }, defaultColor: false },
  },
  i18n: features.i18nRouting
    ? {
        locales: Object.keys(i18n.locales),
        defaultLocale: site.locale,
        routing: { prefixDefaultLocale: false },
      }
    : undefined,
  integrations: [
    mdx(),
    sitemap({ filter: (page) => !page.endsWith('/styleguide/') }),
    icon(),
    {
      name: 'pilcrow-styleguide',
      hooks: {
        'astro:config:setup': ({ command, injectRoute }) => {
          // pro-only: features.styleguide builds it for production too
          if (command === 'dev' || features.styleguide)
            injectRoute({ pattern: '/styleguide', entrypoint: './src/pages/_styleguide.astro' });
          // pro-only
          if (features.search)
            injectRoute({ pattern: '/search', entrypoint: './src/pages/_search.astro' });
        },
      },
    },
    ...(features.search ? [pagefind] : []),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
