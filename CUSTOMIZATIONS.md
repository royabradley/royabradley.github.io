# Customizations to Pilcrow Pro

This site is Pilcrow Pro plus a thin layer of my own code, kept apart from the theme so that a new
Pilcrow release merges with few or no conflicts. The theme is currently **v1.5.0** (merged 2026-11-10).

## Three layers and the seams between them

| Layer   | Where                                                                                       | Owner          | On a theme update                     |
| ------- | ------------------------------------------------------------------------------------------- | -------------- | ------------------------------------- |
| Theme   | Everything Pilcrow ships: `src/components`, `src/layouts`, `src/pages`, `src/styles/global.css`, `src/utils`, `AGENTS.md`, `docs/` | Pilcrow (upstream) | Merged from the release tag           |
| Overlay | `src/custom/`, `CUSTOMIZATIONS.md`, `CLAUDE.md`, `scripts/theme-status.sh`                  | Me             | Untouched                             |
| Content | `src/content/blog`, `src/content/work`, `src/content/authors.json`, my images in `src/assets` | Me             | Untouched, except the theme's demo entries |

A **seam** is a theme file that has to know about the overlay or carry my settings. Seams are the
only places a merge can conflict, so there should be few of them, each change small, marked in the
code with a `rab:` comment, and listed in the ledger below. The ledger is the checklist for every
update.

## Seam ledger

| File                              | Change                                                   | Why                                                      | Since   |
| --------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- | ------- |
| `src/config.ts`                   | Site identity, `seo.titleTemplate`                       | The theme's intended place for site values               | 2026-10 |
| `src/config.ts`                   | `i18n.locales` English only; `features.i18nRouting: false` | Korean support disabled. Theme demo posts in `src/content/blog/ko/` deleted; a theme update may re-add them, so delete them again on merge | 2026-11 |
| `src/pages/index.astro`           | Hero copy                                                | The theme's intended place for home-page content         | 2026-10 |
| `src/styles/global.css`           | One `@import` of `src/custom/styles/custom.css` (line 2) | Loads overlay styles with access to Tailwind and the theme tokens | 2026-11 |
| `tsconfig.json`                   | `@custom/*` path alias                                   | Stable import paths for overlay components from any depth | 2026-11 |
| `.gitignore`                      | `.pnpm-store/`                                           | Keep the local pnpm store out of git                     | 2026-10 |
| `.github/workflows/deploy.yml`    | Added: GitHub Pages deploy                               | Publishing                                               | 2026-10 |
| `.devcontainer/devcontainer.json` | Added: Node dev container; Node feature installs newest 22.x and pnpm 10.34.5 | Local tooling; the base image's Node is older than Astro 7.4 requires | 2026-10, 2026-11 |
| `.devcontainer/devcontainer-lock.json` | Added by the dev container rebuild                  | Pins the Node feature's version, the way `pnpm-lock.yaml` pins packages | 2026-11 |
| `package.json`, `pnpm-lock.yaml`  | Dependency bumps (Astro 7.4.8, `@astrojs/mdx` 8.1.3, `@astrojs/markdown-satteri` 0.4.7, KaTeX from Pilcrow v1.4); committed 2026-11-10 | Patch updates                               | 2026-11 |

### Forked theme components

None yet. When a theme component has to behave differently, copy it into `src/custom/components/`,
change the copy, point the one place that uses it at the copy, and add a row here.

| Fork | Copied from | Theme version | What changed |
| ---- | ----------- | ------------- | ------------ |

## Rules

1. **New code goes in `src/custom/`.** Components, styles and helpers live there, and nothing in
   the theme's folders imports them except through a seam.
2. **Fork, don't edit.** Changing a theme component in place means merging every upstream change
   to it by hand, forever. A fork turns that into an occasional, deliberate diff (see below).
3. **Settings go in `src/config.ts`**, which the theme designed for them.
4. **Schema additions go in `src/content.config.ts` as optional fields**, the theme's own rule.
   Mark each with `rab:` and add it to the ledger.
5. **Mark every seam** with a `rab:` comment, so `grep -rn "rab:" src` lists them all.

## One-time step: connect the history to Pilcrow

The first commit (`5d747a0`, 2026-10-08) is Pilcrow v1.3.0 plus my settings, but it was committed
as a fresh snapshot, so git sees no relation between my history and Pilcrow's. Until that changes,
`git merge v1.4.0` refuses to run ("refusing to merge unrelated histories"), and forcing it would
conflict on almost every file.

One merge fixes it. The `ours` strategy keeps every file exactly as it is and only records v1.3.0
as an ancestor:

```sh
git status        # commit or stash pending work first
git merge -s ours --allow-unrelated-histories -m "Record Pilcrow Pro v1.3.0 as the theme base" v1.3.0
git diff HEAD~1   # prints nothing: no file changed
./scripts/theme-status.sh
```

After this, every later release merges normally, and only files changed on both sides can conflict.

## Updating Pilcrow

Each Pilcrow release is a tag on the `upstream` remote (`v1.3.0`, `v1.4.0`, …). Read the release's
entry in the theme's `CHANGELOG.md` first, then:

```sh
git status                          # start clean: commit or stash first
./scripts/theme-status.sh           # new releases, and which of my seams they also touch
git switch -c theme-update-v1.4.0   # try the merge on a branch
git merge v1.4.0                    # merge the release tag
#   conflicts should appear only in seam files; resolve each one by hand
#   demo content I deleted and upstream changed: keep the deletion with `git rm <file>`
pnpm install && pnpm check && pnpm build
pnpm dev --host                     # look at the site before going further
git switch main && git merge theme-update-v1.4.0
```

Then update the version at the top of this file.

If `pnpm-lock.yaml` conflicts, don't resolve it by hand: take either side
(`git checkout --theirs pnpm-lock.yaml`), run `pnpm install` to regenerate it from the merged
`package.json`, and stage the result.

For each forked component, see what upstream changed in the original and apply what you want to
your copy by hand:

```sh
git diff v1.3.0 v1.4.0 -- src/components/blog/Sidenotes.astro
```

## Known constraints

- `src/utils/palette.js` reads color presets from `global.css` with a regex, for generated OG
  images and `pnpm check:contrast`. A Tufte-Doumont preset defined only in `custom.css` would be
  invisible to both. When the preset is built, either add its two blocks to `global.css` as a
  marked seam, or teach `palette.js` to read `custom.css` too. The first is simpler; the second
  keeps `global.css` clean.
- `AGENTS.md` forbids changing the props of components in `src/components/ui/`; that rule holds
  doubly here, since the theme's own pages depend on them.
