'use client';

import { useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/motion/gsap';
import { clientLogos, type ClientLogo } from '@/lib/clientLogos';
import styles from './ClientLogoMarquee.module.css';

/**
 * Premium client-logo showcase (Landor / Stripe / Linear language). Two seamless
 * infinite marquee rows moving in opposite directions at different speeds; each
 * pauses on hover and can be dragged (with a soft spring-back "peek"). Logos are
 * grayscale at rest → full colour on hover, on light tiles so every real brand
 * logo stays legible regardless of its own colours or the page theme.
 *
 * Seamless loop: the track holds two copies of the row; xPercent animates exactly
 * one copy width (-50% ↔ 0), so the wrap point is invisible. Auto-scroll (GSAP
 * xPercent) and drag (a separate wrapper's x) own different elements → no clash.
 *
 * Reduced motion → a calm static wrapped grid (no motion, fully legible).
 */
export function ClientLogoMarquee() {
  const shouldReduce = useReducedMotion();
  const half = Math.ceil(clientLogos.length / 2);
  const rowA = clientLogos.slice(0, half);
  const rowB = clientLogos.slice(half);

  if (shouldReduce) {
    return (
      <div className={styles.wrap}>
        <span className={styles.wash} aria-hidden="true" />
        <ul className={styles.staticGrid}>
          {clientLogos.map((logo, i) => (
            <li key={i}>
              <LogoCard logo={logo} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <span className={styles.wash} aria-hidden="true" />
      <div className={styles.rows}>
        <MarqueeRow logos={rowA} duration={46} />
        <MarqueeRow logos={rowB} duration={58} reverse />
      </div>
    </div>
  );
}

function MarqueeRow({
  logos,
  duration,
  reverse = false,
}: {
  logos: ClientLogo[];
  duration: number;
  reverse?: boolean;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const drag = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const dragging = useRef(false);
  const startX = useRef(0);

  useGSAP(
    () => {
      if (!track.current) return;
      const from = reverse ? 0 : -50;
      const to = reverse ? -50 : 0;
      gsap.set(track.current, { xPercent: from });
      tween.current = gsap.to(track.current, { xPercent: to, duration, ease: 'none', repeat: -1 });

      // Entrance: fade the row up as it scrolls into view (reveal sequence).
      gsap.from(viewport.current, {
        autoAlpha: 0,
        y: 24,
        duration: 0.6,
        ease: 'expo.out',
        scrollTrigger: { trigger: viewport.current, start: 'top 92%', once: true },
      });
    },
    { scope: viewport },
  );

  const setSpeed = (value: number) =>
    tween.current && gsap.to(tween.current, { timeScale: value, duration: 0.4, overwrite: true });

  const onEnter = () => !dragging.current && setSpeed(0);
  const onLeave = () => !dragging.current && setSpeed(1);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    startX.current = event.clientX;
    setSpeed(0);
    viewport.current?.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current || !drag.current) return;
    const dx = gsap.utils.clamp(-220, 220, event.clientX - startX.current);
    gsap.set(drag.current, { x: dx });
  };
  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    viewport.current?.releasePointerCapture(event.pointerId);
    gsap.to(drag.current, { x: 0, duration: 0.8, ease: 'power3.out' });
    setSpeed(1);
  };

  return (
    <div
      ref={viewport}
      className={styles.viewport}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div ref={drag} className={styles.drag}>
        <div ref={track} className={styles.track}>
          {[...logos, ...logos].map((logo, i) => (
            <LogoCard key={i} logo={logo} ariaHidden={i >= logos.length} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LogoCard({ logo, ariaHidden = false }: { logo: ClientLogo; ariaHidden?: boolean }) {
  return (
    <div className={styles.card}>
      <span className={styles.sweep} aria-hidden="true" />
      {/* eslint-disable-next-line @next/next/no-img-element -- static /public logo, sized by CSS */}
      <img
        className={styles.logo}
        src={logo.src}
        alt={ariaHidden ? '' : logo.alt}
        aria-hidden={ariaHidden || undefined}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}
