'use client';

import { useEffect, useState } from 'react';
import { markPreloaderDone } from '@/lib/motion/preloader-signal';
import styles from './Preloader.module.css';

/** Fade duration — must match the transition in Preloader.module.css. */
const FADE_MS = 600;

/** Hard cap on the hold. A stalled font or image can never strand the cover. */
const MAX_HOLD_MS = 4000;

type Phase = 'holding' | 'fading' | 'gone';

/**
 * Minimal intro cover: the brand mark, centred, on the page background — no
 * spinner, no progress bar, no text, no motion. It holds while the page loads,
 * then fades out once in 0.6s and unmounts.
 *
 * It renders opaque in the server markup, so it is painted on the very first
 * frame and the reader never glimpses a half-built page. `position: fixed`
 * keeps it out of flow (no layout shift), and `--surface-page` is the same
 * background the loaded page uses, so the fade reveals content without any
 * change in backdrop. A <noscript> rule hides it outright, so a visitor without
 * JS is never trapped behind a cover that has nothing to lift it.
 *
 * "Ready" is window load plus webfonts settled, capped by MAX_HOLD_MS.
 * `markPreloaderDone()` fires as the fade begins, so hero entrances and the
 * scroll unlock cross-dissolve with the last 0.6s rather than waiting for it.
 */
export function Preloader() {
  const [phase, setPhase] = useState<Phase>('holding');

  useEffect(() => {
    let alive = true;
    let fadeTimer = 0;
    let capTimer = 0;

    const lift = () => {
      if (!alive) return;
      alive = false;
      window.clearTimeout(capTimer);
      markPreloaderDone();

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setPhase('gone');
        return;
      }
      setPhase('fading');
      fadeTimer = window.setTimeout(() => setPhase('gone'), FADE_MS);
    };

    const loaded =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            window.addEventListener('load', () => resolve(), { once: true });
          });

    // Webfonts settle before the reveal so text does not re-flow into view.
    // Never let a font failure hold the page: fall through on rejection.
    const fonts = document.fonts ? document.fonts.ready.catch(() => undefined) : Promise.resolve();

    void Promise.all([loaded, fonts]).then(lift);
    capTimer = window.setTimeout(lift, MAX_HOLD_MS);

    return () => {
      alive = false;
      window.clearTimeout(fadeTimer);
      window.clearTimeout(capTimer);
    };
  }, []);

  if (phase === 'gone') return null;

  return (
    <>
      <div className={styles.overlay} data-phase={phase} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- static brand mark, sized by CSS */}
        <img
          className={styles.mark}
          src="/brand/buyue-mark-trim.png"
          alt=""
          fetchPriority="high"
          draggable={false}
        />
      </div>
      <noscript>
        {/* Without JS nothing can lift the cover — hide it so the page is usable. */}
        <style>{`.${styles.overlay}{display:none}`}</style>
      </noscript>
    </>
  );
}
