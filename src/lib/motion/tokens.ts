/**
 * Motion tokens for the `motion` library (Doc 05 §2). Single source shared with
 * tokens.css. Durations are in SECONDS here (motion uses seconds; CSS uses ms).
 */

export const duration = {
  instant: 0.1,
  fast: 0.2,
  base: 0.3,
  medium: 0.5,
  slow: 0.7,
  xslow: 1.0,
} as const;

/** Cubic-bezier easings (Doc 05 §2.2). */
export const easing = {
  standard: [0.4, 0, 0.2, 1],
  outSoft: [0.16, 1, 0.3, 1],
  inOutLux: [0.65, 0, 0.35, 1],
  emphasis: [0.34, 1.56, 0.64, 1],
} as const;

/** Default entrance distance in px (Doc 05 §2.4). */
export const entranceDistance = 24;

/**
 * GSAP ease strings mapped from the cubic-bezier tokens above, so the GSAP and
 * Framer engines share one motion vocabulary. Deliberately no bounce/back/
 * overshoot eases — motion must read as luxurious, never cartoonish (Mission).
 */
export const gsapEase = {
  /** Soft, expensive deceleration — the canonical reveal ease (≈ outSoft). */
  outSoft: 'expo.out',
  /** General-purpose in/out for scrubbed or two-way motion. */
  standard: 'power2.inOut',
  /** Linear — required for scrubbed parallax so it tracks scroll 1:1. */
  linear: 'none',
} as const;

/** Default stagger between grouped children in seconds (Doc 05 §2.3). */
export const staggerStep = 0.075;

/**
 * Canonical "fade + rise" entrance variants (Doc 05 §27). Directional axis is
 * resolved by the consuming component so it can mirror for RTL where relevant.
 */
export const revealVariants = {
  hidden: { opacity: 0, y: entranceDistance },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.medium, ease: easing.outSoft },
  },
} as const;

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: staggerStep },
  },
} as const;
