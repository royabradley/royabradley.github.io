// rab: getStaticPaths for the Pulpit and Lectern routes. The route files in src/pages/pulpit/ and
// src/pages/lectern/ are thin and identical apart from their section; the logic is here.
import { KINDS } from './collections';
import {
  getItems,
  getSeries,
  itemSection,
  itemSlug,
  itemsInSeries,
  kindPlural,
  sections,
  seriesSection,
  type Item,
  type Kind,
  type Section,
  type Series,
} from './utils';

export type SlugPage =
  | { type: 'kind'; kind: Kind; items: Item[] }
  | { type: 'series'; series: Series; items: Item[] }
  | { type: 'item'; item: Item };

/** Everything one level under /<section>/: a kind's listing (Lectern only), a series hub, or a
 *  standalone item. They share one URL level, so the build stops if two claim the same slug. */
export const slugPaths = async (section: Section) => {
  const all = await getItems();
  const items = all.filter((i) => itemSection(i) === section);
  const series = (await getSeries()).filter((s) => seriesSection(s) === section);
  const kinds = section === 'lectern' ? sections.lectern.kinds : [];
  const pages: [string, SlugPage][] = [
    ...KINDS.filter((k) => kinds.includes(k) && items.some((i) => i.data.kind === k)).map(
      (kind): [string, SlugPage] => [kindPlural[kind], { type: 'kind', kind, items: items.filter((i) => i.data.kind === kind) }],
    ),
    ...series.map((s): [string, SlugPage] => [s.id, { type: 'series', series: s, items: itemsInSeries(s.id, items) }]),
    ...items.filter((i) => !i.data.series).map((item): [string, SlugPage] => [itemSlug(item), { type: 'item', item }]),
  ];
  const seen = new Set<string>();
  for (const [slug] of pages) {
    if (seen.has(slug)) throw new Error(`/${section}/${slug}/ is claimed twice. Rename the series or item file.`);
    seen.add(slug);
  }
  return pages.map(([slug, page]) => ({ params: { slug }, props: { page } }));
};

/** Items in a series: /<section>/<series>/<item>/. */
export const seriesItemPaths = async (section: Section) => {
  const items = await getItems();
  return (await getSeries())
    .filter((s) => seriesSection(s) === section)
    .flatMap((series) => {
      const seriesItems = itemsInSeries(series.id, items);
      return seriesItems.map((item) => ({
        params: { series: series.id, item: itemSlug(item) },
        props: { item, series, seriesItems },
      }));
    });
};
