# Brand Webfonts — drop licensed files here

The site's whole typography system is wired to the two Buyue brand typefaces
(Doc 03 §4). They are **commercial** and are not committed to this repository.

**Dropping the licensed files into this folder is the only step needed.** The
`@font-face` rules are generated at build time by `src/lib/utils/brand-fonts.ts`
for whichever files it finds here, and the role tokens in `src/styles/tokens.css`
already name the brand families ahead of every fallback. No code change, no
token edit, no uncommenting.

## Required files

Any of `.woff2` (preferred) · `.woff` · `.otf` · `.ttf`. Every file is optional —
a partial licence loads what it has and falls back for the rest.

**Arabic — 29LT Bukra** → CSS family `29LT Bukra` — ✅ **installed and in use**

Client-supplied, and it takes precedence over Zarid in every Arabic slot: **Bold
carries titles, Regular carries everything else.** Delete these four files to fall
back to Zarid / Noto Naskh.

| File                | Weight       |
| ------------------- | ------------ |
| `bukra-light`       | 300          |
| `bukra-regular`     | 400          |
| `bukra-bold`        | 700          |
| `bukra-bold-italic` | 700 _italic_ |

> There is no 500/600 cut. `src/styles/globals.css` pins `h1`–`h6` to 700 on
> `:lang(ar)` so headings that declare `medium` don't resolve down to Regular.

**Latin — Articulat V3 / Articulat CF** (Doc 03 §4.2) → CSS family `Articulat V3`

| File                 | Weight       |
| -------------------- | ------------ |
| `articulat-light`    | 300          |
| `articulat-regular`  | 400          |
| `articulat-italic`   | 400 _italic_ |
| `articulat-medium`   | 500          |
| `articulat-demibold` | 600          |
| `articulat-bold`     | 700          |

**Arabic display — 29LT Zarid** (Doc 03 §4.1) → CSS family `29LT Zarid`

| File            | Weight |
| --------------- | ------ |
| `zarid-light`   | 300    |
| `zarid-regular` | 400    |
| `zarid-medium`  | 500    |
| `zarid-bold`    | 700    |

**Arabic body — 29LT Zarid Text** (Doc 03 §4.1, long-form reading) → CSS family
`29LT Zarid Text`

| File                 | Weight |
| -------------------- | ------ |
| `zarid-text-light`   | 300    |
| `zarid-text-regular` | 400    |
| `zarid-text-medium`  | 500    |
| `zarid-text-bold`    | 700    |

If the licence only ships `29LT Zarid` (no separate Text cut), just add the
`zarid-*` files — `--font-arabic` falls through to the display cut automatically.

## Converting from the supplied format

Foundries usually deliver `.otf`/`.ttf`. Those work as-is, but `.woff2` is
~30–50% smaller:

```bash
pip install fonttools brotli
fonttools ttLib.woff2 compress -o articulat-regular.woff2 ArticulatCF-Regular.otf
```

Then restart `npm run dev` (or rebuild) so the build-time scan picks them up.

## Verifying

After adding files and rebuilding, the page source should contain an inline
`<style>` with `@font-face{font-family:"Articulat V3"…}`. In DevTools →
Computed → `font-family` on a heading, the **rendered** font should read
`Articulat V3` (Latin) or `29LT Zarid` (Arabic).

## Until the files are here

The site runs on the Doc 03 §4.3 fallback stacks — **Inter** for Latin and
**Noto Naskh Arabic** for Arabic — both self-hosted via `next/font` in
`src/lib/utils/fonts.ts` so the fallback rung does not depend on the visitor's OS.

> ⚠ Blocked item **C-11**: confirm web-embedding (`@font-face`) licensing for
> Articulat V3 and 29LT Zarid before production launch. A desktop-only licence
> does **not** permit self-hosting these files.
