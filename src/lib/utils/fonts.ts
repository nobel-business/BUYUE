import {
  Instrument_Serif,
  Instrument_Sans,
  JetBrains_Mono,
  Noto_Naskh_Arabic,
} from 'next/font/google';

/**
 * TYPOGRAPHY SYSTEM — the Claude Design landing system, applied site-wide.
 *
 * The four fonts of the design (Buyue Hero.html <head>), self-hosted at build by
 * `next/font/google` (no runtime request to Google; matched-metric fallbacks prevent
 * FOUC/CLS — Doc 05 §3, Doc 07 §6). The design's exact axes are requested:
 *   - Display / Serif (headings):  Instrument Serif  ital@0;1  (WEIGHT 400 ONLY)
 *   - Sans (body / UI):            Instrument Sans   wght@400;500;600;700
 *   - Mono (labels / HUD):         JetBrains Mono    wght@400;500;600
 *   - Arabic (display + body):     Noto Naskh Arabic wght@400;500;600;700
 *
 * The CSS variables are consumed by the role tokens in src/styles/tokens.css
 * (--font-display / --font-body / --font-mono / --font-arabic). Latin faces carry no
 * Arabic glyphs, so the display/body/mono tokens append the loaded Noto Naskh — mixed
 * script renders per-glyph. `fontVariables` is applied on <html> in the root layout.
 *
 * IMPORTANT (design fidelity): Instrument Serif ships weight 400 only. Headings must
 * NEVER be faux-bolded — globals.css sets `font-synthesis: none` on h1–h6 so a 700
 * declaration renders clean 400 glyphs (the previous migration's #1 defect was faux-
 * bold serif). The design does not use Manrope (a stray authoring reference); the
 * display font is Instrument Serif for both the intro and the settled hero.
 */
export const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

export const instrumentSans = Instrument_Sans({
  variable: '--font-instrument-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: '--font-noto-naskh',
  weight: ['400', '500', '600', '700'],
  subsets: ['arabic'],
  display: 'swap',
});

/** Combined variable class list — apply on <html> so the CSS vars resolve site-wide. */
export const fontVariables = [
  instrumentSerif.variable,
  instrumentSans.variable,
  jetbrainsMono.variable,
  notoNaskhArabic.variable,
].join(' ');
