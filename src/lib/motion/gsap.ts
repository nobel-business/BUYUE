'use client';

/**
 * Central GSAP entrypoint — the ONLY place ScrollTrigger is registered so the
 * plugin is wired exactly once across the app (Mission: motion architecture).
 * Import `gsap` / `ScrollTrigger` from here, never directly from 'gsap'.
 *
 * Division of labour (never mix libraries on the same property):
 *   GSAP + ScrollTrigger → scroll-driven motion (reveal, parallax, scrub, pin).
 *   Framer Motion         → interaction motion (hover, tap, modals, menus).
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register only in the browser; ScrollTrigger touches window on register and
// this module is also evaluated during SSR of client components.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
