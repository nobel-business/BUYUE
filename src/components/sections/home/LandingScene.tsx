'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from '@/i18n/navigation';
import { isLandingSceneCapable } from '@/lib/motion/landing-capable';
import {
  setLandingSceneRunning,
  setLandingNavState,
  markLandingSceneReady,
  markIntroPlayed,
  hasIntroPlayed,
} from '@/lib/motion/landing-signal';
import { onPreloaderDone } from '@/lib/motion/preloader-signal';
import { cn } from '@/lib/utils/cn';
import styles from './LandingScene.module.css';

/**
 * The Claude Design WebGL hero, hosted as a TRULY viewport-fixed layer.
 *
 * Rendered in the root layout (a sibling of AmbientBackground, OUTSIDE the page-
 * transition `template`) so `position: fixed` resolves against the viewport — the
 * design's "world scrolls over a locked lens" behaviour, reproduced 1:1 (the reverted
 * attempt's `position: sticky` released the scene and lost the tail). It holds only
 * the 3D canvas, its effects (keylight / vignette / sparkles / reticle / tip / flash)
 * and the HUD; the hero copy is server-rendered in the home page and revealed by the
 * scene. Route-gated to the home route; mounts the vendored scene only when WebGL is
 * available and motion is allowed (otherwise the page's static hero is the fallback).
 * WebGL context is created once and torn down cleanly on leaving home / unmount.
 */
export function LandingScene() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const sceneRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  // NOTE: LandingScene lives in the (persistent) layout — it renders null off-home but
  // NEVER unmounts on client navigation, so "is this a return visit?" must be read fresh
  // each time isHome flips to true (inside the effects, via hasIntroPlayed()), NOT captured
  // once at mount. Capturing it once left every return in "intro" mode → the replay bug.

  // Hide the fixed layer once scrolled past the hero, so its opaque canvas + HUD/effects
  // don't show behind the transparent lower sections; restore on scrolling back up. First
  // visit: past the ~200vh capture. Return visit: past a normal ~100vh settled hero.
  useEffect(() => {
    if (!isHome) return;
    const threshold = hasIntroPlayed() ? 1.0 : 2.0;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setPastHero(window.scrollY > window.innerHeight * threshold);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isHome]);

  useEffect(() => {
    if (!isHome || !isLandingSceneCapable()) return;
    const el = sceneRef.current;
    if (!el) return;

    // Read fresh on every home entry (see NOTE above): true = the intro already played
    // this session → open on the settled hero; false = first visit → play the intro.
    const returning = hasIntroPlayed();
    const win = window as Window & { __heroStarted?: boolean; __heroSkipIntro?: boolean };
    // Return visit → the scene opens directly on its settled end-state (studio + rays,
    // camera behind the headline) instead of replaying the cinematic. First visit → intro.
    win.__heroSkipIntro = returning;

    let teardownNav = () => {};
    let offPreloader = () => {};

    if (returning) {
      // Settled return: no cover to wait on and no cinematic to gate, so let the (already
      // settled) timeline tick immediately for ambient life. The copy shows STATICALLY —
      // we deliberately do NOT arm it (setLandingSceneRunning stays false → HomeHero's
      // 100vh static hero), and the navbar stays normal (nav signal left null).
      win.__heroStarted = true;
    } else {
      // First visit — the full intro.
      // Arm the hero copy IMMEDIATELY (before the chunk loads): its hidden-until-revealed
      // state is `.armed` (HomeHero), whose CSS default is SHOWN, so any gap flashes the
      // whole hero over the intro. A genuine load failure below un-arms it.
      setLandingSceneRunning(true);

      // Drive the navbar like the design's header: OFF through the intro, slid in TOGETHER
      // with the copy — keyed to the scene's OWN reveal flag window.__textShown (set the
      // instant it adds `.in`), NOT a raw scroll threshold, since the scene reveals on a
      // smoothed scroll value plus a ~0.85s beat — held through the capture (overriding the
      // Header's hide-on-scroll-down), then released to normal (null) past the scene. rAF
      // poll because the reveal is time-based; it stops once the navbar is normal again.
      const sceneWin = window as Window & { __textShown?: boolean };
      let revealed = false;
      let entered = false;
      const ENTER_AT = () => window.innerHeight * 2.0; // matches pastHero / scene hide
      setLandingNavState('hide');
      let navRaf = 0;
      const tickNav = () => {
        if (!revealed && sceneWin.__textShown) revealed = true;
        if (!entered && window.scrollY > ENTER_AT()) entered = true;
        // entered wins: once into the content the navbar is fully normal, even if a very
        // fast scroll got there before the copy-reveal beat fired.
        setLandingNavState(entered ? null : revealed ? 'show' : 'hide');
        navRaf = entered ? 0 : requestAnimationFrame(tickNav);
      };
      navRaf = requestAnimationFrame(tickNav);
      teardownNav = () => {
        if (navRaf) cancelAnimationFrame(navRaf);
        navRaf = 0;
      };

      // The scene's timeline is gated on __heroStarted; setting it as the cover lifts makes
      // the FULL cinematic play from the start (not unseen behind the cover). Mark the
      // intro "played" HERE, in the callback — not in the effect body — so React
      // StrictMode's throwaway first mount (whose callback is unregistered on cleanup
      // before it fires) can't mark it and make the real mount think it's a return visit.
      offPreloader = onPreloaderDone(() => {
        win.__heroStarted = true;
        markIntroPlayed();
      });
    }

    let destroy: (() => void) | undefined;
    let cancelled = false;
    let settled = false;

    // Fall back to the static hero if the scene fails or never shows: un-arm so the copy
    // can't be stranded invisible, release the navbar so it can't be stranded 'hide', and
    // let the cover through. Realistic failures REJECT (chunk 404 after a redeploy, offline)
    // → .catch; the watchdog, aligned to the cover's MAX_HOLD, also covers a true stall.
    let watchdog = 0;
    const giveUp = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(watchdog);
      setLandingSceneRunning(false);
      teardownNav();
      setLandingNavState(null);
      markLandingSceneReady();
    };
    watchdog = window.setTimeout(giveUp, 4000); // mirror Preloader MAX_HOLD_MS

    import('./hero-scene/scene.js')
      .then((mod) => {
        if (cancelled || settled || !sceneRef.current) {
          markLandingSceneReady(); // superseded (unmounted / fell back) — just release
          return;
        }
        // initHeroScene() FIRST: if it throws (WebGLRenderer creation failing at runtime),
        // the throw reaches .catch(giveUp) while `settled` is still false, so the fallback
        // actually runs instead of being neutered by the guard. Only mark settled / clear
        // the watchdog once it has returned successfully.
        const d = mod.initHeroScene(sceneRef.current);
        settled = true;
        window.clearTimeout(watchdog);
        destroy = d;
        setActive(true); // reveal the (painted) layer
        // Release the intro cover only once the studio has actually painted — React's
        // commit for `active` (one frame) then a scene draw (the next).
        requestAnimationFrame(() => requestAnimationFrame(() => markLandingSceneReady()));
      })
      .catch(giveUp);

    return () => {
      cancelled = true;
      window.clearTimeout(watchdog);
      teardownNav();
      setLandingNavState(null);
      offPreloader();
      setActive(false);
      setLandingSceneRunning(false);
      destroy?.();
    };
  }, [isHome]);

  if (!isHome) return null;

  const activeAttr = (active && !pastHero) || undefined;

  return (
    <>
      {/* BEHIND the page: the 3D world + its glows + capture flash scroll under the
          content during the handoff (z-index:-1, matching the design's locked lens). */}
      <div
        className={cn(styles.layer, styles.sceneLayer)}
        data-active={activeAttr}
        aria-hidden="true"
      >
        <div id="scene" ref={sceneRef} />
        <div id="keylight" />
        <canvas id="sparkles" />
        <div id="vignette" />
        <div id="flash" />
      </div>

      {/* ON TOP of the page: the readable HUD chrome — REC tag, viewfinder corners, scroll
          cue, reticle, tooltip — crisp and unclipped, exactly like the design. */}
      <div
        className={cn(styles.layer, styles.hudLayer)}
        data-active={activeAttr}
        aria-hidden="true"
      >
        <div id="hud">
          <div className="vf" style={{ top: 28, left: 28, borderRight: 0, borderBottom: 0 }} />
          <div className="vf" style={{ top: 28, right: 28, borderLeft: 0, borderBottom: 0 }} />
          <div className="vf" style={{ bottom: 28, left: 28, borderRight: 0, borderTop: 0 }} />
          <div className="vf" style={{ bottom: 28, right: 28, borderLeft: 0, borderTop: 0 }} />
          <div className="rec">
            <i />
            REC · 24FPS · f/1.4 · BUYUE COMPANY
          </div>
        </div>

        <div className="scrollcue" id="scrollcue">
          <span>SCROLL TO CAPTURE</span>
          <span className="chev">
            <i />
            <i />
          </span>
        </div>

        <div id="reticle">
          <span className="tl" />
          <span className="tr" />
          <span className="bl" />
          <span className="br" />
          <span className="dot" />
        </div>
        <div id="tip" />
      </div>
    </>
  );
}
