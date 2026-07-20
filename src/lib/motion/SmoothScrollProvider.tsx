'use client';

import { useEffect, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { gsap, ScrollTrigger } from './gsap';
import { isPreloaderDone, onPreloaderDone } from './preloader-signal';

/**
 * Native scrolling on every page — the wheel/trackpad scrolls 1:1 with no inertia
 * smoothing (Lenis removed). This provider owns a normalised scroll-velocity signal
 * (`--sv`) for ambient motion, a ref-counted native scroll-lock (intro cover +
 * section takeovers), and a "back to top" action.
 *
 * GSAP ScrollTrigger drives itself off the browser's native scroll events, so every
 * pin/scrub/reveal keeps working exactly as before — only the smoothing is gone.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const root = document.documentElement;

    // Keep GSAP timing steady for scrubbed triggers under a stutter.
    gsap.ticker.lagSmoothing(0);

    // ── Native scroll → restrained velocity (0→1) for ambient life.
    let lastY = window.scrollY;
    let frame = 0;
    let decayTimer = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      if (!shouldReduce) {
        const sv = Math.min(1, Math.abs(y - lastY) / 40);
        root.style.setProperty('--sv', sv.toFixed(3));
        window.clearTimeout(decayTimer);
        decayTimer = window.setTimeout(() => root.style.setProperty('--sv', '0'), 120);
      }
      lastY = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    // ── Ref-counted native scroll-lock (overflow: hidden on <html>).
    let locks = 0;
    const lock = () => {
      locks += 1;
      root.classList.add('scroll-locked');
    };
    const unlock = () => {
      locks = Math.max(0, locks - 1);
      if (locks === 0) root.classList.remove('scroll-locked');
    };

    // Hold scroll under the intro cover; release when it lifts (race-free signal).
    let releaseLock = () => {};
    if (!isPreloaderDone()) {
      lock();
      let released = false;
      const done = () => {
        if (released) return;
        released = true;
        unlock();
      };
      const off = onPreloaderDone(done);
      releaseLock = () => {
        done();
        off();
      };
    }

    // Smooth "back to top" (footer button) — native, matched to motion preference.
    const onScrollTop = () =>
      window.scrollTo({ top: 0, behavior: shouldReduce ? 'auto' : 'smooth' });
    window.addEventListener('buyue:scroll-top', onScrollTop);

    // Let a section temporarily take over scrolling (e.g. the Services step-story).
    window.addEventListener('buyue:lenis-stop', lock);
    window.addEventListener('buyue:lenis-start', unlock);

    // Reconcile trigger positions once fonts/layout have settled.
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('buyue:scroll-top', onScrollTop);
      window.removeEventListener('buyue:lenis-stop', lock);
      window.removeEventListener('buyue:lenis-start', unlock);
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(decayTimer);
      releaseLock();
      root.classList.remove('scroll-locked');
    };
  }, [shouldReduce]);

  return <>{children}</>;
}
