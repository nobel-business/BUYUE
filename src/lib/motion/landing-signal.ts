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
