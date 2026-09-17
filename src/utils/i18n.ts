// pro-only. Per-language paths. The default language (site.locale) has no prefix.
import { i18n, site } from '../config';
import { getPosts, postHref } from './posts';

export const localePath = (locale: string, path: string) =>
  locale === site.locale ? path : `/${locale}${path}`;

const withSlash = (path: string) => (path.endsWith('/') ? path : `${path}/`);

// Note: only the blog listing and posts are localized, so only those are tracked. Add more here if other pages get translations
let localized: Promise<Set<string>> | undefined;
const localizedPaths = () =>
  (localized ??= getPosts(null).then(
    (posts) =>
      new Set([
        ...Object.keys(i18n.locales).map((l) => localePath(l, '/blog/')),
        ...posts.map(postHref),
      ]),
  ));

/**
 * The current page's URL in each language. Without a translation, exists is false and href is that language's blog listing (home for the default language).
 * Default-language pages outside the blog are assumed to exist.
 */
export async function alternates(pathname: string, current: string = site.locale) {
  const paths = await localizedPaths();
  const path = withSlash(pathname);
  const base = current === site.locale ? path : path.slice(current.length + 1);
  const isBlog = base.startsWith('/blog/');
  return Object.entries(i18n.locales).map(([locale, label]) => {
    const href = localePath(locale, base);
    const exists = locale === current || paths.has(href) || (locale === site.locale && !isBlog);
    return {
      locale,
      label,
      exists,
      href: exists ? href : locale === site.locale ? '/' : localePath(locale, '/blog/'),
    };
  });
}

/** Points a header link at the current language. Leaves it unchanged if that language has no such page. */
export async function localizeHref(href: string, current: string = site.locale) {
  const target = localePath(current, withSlash(href));
  return current !== site.locale && (await localizedPaths()).has(target) ? target : href;
}
