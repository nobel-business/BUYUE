import { Inter, Noto_Naskh_Arabic } from 'next/font/google';

/**
 * TYPOGRAPHY SYSTEM — the Buyue brand typefaces (Doc 03 §4).
 *
 * The brand specifies exactly TWO families and forbids a third (Doc 07 §184):
 *   - Latin / English → `Articulat V3` (aka Articulat CF)   — Doc 03 §4.2
 *   - Arabic          → `29LT Zarid` (display) + `29LT Zarid Text` (body) — Doc 03 §4.1
 *
 * Both are COMMERCIAL and are not committed to this repo. They are self-hosted
 * from `public/fonts/` and wired up by `src/lib/utils/brand-fonts.ts`, which
 * emits `@font-face` rules at build time for whichever licensed files are
 * present. Nothing else needs changing when the files land — the role tokens in
 * `src/styles/tokens.css` already name the brand families first.
 *
 * The two faces loaded here are the DOCUMENTED FALLBACKS from Doc 03 §4.3, not
 * design choices:
 *   Arabic: `29LT Zarid, "Noto Naskh Arabic", "Segoe UI", Tahoma, sans-serif`
 *   Latin:  `Articulat V3, "Inter", "Helvetica Neue", Arial, sans-serif`
 * They are self-hosted at build by `next/font/google` (no runtime request to
 * Google; matched-metric fallbacks prevent FOUC/CLS — Doc 05 §3, Doc 07 §6) so
 * the fallback rung is reliable rather than dependent on what the OS happens to
 * ship. Once the licensed files are in `public/fonts/`, the brand faces win and
 * these are never painted.
 *
 * TODO(C-11): confirm web-embedding licences for Articulat V3 and 29LT Zarid.
 */

/** Latin fallback — the "Inter" rung of the Doc 03 §4.3 Latin stack. */
export const interFallback = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

/** Arabic fallback — the "Noto Naskh Arabic" rung of the Doc 03 §4.3 Arabic stack. */
export const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: '--font-noto-naskh',
  weight: ['400', '500', '600', '700'],
  subsets: ['arabic'],
  display: 'swap',
});

/** Combined variable class list — apply on <html> so the CSS vars resolve site-wide. */
export const fontVariables = [interFallback.variable, notoNaskhArabic.variable].join(' ');
