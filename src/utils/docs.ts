// pro-only
import { getCollection, type CollectionEntry } from 'astro:content';

export type Doc = CollectionEntry<'docs'>;

export const getDocs = async () =>
  (await getCollection('docs')).sort((a, b) => a.data.order - b.data.order);

export const docHref = (doc: Doc) => `/docs/${doc.id}/`;
