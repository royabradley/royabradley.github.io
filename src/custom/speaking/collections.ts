// rab: The speaking record, published as Pulpit and Lectern: sermons, lessons, talks, devotionals and presentations (`speaking`), and
// the series that group some of them (`series`). Registered in src/content.config.ts with one spread.
// Field names mirror the SPEAKING RECORD notes in Obsidian, so a note can move here with few changes.
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// The reference pages (speaking/reference/ and series/reference-*.mdx) document this section by
// example. They show in `pnpm dev` and are left out of production builds, like the theme's demos.
const referencePattern = (reference: string) => [
  '**/*.{md,mdx}',
  ...(import.meta.env?.PROD ? [`!${reference}`] : []),
];

export const KINDS = ['sermon', 'lesson', 'talk', 'devotional', 'presentation'] as const;
export const FORMS = ['manuscript', 'notes', 'slides'] as const;

const speaking = defineCollection({
  // Any folder layout works; series membership comes from the `series` field, not the folder
  loader: glob({ base: './src/content/speaking', pattern: referencePattern('reference/**') }),
  schema: z
    .object({
      title: z.string(),
      description: z.string().max(160),
      date: z.coerce.date(), // when it was preached, taught or given
      kind: z.enum(KINDS),
      form: z.enum(FORMS).default('manuscript'), // what the page holds
      passage: z.string().optional(), // "Matthew 5:3–12"; talks may have none
      series: reference('series').optional(), // the series id; the build fails if it doesn't exist
      part: z.number().int().positive().optional(), // order in the series; falls back to date
      place: z.string().optional(), // congregation or venue
      occasion: z.string().optional(), // "Christmas Eve", "Men's retreat", "Sunday School"
      audio: z.url().optional(),
      video: z.url().optional(),
      slides: z.url().optional(),
      draft: z.boolean().default(false),
    })
    .refine((d) => !d.part || d.series, { message: 'part needs a series', path: ['part'] }),
});

const series = defineCollection({
  loader: glob({ base: './src/content/series', pattern: referencePattern('reference-*') }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    kind: z.enum(['sermon', 'lesson']), // a sermon series or a Sunday School series
    passage: z.string().optional(), // "Matthew 5–7"
    place: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const speakingCollections = { speaking, series };
