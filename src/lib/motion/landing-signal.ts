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
