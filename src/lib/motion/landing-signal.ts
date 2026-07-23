/**
 * Cross-tree signal: is the WebGL landing scene actually running?
 *
 * The scene canvas lives in the layout (<LandingScene>, a truly-fixed layer outside
 * the page-transition transform); the hero copy lives in the home page (SSR, semantic
 * <h1>). The copy must switch to its scroll-revealed (hidden-until-`.in`) state ONLY
 * when the scene is present to reveal it — otherwise a no-WebGL reader would be left
 * with an invisible headline. <LandingScene> flips this flag when it mounts/unmounts
 * the scene; the copy subscribes and "arms" accordingly. Mirrors preloader-signal.
 */
let running = false;
const listeners = new Set<(v: boolean) => void>();

export function setLandingSceneRunning(value: boolean): void {
  if (running === value) return;
  running = value;
  for (const cb of listeners) cb(value);
}

export function onLandingSceneRunning(cb: (v: boolean) => void): () => void {
  listeners.add(cb);
  cb(running);
  return () => {
    listeners.delete(cb);
  };
}

export function isLandingSceneRunning(): boolean {
  return running;
}

/**
 * Cross-tree signal: how the navbar should behave over the landing.
 *
 * The design keeps its header OFF the studio during the intro and slides it in on the
 * capture scroll (`header.classList.add('in')` at scrollP > 0.14). Our production Header
 * lives in the layout and is always present, so LandingScene drives it through this
 * signal instead: `'hide'` for the intro, `'show'` through the capture (overriding the
 * Header's own hide-on-scroll-down so it stays put like the design's does), and `null`
 * once past the scene / on every non-landing surface, where the Header runs its normal
 * scroll behaviour. Latched one-way so scrolling back to the top never re-hides it.
 */
export type LandingNavState = 'hide' | 'show' | null;
let navState: LandingNavState = null;
const navListeners = new Set<(v: LandingNavState) => void>();

export function setLandingNavState(value: LandingNavState): void {
  if (navState === value) return;
  navState = value;
  for (const cb of navListeners) cb(value);
}

export function onLandingNavState(cb: (v: LandingNavState) => void): () => void {
  navListeners.add(cb);
  cb(navState);
  return () => {
    navListeners.delete(cb);
  };
}

/**
 * Cross-tree signal: the landing scene has painted its first frame.
 *
 * The scene's WebGL chunk loads and mounts asynchronously, independent of the intro
 * cover's `window.load` + fonts timing. Without coordination the cover can lift onto the
 * bare page behind the not-yet-active scene layer — a flash of the homepage before the
 * intro. The Preloader waits on this (on the home route, when the scene is expected) so
 * it lifts straight onto the studio; LandingScene fires it once the first frame is up.
 * Fires immediately for a late subscriber, and the cover's own MAX_HOLD caps the wait.
 */
let sceneReady = false;
const readyWaiters = new Set<() => void>();

export function markLandingSceneReady(): void {
  if (sceneReady) return;
  sceneReady = true;
  readyWaiters.forEach((cb) => cb());
  readyWaiters.clear();
}

export function onLandingSceneReady(cb: () => void): () => void {
  if (sceneReady) {
    cb();
    return () => {};
  }
  readyWaiters.add(cb);
  return () => readyWaiters.delete(cb);
}

/**
 * Session flag: has the landing intro already played this page-load?
 *
 * The scene is route-keyed, so leaving home and coming back re-mounts it. The intro must
 * play ONCE — on the first full site load — not on every client-side return. This module
 * singleton is true for the rest of the session once the intro starts and resets only on
 * a real page reload (the module re-evaluates), which is exactly "the entire site loads
 * for the first time". A return visit reads this and opens on the settled hero instead.
 */
let introPlayed = false;

export function markIntroPlayed(): void {
  introPlayed = true;
}

export function hasIntroPlayed(): boolean {
  return introPlayed;
}
