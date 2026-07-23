/**
 * Whether the WebGL landing scene should run: a browser, motion allowed, and a WebGL
 * context available. Both the layout's <LandingScene> and the home page's copy check
 * this identically so they agree on whether the 3D experience or the static fallback
 * is active. Client-only (returns false during SSR).
 */
export function isLandingSceneCapable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}
