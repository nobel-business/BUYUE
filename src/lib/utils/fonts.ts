/**
 * FONT LOADING ARCHITECTURE
 *
 * STATUS (audit C-11): The licensed webfont files for the brand typefaces are
 * NOT yet in the repository:
 *   - Arabic:  29LT Zarid (Light / Regular / Medium / Bold)  — Doc 03 §4.1
 *   - Latin:   Articulat V3 (Articulat CF)                    — Doc 03 §4.2
 *
 * Until the licensing is confirmed and the files are provided, the site renders
 * with the Doc 03 §4.3 FALLBACK STACKS (defined in src/styles/globals.css).
 * This keeps the build green and the layout metrics stable.
 *
 * ── WHEN THE LICENSED FILES ARRIVE ──────────────────────────────────────────
 * 1. Drop the .woff2 files into `public/fonts/` (see public/fonts/README.md).
 * 2. Uncomment and complete the `next/font/local` definitions below.
 * 3. Apply the exported CSS variables on <body> in the root layout, and prepend
 *    the real families to --font-arabic / --font-latin in globals.css.
 * `display: 'swap'` + matched fallback metrics prevent FOUC/CLS (Doc 05 §3, Doc 07 §6).
 */

// import localFont from 'next/font/local';
//
// export const zarid = localFont({
//   variable: '--font-arabic-loaded',
//   display: 'swap',
//   src: [
//     { path: '../../public/fonts/zarid-light.woff2', weight: '300', style: 'normal' },
//     { path: '../../public/fonts/zarid-regular.woff2', weight: '400', style: 'normal' },
//     { path: '../../public/fonts/zarid-medium.woff2', weight: '500', style: 'normal' },
//     { path: '../../public/fonts/zarid-bold.woff2', weight: '700', style: 'normal' },
//   ],
// });
//
// export const articulat = localFont({
//   variable: '--font-latin-loaded',
//   display: 'swap',
//   src: [
//     { path: '../../public/fonts/articulat-regular.woff2', weight: '400', style: 'normal' },
//     { path: '../../public/fonts/articulat-medium.woff2', weight: '500', style: 'normal' },
//     { path: '../../public/fonts/articulat-bold.woff2', weight: '700', style: 'normal' },
//   ],
// });

/**
 * Placeholder export so consumers can import a stable symbol now and switch to
 * the real font variables later without changing call sites.
 */
export const fontVariables = '' as const;
