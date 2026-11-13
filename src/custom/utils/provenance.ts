// rab: Provenance of a blog post written for somewhere else first (a seminary course, a lecture).
// Kept in the frontmatter as a record and checked by the schema; not shown on the site.
// Field names mirror the Writing/Essays notes in Obsidian. All optional: ordinary posts leave them out.
// Registered in src/content.config.ts with one spread into the blog schema.
import { z } from 'astro/zod';

export const REVISIONS = ['archival', 'lightly-revised', 'rewritten'] as const;

export const provenanceFields = {
  written: z.coerce.date().optional(), // when it was first written, if not pubDate
  course: z.string().optional(), // "CH504: Church History 2"
  instructor: z.string().optional(), // "Dr. Joshua Bruce"
  institution: z.string().optional(), // "Knox Theological Seminary"
  revision: z.enum(REVISIONS).optional(),
  partial: z.boolean().optional(), // true when only portions were written for the course
};
