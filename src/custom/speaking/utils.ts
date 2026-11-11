// rab: Queries, labels and URLs for the speaking record. See collections.ts for the schema.
//
// The record is published in two sections, named for where the words were spoken:
//   Pulpit   /pulpit/    sermons, and sermon series
//   Lectern  /lectern/   lessons, talks, devotionals, presentations, and lesson series
// plus one combined archive, /record/, linked from the About page. `kind` decides the section.
import { getCollection, type CollectionEntry } from 'astro:content';
import { KINDS } from './collections';

export type Item = CollectionEntry<'speaking'>;
export type Series = CollectionEntry<'series'>;
export type Kind = (typeof KINDS)[number];
export type Section = 'pulpit' | 'lectern';

export const sections: Record<Section, { title: string; lede: string; kinds: Kind[] }> = {
  pulpit: {
    title: 'Pulpit',
    lede: 'Sermons, with the series they belong to.',
    kinds: ['sermon'],
  },
  lectern: {
    title: 'Lectern',
    lede: 'Lessons, talks, devotionals and presentations: teaching given at the reading desk.',
    kinds: ['lesson', 'talk', 'devotional', 'presentation'],
  },
};

export const kindLabel: Record<Kind, string> = {
  sermon: 'Sermon',
  lesson: 'Lesson',
  talk: 'Talk',
  devotional: 'Devotional',
  presentation: 'Presentation',
};
/** URL segment and heading for a kind's listing in the Lectern: /lectern/lessons/ */
export const kindPlural: Record<Kind, string> = {
  sermon: 'sermons',
  lesson: 'lessons',
  talk: 'talks',
  devotional: 'devotionals',
  presentation: 'presentations',
};
export const formLabel = { manuscript: 'Manuscript', notes: 'Notes', slides: 'Slides' } as const;
export const seriesKindLabel = { sermon: 'Sermon series', lesson: 'Sunday School series' } as const;

export const kindSection = (kind: Kind): Section => (kind === 'sermon' ? 'pulpit' : 'lectern');
export const seriesSection = (series: Series): Section => kindSection(series.data.kind);
export const itemSection = (item: Item): Section => kindSection(item.data.kind);

const published = <T extends { data: { draft: boolean } }>({ data }: T) =>
  import.meta.env.DEV || !data.draft;

/** Published series, most recent first by their latest item. Drafts show only in dev. */
export const getSeries = async () => {
  const series = await getCollection('series', published);
  const items = await getCollection('speaking', published);
  const latest = (s: Series) =>
    Math.max(0, ...items.filter((i) => i.data.series?.id === s.id).map((i) => i.data.date.valueOf()));
  return series.sort((a, b) => latest(b) - latest(a) || a.data.title.localeCompare(b.data.title));
};

/** Published items, newest first. An item in an unpublished series is unpublished too.
 *  Fails the build when an item sits in a series of the other section (a sermon in a lesson series). */
export const getItems = async () => {
  const series = new Map((await getSeries()).map((s) => [s.id, s]));
  const items = (await getCollection('speaking', published))
    .filter((item) => !item.data.series || series.has(item.data.series.id))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  for (const item of items) {
    const s = item.data.series && series.get(item.data.series.id);
    if (s && seriesSection(s) !== itemSection(item)) {
      throw new Error(
        `${item.id}: a ${item.data.kind} can't be in "${s.id}", a ${s.data.kind} series. ` +
          `Sermons go in sermon series (Pulpit); everything else in lesson series (Lectern).`,
      );
    }
  }
  return items;
};

/** A series' items in order: by part, then by date for items without one. */
export const itemsInSeries = (seriesId: string, items: Item[]) =>
  items
    .filter((item) => item.data.series?.id === seriesId)
    .sort(
      (a, b) =>
        (a.data.part ?? Infinity) - (b.data.part ?? Infinity) ||
        a.data.date.valueOf() - b.data.date.valueOf(),
    );

/** The item's own slug: its file name, whatever folder it sits in, without a leading number used
 *  to order files ("01-the-blessed" → "the-blessed"). */
export const itemSlug = (item: Item) => item.id.split('/').pop()!.replace(/^\d+-/, '');
export const sectionHref = (section: Section) => `/${section}/`;
export const itemHref = (item: Item) =>
  item.data.series
    ? `/${itemSection(item)}/${item.data.series.id}/${itemSlug(item)}/`
    : `/${itemSection(item)}/${itemSlug(item)}/`;
export const seriesHref = (series: Series) => `/${seriesSection(series)}/${series.id}/`;
/** Where "all of this kind" lives: the Pulpit itself for sermons, a listing in the Lectern otherwise. */
export const kindHref = (kind: Kind) =>
  kind === 'sermon' ? '/pulpit/' : `/lectern/${kindPlural[kind]}/`;
