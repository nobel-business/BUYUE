'use client';

/**
 * Tiny coordination channel between the Preloader and everything that must wait
 * for the intro to finish before starting its own entrance (the hero timeline,
 * and the smooth-scroll lock). A flag + waiter registry — race-free regardless
 * of which component's effect runs first (a late subscriber to an already-done
 * intro is invoked immediately).
 */
let done = false;
const waiters = new Set<() => void>();

/** Called by the Preloader when the intro has finished (or is skipped). */
export function markPreloaderDone(): void {
  if (done) return;
  done = true;
  waiters.forEach((cb) => cb());
  waiters.clear();
}

/** Run `cb` when the intro is done — now, if it already is. Returns unsubscribe. */
export function onPreloaderDone(cb: () => void): () => void {
  if (done) {
    cb();
    return () => {};
  }
  waiters.add(cb);
  return () => waiters.delete(cb);
}

export function isPreloaderDone(): boolean {
  return done;
}
