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

/**
 * Interlacing threads (SVG viewBox 0 0 500 560, stretched to the box). Each is a
 * relationship woven through the others into one luminous fabric; `grad` alternates the
 * warm gradient direction so crossings read as over/under, and `delay` desynchronises
 * the travelling light.
 */
const THREADS: { d: string; grad: 1 | 2; width: number; opacity: number; delay: string }[] = [
  { d: 'M -30 150 C 140 60, 360 300, 540 210', grad: 1, width: 10, opacity: 0.72, delay: '0s' },
  { d: 'M -30 300 C 150 400, 350 120, 540 300', grad: 2, width: 8, opacity: 0.62, delay: '-1s' },
  { d: 'M -30 230 C 170 300, 330 230, 540 270', grad: 1, width: 12, opacity: 0.55, delay: '-2s' },
  { d: 'M 90 -30 C 210 200, 300 360, 250 590', grad: 2, width: 7, opacity: 0.6, delay: '-1.5s' },
  { d: 'M 380 -30 C 250 200, 210 360, 300 590', grad: 1, width: 9, opacity: 0.5, delay: '-3s' },
  { d: 'M -30 420 C 180 360, 340 470, 540 400', grad: 2, width: 8, opacity: 0.46, delay: '-2.5s' },
];

/** Real client logos seated at the knots of the weave (where relationships hold). */
const KNOTS: { left: string; top: string; logo: number; delay: string }[] = [
  { left: '30%', top: '26%', logo: 1, delay: '0s' }, // Al Ahly SC
  { left: '66%', top: '32%', logo: 4, delay: '-1.5s' },
  { left: '24%', top: '58%', logo: 8, delay: '-3s' },
  { left: '74%', top: '62%', logo: 0, delay: '-0.8s' }, // Concrete
  { left: '50%', top: '46%', logo: 28, delay: '-2.2s' }, // Juhayna
  { left: '62%', top: '73%', logo: 16, delay: '-1.2s' },
  { left: '44%', top: '82%', logo: 29, delay: '-4s' }, // Mazzika
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
 * Clients page hero — "The Weave" (Doc 09 Page 4; content verbatim).
 *
 * Full-first-screen scene sized like AboutCinematicIntro. The right column weaves the
 * client relationships as interlacing threads of light, with the real client logos
 * seated at the knots — a single thread is fragile, woven together they hold. Motion
 * follows the shared hero contract: preloader-gated entrance (with a +count-up on the
 * trust stat), cursor parallax of the whole fabric, a scrubbed scroll exit; idle loops
 * are CSS on independent channels. Reduced motion → still, legible scene.
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
      const threads = q('[data-threads]');
      const knots = q('[data-knot]');
      const motes = q('[data-mote]');
      const content = q('[data-content]');
      const visual = q('[data-visual]');

      // ── Cursor parallax (fine pointers) — the whole fabric shifts as one unit.
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
      gsap.set(threads, { autoAlpha: 0 });
      gsap.set(knots, { autoAlpha: 0, scale: 0.5 });
      gsap.set(motes, { autoAlpha: 0 });
      if (statNum) statNum.textContent = '0';

      // ── Entrance (paused; plays on the preloader hand-off). The bloom lights, the
      //    weave threads fade in, the logo knots pop on, then the copy sets over it.
      const counter = { v: 0 };
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
      tl.to(bloom, { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'expo.out' }, 0)
        .to(threads, { autoAlpha: 1, duration: 1, ease: 'power2.out' }, 0.2)
        .to(
          knots,
          { autoAlpha: 1, scale: 1, duration: 0.7, stagger: 0.08, ease: 'back.out(1.5)' },
          0.55,
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

          {/* Right — The Weave */}
          <div className={styles.visual} data-visual aria-hidden="true">
            <span className={styles.bloom} data-bloom />

            <div className={styles.field}>
              <svg
                className={styles.threads}
                data-threads
                viewBox="0 0 500 560"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Brand warm gradients — literal hex; CSS vars don't resolve in SVG. */}
                  <linearGradient id="ch-g1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#cf5138" />
                    <stop offset="0.5" stopColor="#ff7a45" />
                    <stop offset="1" stopColor="#eac46b" />
                  </linearGradient>
                  <linearGradient id="ch-g2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#eac46b" />
                    <stop offset="0.5" stopColor="#ff7a45" />
                    <stop offset="1" stopColor="#cf5138" />
                  </linearGradient>
                </defs>
                {THREADS.map((t, i) => (
                  <path
                    key={i}
                    className={styles.thread}
                    d={t.d}
                    style={
                      {
                        stroke: t.grad === 1 ? "url('#ch-g1')" : "url('#ch-g2')",
                        strokeWidth: t.width,
                        opacity: t.opacity,
                        '--delay': t.delay,
                      } as CSSProperties
                    }
                  />
                ))}
              </svg>

              {KNOTS.map((k, i) => {
                const logo = clientLogos[k.logo] ?? clientLogos[0]!;
                return (
                  <span
                    key={i}
                    data-knot
                    className={styles.star}
                    style={
                      {
                        insetInlineStart: k.left,
                        insetBlockStart: k.top,
                        '--delay': k.delay,
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
