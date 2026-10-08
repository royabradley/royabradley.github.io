# Deploy

Pilcrow builds to a static site in `dist/`. There is no server runtime to configure.

## Before you deploy

Set `site.url` in `src/config.ts` to your production URL. It is used for canonical links, RSS, and the sitemap.

## Requirements

- Node.js 22.12 or newer.
- pnpm 9 or newer. `package.json` pins the exact version in the `packageManager` field; pnpm 10+ and Corepack switch to it on their own. To install that exact version yourself:

```sh
npm i -g "$(node -p "require('./package.json').packageManager.split('+')[0]")"
```

## Build

```sh
pnpm install
pnpm build
```

Output goes to `dist/`. The Pagefind search index (when `features.search` is `true` in `src/config.ts`) is built as part of `pnpm build`; no separate indexing step is needed.

## Your own repository

Hosts build from a Git repository you own. The Pro repository is private and can't be forked, and the zip has no Git history, so push your copy to a new repository (private is fine) first.

If you cloned from GitHub, keep the theme repository as `upstream` so you can pull later releases:

```sh
git remote rename origin upstream
git remote add origin https://github.com/<you>/<your-site>.git
git push -u origin main
```

If you started from the zip:

```sh
git init -b main
git add -A
git commit -m "Start from Pilcrow Pro"
git remote add origin https://github.com/<you>/<your-site>.git
git push -u origin main
```

Then connect that repository to one of the hosts below. The defaults work; you only need to confirm the build settings.

## Cloudflare

Build command: `pnpm build`. Output directory: `dist`.

## Vercel

Framework preset: Astro. Build command: `pnpm build`. Output directory: `dist`.

## Netlify

Build command: `pnpm build`. Publish directory: `dist`.

## CI

`.github/workflows/ci.yml` runs on every push to `main` and on pull requests: install, `pnpm check`, `pnpm check:contrast`, `pnpm lint`, `pnpm build`, a Lighthouse run, and an internal link check against `dist`. Use it as a reference for what a deploy pipeline should verify before shipping.
