'use client';

import { useRef, type CSSProperties, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/layout/Container';
import { Icon } from '@/components/ui/Icon';
import { buttonClasses } from '@/components/ui/Button';
import { Magnetic } from '@/lib/motion/Magnetic';
import { onPreloaderDone } from '@/lib/motion/preloader-signal';
import { clientLogos } from '@/lib/data/clientLogos';
import styles from './ClientsHero.module.css';

type ClientsHeroProps = {
  heading: string;
  statValue: number;
  statPrefix: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
};

/** The constellation core (SVG viewBox 0 0 500 560, stretched to the box). */
const CORE = { x: 250, y: 269 };

/**
 * Curated "stars" — real client logos placed around the core. Each carries the SVG
 * coordinates of its centre (vx/vy) so the connecting lines anchor exactly to it, and
 * the CSS position (%) of the same point. A spread across the roster, leading with the
 * recognisable marks.
 */
const STARS: { left: string; top: string; vx: number; vy: number; logo: number; delay: string }[] =
  [
    { left: '20%', top: '20%', vx: 100, vy: 112, logo: 1, delay: '0s' }, // Al Ahly SC
    { left: '45%', top: '12%', vx: 225, vy: 67, logo: 4, delay: '-1.5s' },
    { left: '74%', top: '20%', vx: 370, vy: 112, logo: 8, delay: '-3s' },
    { left: '86%', top: '45%', vx: 430, vy: 252, logo: 0, delay: '-0.7s' }, // Concrete
    { left: '74%', top: '72%', vx: 370, vy: 403, logo: 28, delay: '-2.2s' }, // Juhayna
    { left: '45%', top: '84%', vx: 225, vy: 470, logo: 29, delay: '-4s' }, // Mazzika
    { left: '16%', top: '60%', vx: 80, vy: 336, logo: 16, delay: '-1s' },
    { left: '23%', top: '80%', vx: 115, vy: 448, logo: 20, delay: '-3.2s' },
  ];

/** Extra star-to-star links, so the roster reads as a connected web, not just a fan. */
const WEB: [number, number][] = [
  [0, 1],
  [2, 3],
  [4, 5],
  [6, 7],
];

/** Hand-placed motes (deterministic — server and client render identically). */
const MOTES: { top: string; left: string; delay: string }[] = [
  { top: '30%', left: '62%', delay: '0s' },
  { top: '64%', left: '34%', delay: '-4s' },
  { top: '22%', left: '38%', delay: '-7s' },
  { top: '78%', left: '66%', delay: '-2s' },
];

function renderHeadingWords(heading: string): ReactNode[] {
  const tokens = heading.split(/(\s+)/).filter((t) => t.length > 0);
  let lastWord = -1;
  tokens.forEach((t, i) => {
    if (!/^\s+$/.test(t)) lastWord = i;
  });
  return tokens.map((token, i) =>
    /^\s+$/.test(token) ? (
      token
    ) : (
      <span
        key={i}
        data-word
        className={i === lastWord ? `${styles.word} ${styles.accent}` : styles.word}
      >
        {token}
      </span>
    ),
  );
}

/**
 * Clients page hero — "Constellation of Trust" (Doc 09 Page 4; content verbatim).
 *
 * Full-first-screen scene sized like AboutCinematicIntro. The right column is a
 * constellation of real client logos as glass stars, linked by pulsing light lines to a
 * central Buyue mark — the roster as a sky of trusted partners. Motion follows the shared
 * hero contract: preloader-gated entrance (with a +count-up on the trust stat), cursor
 * parallax of the whole field, a scrubbed scroll exit; idle loops are CSS on independent
 * channels. Reduced motion → still, legible scene.
 */
export function ClientsHero({
  heading,
  statValue,
  statPrefix,
  body,
  ctaLabel,
  ctaHref,
}: ClientsHeroProps) {
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useGSAP(
    () => {
      const el = root.current;
      if (reduce || !el) return;
      const q = gsap.utils.selector(el);

      const words = q<HTMLElement>('[data-word]');
      const stat = q('[data-stat]');
      const statNum = el.querySelector<HTMLElement>('[data-statnum]');
      const divider = q('[data-divider]');
      const bodyEl = q('[data-body]');
      const cta = q('[data-cta]');
      const bloom = q('[data-bloom]');
      const links = q('[data-links]');
      const core = q('[data-core]');
      const stars = q('[data-star]');
      const motes = q('[data-mote]');
      const content = q('[data-content]');
      const visual = q('[data-visual]');

      // ── Cursor parallax (fine pointers) — the whole field shifts as one unit.
      let frame = 0;
      let mvx = 0;
      let mvy = 0;
      const onMove = (event: PointerEvent) => {
        const r = el.getBoundingClientRect();
        mvx = ((event.clientX - r.left) / r.width - 0.5) * 2;
        mvy = ((event.clientY - r.top) / r.height - 0.5) * 2;
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          el.style.setProperty('--mx', mvx.toFixed(3));
          el.style.setProperty('--my', mvy.toFixed(3));
        });
      };
      const fine = window.matchMedia('(pointer: fine)').matches;
      if (fine) el.addEventListener('pointermove', onMove);

      // ── Hidden entrance states (CSS defaults are the SHOWN state → reduced motion /
      //    no-JS render everything visible).
      gsap.set(words, { autoAlpha: 0, yPercent: 60, filter: 'blur(8px)' });
      gsap.set(stat, { autoAlpha: 0, y: 18 });
      gsap.set(divider, { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(bodyEl, { autoAlpha: 0, y: 20 });
      gsap.set(cta, { autoAlpha: 0, y: 20 });
      gsap.set(bloom, { autoAlpha: 0, scale: 0.7 });
      gsap.set(links, { autoAlpha: 0 });
      gsap.set(core, { autoAlpha: 0, scale: 0.6 });
      gsap.set(stars, { autoAlpha: 0, scale: 0.5 });
      gsap.set(motes, { autoAlpha: 0 });
      if (statNum) statNum.textContent = '0';

      // ── Entrance (paused; plays on the preloader hand-off). The core lights, the
      //    links draw in, the client stars pop on, then the copy sets over it.
      const counter = { v: 0 };
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
      tl.to(bloom, { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'expo.out' }, 0)
        .to(core, { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'back.out(1.6)' }, 0.1)
        .to(links, { autoAlpha: 1, duration: 0.7 }, 0.4)
        .to(
          stars,
          { autoAlpha: 1, scale: 1, duration: 0.7, stagger: 0.07, ease: 'back.out(1.5)' },
          0.5,
        )
        .to(motes, { autoAlpha: 1, duration: 0.8, stagger: 0.06 }, 1)
        .to(
          words,
          {
            autoAlpha: 1,
            yPercent: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            stagger: 0.08,
            ease: 'expo.out',
            onComplete: () => words.forEach((w) => (w.style.willChange = 'auto')),
          },
          0.35,
        )
        .to(stat, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.6)
        .to(
          counter,
          {
            v: statValue,
            duration: 1.1,
            ease: 'power2.out',
            onUpdate: () => {
              if (statNum) statNum.textContent = String(Math.round(counter.v));
            },
          },
          0.65,
        )
        .to(divider, { scaleX: 1, duration: 0.6 }, 0.8)
        .to(bodyEl, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.9)
        .to(cta, { autoAlpha: 1, y: 0, duration: 0.6 }, 1.1);

      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        tl.play();
      };
      const off = onPreloaderDone(play);
      const safety = window.setTimeout(play, 1400);

      // ── Scrubbed scroll exit (desktop) — the scene drifts up and fades as the reader
      //    moves into the logo wall below.
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px)', () => {
        gsap.to(visual, {
          yPercent: -10,
          autoAlpha: 0.4,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.6 },
        });
        gsap.to(content, {
          yPercent: -6,
          autoAlpha: 0.55,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.6 },
        });
      });

      const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 700);

      return () => {
        off();
        window.clearTimeout(safety);
        window.clearTimeout(refresh);
        if (fine) el.removeEventListener('pointermove', onMove);
        if (frame) cancelAnimationFrame(frame);
        mm.revert();
      };
    },
    { scope: root, dependencies: [reduce] },
  );

  const line = (ax: number, ay: number, bx: number, by: number) => `M${ax} ${ay} L${bx} ${by}`;

  return (
    <section ref={root} className={styles.scene}>
      <Container size="wide" className={styles.container}>
        <div className={styles.grid}>
          {/* Left — content */}
          <div className={styles.copy} data-content>
            <h1 className={styles.title}>{renderHeadingWords(heading)}</h1>
            <div className={styles.stat} data-stat>
              <span className={styles.statPrefix}>{statPrefix}</span>
              <span className={styles.statValue} data-statnum>
                {statValue}
              </span>
            </div>
            <div className={styles.divider} data-divider aria-hidden="true" />
            <p className={styles.body} data-body>
              {body}
            </p>
            <div className={styles.cta} data-cta>
              <Magnetic>
                <Link href={ctaHref} className={buttonClasses('primary', 'lg')}>
                  {ctaLabel}
                  <Icon name="arrow-right" size={20} flipRtl />
                </Link>
              </Magnetic>
            </div>
          </div>

          {/* Right — Constellation of Trust */}
          <div className={styles.visual} data-visual aria-hidden="true">
            <span className={styles.bloom} data-bloom />

            <div className={styles.field}>
              <svg
                className={styles.links}
                data-links
                viewBox="0 0 500 560"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Brand warm gradient — literal hex; CSS vars don't resolve in SVG. */}
                  <linearGradient id="ch-linegrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#eac46b" />
                    <stop offset="1" stopColor="#cf5138" />
                  </linearGradient>
                </defs>
                {/* Faint base web: core → each star, plus a few star → star links. */}
                {STARS.map((s, i) => (
                  <path
                    key={`b${i}`}
                    className={styles.lineBase}
                    d={line(CORE.x, CORE.y, s.vx, s.vy)}
                  />
                ))}
                {WEB.map(([a, b], i) => (
                  <path
                    key={`w${i}`}
                    className={styles.lineBase}
                    d={line(STARS[a]!.vx, STARS[a]!.vy, STARS[b]!.vx, STARS[b]!.vy)}
                  />
                ))}
                {/* Light travelling out from the core to each star. */}
                {STARS.map((s, i) => (
                  <path
                    key={`p${i}`}
                    className={styles.linePulse}
                    style={{ '--delay': `${(-i * 0.45).toFixed(2)}s` } as CSSProperties}
                    d={line(CORE.x, CORE.y, s.vx, s.vy)}
                  />
                ))}
              </svg>

              <div className={styles.core} data-core>
                {/* eslint-disable-next-line @next/next/no-img-element -- static brand mark, sized by CSS */}
                <img
                  className={styles.coreImg}
                  src="/brand/buyue-mark-trim.png"
                  alt=""
                  draggable={false}
                />
              </div>

              {STARS.map((s, i) => {
                const logo = clientLogos[s.logo] ?? clientLogos[0]!;
                return (
                  <span
                    key={i}
                    data-star
                    className={styles.star}
                    style={
                      {
                        insetInlineStart: s.left,
                        insetBlockStart: s.top,
                        '--delay': s.delay,
                      } as CSSProperties
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- static client logo, sized by CSS */}
                    <img
                      className={styles.starImg}
                      src={logo.src}
                      alt=""
                      loading="lazy"
                      draggable={false}
                    />
                  </span>
                );
              })}

              {MOTES.map((m, i) => (
                <span
                  key={i}
                  data-mote
                  className={styles.mote}
                  style={
                    {
                      insetBlockStart: m.top,
                      insetInlineStart: m.left,
                      '--delay': m.delay,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
