'use client';

/**
 * Tiny coordination channel between the intro cover and everything that must
 * wait for it to finish before starting its own entrance (the hero timelines,
 * and the smooth-scroll lock). A flag + waiter registry — race-free regardless
 * of which component's effect runs first (a late subscriber to an already-done
 * intro is invoked immediately).
 *
 * The gate starts closed and the intro cover opens it as it begins to fade, so
 * hero entrances cross-dissolve with the cover's last 0.6s instead of waiting
 * for it. Client-only: with JS disabled none of the gated code runs at all, so
 * nothing can be stranded behind a gate that never opens.
 */
let done = false;
const waiters = new Set<() => void>();

/** Called by the intro cover when it has finished (or is skipped). */
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
