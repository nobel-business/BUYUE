'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import type { ClientLogo } from '@/lib/data/clientLogos';
import styles from './ClientWall.module.css';

/** Visible slots. A divisor of every column count (6/4/3/2) so no row is short,
 *  and smaller than the roster so there is always a reserve to cycle in. */
const SLOTS = 12;

/** One slot swaps per tick — staggered by construction, never a mass flip.
 *  The crossfade duration itself lives in the CSS opacity transition. */
const TICK_MS = 1500;

const altOf = (l: ClientLogo) => (l.alt === 'Client logo' ? '' : l.alt);

/**
 * The logo wall as a living showcase: a fixed set of slots, each crossfading to
 * another client on a rolling timer (the Ramotion pattern). Only one slot changes
 * per tick, so the motion is a quiet shimmer across the wall rather than a
 * synchronised flip, and the full roster rotates through over time.
 *
 * Client component (it owns a timer); the surrounding panel stays a server
 * component. Initial state is deterministic — the first SLOTS logos in order — so
 * the server and first client render match and hydration is clean; the timer only
 * starts mutating after mount.
 *
 * Reduced motion → the complete roster, static, nothing hidden and nothing moving.
 */
export function ClientWallGrid({ logos, label }: { logos: ClientLogo[]; label?: string }) {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return (
      <ul className={styles.wall} aria-label={label}>
        {logos.map((logo) => (
          <li key={logo.src} className={styles.cell}>
            {/* eslint-disable-next-line @next/next/no-img-element -- static brand marks, sized by CSS */}
            <img
              className={styles.logo}
              src={logo.src}
              alt={altOf(logo)}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </li>
        ))}
      </ul>
    );
  }

  return <SwitchingWall logos={logos} label={label} />;
}

function SwitchingWall({ logos, label }: { logos: ClientLogo[]; label?: string }) {
  const slotCount = Math.min(SLOTS, logos.length);

  // Which logo index each slot currently shows. Deterministic first paint.
  const [slots, setSlots] = useState<number[]>(() =>
    Array.from({ length: slotCount }, (_, i) => i),
  );

  // The reserve waiting to rotate in, and a round-robin pointer over the slots.
  const queue = useRef<number[]>(
    Array.from({ length: logos.length - slotCount }, (_, i) => i + slotCount),
  );
  const cursor = useRef(0);

  useEffect(() => {
    if (queue.current.length === 0) return; // nothing held back → nothing to swap
    const id = window.setInterval(() => {
      setSlots((cur) => {
        const q = queue.current;
        const slot = cursor.current % cur.length;
        cursor.current += 1;
        const incoming = q.shift()!;
        q.push(cur[slot]!); // the outgoing logo goes to the back of the queue
        const next = cur.slice();
        next[slot] = incoming;
        return next;
      });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <ul className={styles.wall} aria-label={label}>
      {slots.map((logoIdx, slot) => (
        <li key={slot} className={styles.cell}>
          <Slot logo={logos[logoIdx]!} />
        </li>
      ))}
    </ul>
  );
}

/**
 * A single slot with a true crossfade: two image layers, always mounted, with the
 * active one at rest opacity and the other transparent. A logo change flips which
 * layer is active, so the outgoing mark fades out as the incoming fades in — never
 * a blink to empty.
 */
function Slot({ logo }: { logo: ClientLogo }) {
  const [a, setA] = useState(logo);
  const [b, setB] = useState(logo);
  const [active, setActive] = useState<'a' | 'b'>('a');
  const shown = useRef(logo.src);

  useEffect(() => {
    if (logo.src === shown.current) return;
    shown.current = logo.src;
    if (active === 'a') {
      setB(logo);
      setActive('b');
    } else {
      setA(logo);
      setActive('a');
    }
  }, [logo, active]);

  return (
    <span className={styles.slot}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static brand marks, sized by CSS */}
      <img
        className={styles.layer}
        data-active={active === 'a'}
        src={a.src}
        alt={active === 'a' ? altOf(a) : ''}
        aria-hidden={active === 'a' ? undefined : true}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- static brand marks, sized by CSS */}
      <img
        className={styles.layer}
        data-active={active === 'b'}
        src={b.src}
        alt={active === 'b' ? altOf(b) : ''}
        aria-hidden={active === 'b' ? undefined : true}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </span>
  );
}
