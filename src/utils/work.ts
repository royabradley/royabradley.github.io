// pro-only
import { getCollection, type CollectionEntry } from 'astro:content';

export type Work = CollectionEntry<'work'>;

/** Published work, newest year first. Drafts show only in dev. */
export const getWork = async () =>
  (await getCollection('work', ({ data }) => import.meta.env.DEV || !data.draft)).sort(
    (a, b) => b.data.year - a.data.year,
  );

export const workHref = (item: Work) => `/work/${item.id}/`;
