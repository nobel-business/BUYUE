'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from '@/i18n/navigation';
import { isLandingSceneCapable } from '@/lib/motion/landing-capable';
import { setLandingSceneRunning } from '@/lib/motion/landing-signal';
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

  useEffect(() => {
    if (!isHome || !isLandingSceneCapable()) return;
    const el = sceneRef.current;
    if (!el) return;

    let destroy: (() => void) | undefined;
    let cancelled = false;
    import('./hero-scene/scene.js')
      .then((mod) => {
        if (cancelled || !sceneRef.current) return;
        destroy = mod.initHeroScene(sceneRef.current);
        setActive(true);
        setLandingSceneRunning(true);
      })
      .catch(() => {
        /* keep the page's static hero on load failure */
      });

    return () => {
      cancelled = true;
      setActive(false);
      setLandingSceneRunning(false);
      destroy?.();
    };
  }, [isHome]);

  if (!isHome) return null;

  return (
    <div className={styles.layer} data-active={active || undefined} aria-hidden="true">
      <div id="scene" ref={sceneRef} />
      <div id="keylight" />
      <canvas id="sparkles" />
      <div id="vignette" />

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
      <div id="flash" />
    </div>
  );
}
