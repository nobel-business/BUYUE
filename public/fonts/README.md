# Brand Webfonts — drop licensed files here

The Buyue brand typefaces (Doc 03 §4) are **commercial** and are not committed to
this repository. Placing the licensed `.woff2` files here activates them.

## Required files

**Arabic — 29LT Zarid** (Doc 03 §4.1)

- `zarid-light.woff2` (300)
- `zarid-regular.woff2` (400)
- `zarid-medium.woff2` (500)
- `zarid-bold.woff2` (700)

**Latin — Articulat V3 / Articulat CF** (Doc 03 §4.2)

- `articulat-regular.woff2` (400)
- `articulat-medium.woff2` (500)
- `articulat-bold.woff2` (700)

## After adding the files

1. Uncomment the `next/font/local` definitions in `src/lib/fonts.ts`.
2. Apply the exported font-variable classes on `<body>` in
   `src/app/[locale]/layout.tsx`.
3. Prepend the real families to `--font-arabic` / `--font-latin` in
   `src/styles/globals.css`.

> ⚠ Blocked item **C-11**: confirm web-embedding licensing for both families
> before production launch. Until then the site uses fallback stacks.
