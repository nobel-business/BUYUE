/**
 * TypeScript mirrors of design values that JavaScript needs directly
 * (media queries, z-index in JS, etc.). CSS remains the source of truth for
 * styling; these exist only where JS cannot read a CSS variable (Doc 07 §11).
 * Keep in sync with tokens.css.
 */

/** Breakpoints in px (Doc 03 §25). Mobile ≤640, tablet 641–1024, desktop 1025–1440, wide >1440. */
export const breakpoints = {
  mobile: 640,
  tablet: 1024,
  desktop: 1440,
} as const;

export const mediaQuery = {
  tablet: `(min-width: ${breakpoints.mobile + 1}px)`,
  desktop: `(min-width: ${breakpoints.tablet + 1}px)`,
  wide: `(min-width: ${breakpoints.desktop + 1}px)`,
  /** Coarse pointer → touch device (Doc 05 §30). */
  touch: '(pointer: coarse)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
} as const;

export const zIndex = {
  base: 0,
  raised: 10,
  sticky: 100,
  overlay: 1000,
  modal: 1100,
  toast: 1200,
} as const;
