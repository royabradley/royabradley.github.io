// `$…$` and `$$…$$` in a post render to KaTeX HTML at build time, so no math runs in the browser.
// Sätteri parses them (`features.math`); this runs on the mdast so the code highlighter never sees
// a display block as a plain code block. The plugin flags the post's frontmatter so PostLayout
// loads the KaTeX stylesheet only on pages that have math.
//
// pro-only: equation numbers. A display formula with `\label{key}` gets the next number and
// id="eq-key"; `\eqref{key}` and `\ref{key}` anywhere in math become links to it. Labels are
// collected before anything renders, so a reference may come before its equation.
import katex from 'katex';
// Registers \ce and \pu for chemical equations and units
import 'katex/contrib/mhchem';
import type { SatteriProcessorOptions } from '@astrojs/markdown-satteri';

type Entry = NonNullable<SatteriProcessorOptions['mdastPlugins']>[number];
type Plugin = Extract<Entry, { inlineMath?: unknown }>;
type Context = Parameters<NonNullable<Plugin['math']>>[1];
type Node = { type: string; value?: string; children?: Node[] };

const LABEL = /\\label\{([^}]*)\}/;
// `eq:energy` and `energy` both anchor at #eq-energy
const anchor = (key: string) => `eq-${key.replace(/^eq[:-]/, '').replace(/[^\w-]+/g, '-')}`;
const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const labelsOf = (ctx: Context) =>
  ((ctx.data as { mathLabels?: Map<string, number> }).mathLabels ??= new Map());

// MDX parses `raw` into JSX (mdxExpressions: false keeps KaTeX's braces literal). Markdown takes
// an html node: a `raw` string there is read as Markdown again and lands in its own <p>.
const wrap = (html: string, ctx: Context) =>
  ctx.sourceFormat === 'mdx'
    ? { raw: html, mdxExpressions: false }
    : { type: 'html' as const, value: html };

const render = (displayMode: boolean) => (node: { value: string }, ctx: Context) => {
  if (ctx.data.astro) ctx.data.astro.frontmatter.hasMath = true;
  const labels = labelsOf(ctx);
  // A reference on its own is a word in the sentence: a link in the body face, not KaTeX's larger type
  const ref = displayMode ? undefined : node.value.trim().match(/^\\(eq)?ref\{([^}]*)\}$/);
  if (ref) {
    const n = labels.get(ref[2]!);
    const text = n ? (ref[1] ? `(${n})` : `${n}`) : '(??)';
    return wrap(n ? `<a href="#${anchor(ref[2]!)}">${text}</a>` : text, ctx);
  }
  let tex = node.value;
  const label = displayMode ? tex.match(LABEL)?.[1] : undefined;
  if (label) tex = `${tex.replace(LABEL, '')}\\tag{${labels.get(label)}}`;
  tex = tex.replace(/\\(eq)?ref\{([^}]*)\}/g, (_, eq: string | undefined, key: string) => {
    const n = labels.get(key);
    if (!n) return '\\text{(??)}';
    return `\\href{#${anchor(key)}}{\\text{${eq ? `(${n})` : n}}}`;
  });
  // A typo shows the source in red with KaTeX's message as its title instead of failing the build
  let html = katex.renderToString(tex, {
    displayMode,
    throwOnError: false,
    // \href only for the in-page links made above
    trust: (context) => context.command === '\\href' && context.url.startsWith('#'),
  });
  if (label)
    html = html.replace('class="katex-display"', `id="${anchor(label)}" class="katex-display"`);
  // Copying a formula gives back what the author wrote, not the \tag and \href added here
  html = html.replace(
    /(<annotation encoding="application\/x-tex">)[\s\S]*?(<\/annotation>)/,
    (_, open: string, close: string) => open + escapeHtml(node.value) + close,
  );
  return wrap(html, ctx);
};

export const math: Plugin = {
  name: 'math',
  // pro-only: number the labelled display formulas in document order
  before(root, ctx) {
    const labels = labelsOf(ctx as unknown as Context);
    const walk = (node: Node) => {
      const key = node.type === 'math' ? node.value?.match(LABEL)?.[1] : undefined;
      if (key && !labels.has(key)) labels.set(key, labels.size + 1);
      node.children?.forEach(walk);
    };
    walk(root as unknown as Node);
  },
  inlineMath: render(false),
  math: render(true),
};
