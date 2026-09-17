// pro-only. Per-post OG images. utils/og.ts ogImage() decides which posts get one
import type { APIRoute, GetStaticPaths } from 'astro';
import { getPosts } from '../../utils/posts';
import { ogImage, renderOgImage } from '../../utils/og';

export const getStaticPaths = (async () =>
  (await getPosts(null))
    .filter((post) => ogImage(post))
    .map((post) => ({ params: { slug: post.id }, props: { post } }))) satisfies GetStaticPaths;

export const GET: APIRoute<{ post: Awaited<ReturnType<typeof getPosts>>[number] }> = async ({
  props,
}) =>
  new Response(new Uint8Array(await renderOgImage(props.post)), {
    headers: { 'Content-Type': 'image/png' },
  });
