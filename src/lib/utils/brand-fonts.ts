import { readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * BRAND WEBFONT LOADER — self-hosted `@font-face` for the licensed Buyue faces.
 *
 * Articulat V3 and 29LT Zarid are commercial (Doc 03 §4, audit C-11), so their
 * files are NOT in the repo. This module scans `public/fonts/` at BUILD time and
 * emits `@font-face` rules only for the files that are actually there:
 *
 *   - files present → the brand faces load and win, because the role tokens in
 *     `src/styles/tokens.css` name them ahead of every fallback.
 *   - files absent  → no `@font-face` is emitted at all, so there are no 404s
 *     and no invisible-text flash; the stack falls through to the Doc 03 §4.3
 *     fallbacks (Inter / Noto Naskh Arabic, loaded in `fonts.ts`).
 *
 * Dropping the licensed `.woff2` files into `public/fonts/` is therefore the
 * ONLY step needed to convert the site — no code change, no token edit.
 * See `public/fonts/README.md` for the expected filenames.
 *
 * The scan runs once per process at module load; in production that is build
 * time (every page is statically rendered), so it costs nothing at runtime.
 *
 * SERVER ONLY — reads the filesystem. Import it from the root layout (or another
 * server component); never from a `'use client'` module.
 */

type FaceSpec = {
  /** CSS family name, exactly as referenced by the role tokens. */
  family: string;
  /** Basename (no extension) expected in `public/fonts/`. */
  file: string;
  weight: number;
  style?: 'normal' | 'italic';
};

/**
 * Doc 03 §4.1–4.2 weight sets. Every entry is OPTIONAL — a partial licence
 * (say, Regular + Bold only) emits only what it has, and the browser synthesises
 * nothing because `font-synthesis` is disabled on headings (globals.css).
 */
const FACES: readonly FaceSpec[] = [
  // ── Latin — Articulat V3 / Articulat CF (Doc 03 §4.2) ──────────────────────
  { family: 'Articulat V3', file: 'articulat-light', weight: 300 },
  { family: 'Articulat V3', file: 'articulat-regular', weight: 400 },
  { family: 'Articulat V3', file: 'articulat-italic', weight: 400, style: 'italic' },
  { family: 'Articulat V3', file: 'articulat-medium', weight: 500 },
  { family: 'Articulat V3', file: 'articulat-demibold', weight: 600 },
  { family: 'Articulat V3', file: 'articulat-bold', weight: 700 },

  // ── Arabic display — 29LT Zarid (Doc 03 §4.1) ─────────────────────────────
  { family: '29LT Zarid', file: 'zarid-light', weight: 300 },
  { family: '29LT Zarid', file: 'zarid-regular', weight: 400 },
  { family: '29LT Zarid', file: 'zarid-medium', weight: 500 },
  { family: '29LT Zarid', file: 'zarid-bold', weight: 700 },

  // ── Arabic body — 29LT Zarid Text (Doc 03 §4.1: long-form reading) ────────
  { family: '29LT Zarid Text', file: 'zarid-text-light', weight: 300 },
  { family: '29LT Zarid Text', file: 'zarid-text-regular', weight: 400 },
  { family: '29LT Zarid Text', file: 'zarid-text-medium', weight: 500 },
  { family: '29LT Zarid Text', file: 'zarid-text-bold', weight: 700 },
];

/** Preferred first — woff2 is ~30% smaller and universally supported by our targets. */
const EXTENSIONS = ['woff2', 'woff', 'otf', 'ttf'] as const;

const FORMAT: Record<(typeof EXTENSIONS)[number], string> = {
  woff2: 'woff2',
  woff: 'woff',
  otf: 'opentype',
  ttf: 'truetype',
};

function listFontFiles(): Set<string> {
  try {
    return new Set(readdirSync(join(process.cwd(), 'public', 'fonts')));
  } catch {
    // No public/fonts directory at all — treat as "no licensed files yet".
    return new Set();
  }
}

function buildCss(): string {
  const available = listFontFiles();
  const rules: string[] = [];

  for (const face of FACES) {
    const ext = EXTENSIONS.find((e) => available.has(`${face.file}.${e}`));
    if (!ext) continue;

    rules.push(
      [
        '@font-face{',
        `font-family:"${face.family}";`,
        `src:url("/fonts/${face.file}.${ext}") format("${FORMAT[ext]}");`,
        `font-weight:${face.weight};`,
        `font-style:${face.style ?? 'normal'};`,
        // `swap` keeps text visible on the Doc 03 fallback while the brand face
        // downloads, so there is no FOIT (Doc 05 §3).
        'font-display:swap;',
        '}',
      ].join(''),
    );
  }

  return rules.join('');
}

/**
 * `@font-face` CSS for every licensed brand file present, or '' when none are.
 * Injected into <head> by the root layout; render nothing when empty.
 */
export const brandFontFaceCss = buildCss();

/** True when at least one licensed brand face is self-hosted. */
export const hasBrandFonts = brandFontFaceCss.length > 0;
