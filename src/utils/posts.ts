import { getCollection, type CollectionEntry } from 'astro:content';
import { i18n, site } from '../config';
import { localePath } from './i18n';

export type Post = CollectionEntry<'blog'>;

/** Published posts, newest first. Drafts show only in dev. A null locale means every language (pro-only). */
export async function getPosts(locale: string | null = site.locale) {
  const posts = await getCollection(
    'blog',
    (post) =>
      (import.meta.env.DEV || !post.data.draft) && (locale === null || postLocale(post) === locale),
  );
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

// pro-only. Non-default-language posts live in src/content/blog/<locale>/. Files with the same name are translations of each other
export const postLocale = (post: Post) => {
  const first = post.id.split('/')[0];
  return first !== site.locale && first in i18n.locales ? first : site.locale;
};
export const postSlug = (post: Post) =>
  postLocale(post) === site.locale ? post.id : post.id.slice(postLocale(post).length + 1);

export const postHref = (post: Post) => localePath(postLocale(post), `/blog/${postSlug(post)}/`);

export const tagSlug = (tag: string) => tag.toLowerCase().trim().replace(/\s+/g, '-');
export const tagHref = (tag: string) => `/blog/tag/${tagSlug(tag)}/`;

/** Tag slug → display name (first spelling seen) and its posts, in first-seen order. */
export function groupByTag(posts: Post[]) {
  const tags = new Map<string, { name: string; posts: Post[] }>();
  for (const post of posts)
    for (const tag of post.data.tags) {
      const slug = tagSlug(tag);
      const entry = tags.get(slug) ?? tags.set(slug, { name: tag, posts: [] }).get(slug)!;
      if (!entry.posts.includes(post)) entry.posts.push(post);
    }
  return tags;
}

export const formatDate = (date: Date, locale: string = site.locale) =>
  date.toLocaleDateString(locale, { dateStyle: 'long', timeZone: 'UTC' });

// pro-only from here: reading time, related posts, series, authors.

/** Minutes, at least 1. Assumes 230 English words per minute. */
export const readingTime = (post: Post) =>
  Math.max(1, Math.round((post.body ?? '').split(/\s+/).filter(Boolean).length / 230));

/** Most shared tags first, then newest (posts are already newest first). Posts with no shared tag are dropped. */
export function relatedPosts(post: Post, posts: Post[], limit: number) {
  const tags = new Set(post.data.tags.map(tagSlug));
  return posts
    .filter((p) => p.id !== post.id)
    .map((p) => ({ p, score: p.data.tags.filter((tag) => tags.has(tagSlug(tag))).length }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ p }) => p);
}

/** Posts in the same series, oldest first. [] when not in a series. */
export const seriesPosts = (post: Post, posts: Post[]) =>
  post.data.series ? posts.filter((p) => p.data.series === post.data.series).toReversed() : [];

export const authorHref = (id: string) => `/blog/author/${id}/`;
