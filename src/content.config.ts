import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string().max(160),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        heroImage: image().optional(),
        heroAlt: z.string().optional(),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(false),
        author: reference('authors').optional(), // pro-only. Falls back to site.author
        series: z.string().optional(), // pro-only. Posts with the same value are grouped, ordered by pubDate
      })
      .refine((d) => !d.heroImage || d.heroAlt, {
        message: 'heroAlt is required when heroImage is set',
        path: ['heroAlt'],
      }),
});

// pro-only. Authors (/blog/author/<id>/). An entry's id is the author value in post frontmatter.
const authors = defineCollection({
  loader: file('./src/content/authors.json'),
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    url: z.url().optional(),
  }),
});

// pro-only. Docs pages (/docs/…). Listed in the sidebar by ascending order.
const docs = defineCollection({
  loader: glob({ base: './src/content/docs', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    order: z.number().default(0),
  }),
});

// pro-only. Work and case studies (/work/…). Newest year first.
const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string().max(160),
        year: z.number(),
        client: z.string().optional(),
        role: z.string().optional(),
        heroImage: image().optional(),
        heroAlt: z.string().optional(),
        draft: z.boolean().default(false),
        series: z.string().optional(), // Entries with the same value are grouped, oldest year first. Needs work.series in config.ts
      })
      .refine((d) => !d.heroImage || d.heroAlt, {
        message: 'heroAlt is required when heroImage is set',
        path: ['heroAlt'],
      }),
});

export const collections = { blog, authors, docs, work };
