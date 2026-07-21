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
import styles from './ServicesHero.module.css';

type ServicesHeroProps = {
  heading: string;
  paragraphs: string[];
  ctaLabel: string;
  ctaHref: string;
};

/** Curve the content path travels along (SVG viewBox 0 0 500 560, stretched to the box). */
const PATH_D = 'M120 250 C 210 340, 220 300, 300 380 S 360 430, 350 440';

/** Content chips streaming along the path — position (% of the visual), size, tint,
 *  drift phase, and a recognisable service icon. A richer cluster of "content in
 *  transit" from the phone toward the stand. */
const CHIPS: {
  top: string;
  left: string;
  size: string;
  color: string;
  delay: string;
  icon: ReactNode;
}[] = [
  {
    top: '38%',
    left: '31%',
    size: '2.5rem',
    color: 'var(--color-quilt-gold)',
    delay: '-1s',
    icon: <path d="M8 5v14l11-7z" fill="currentColor" />,
  },
  {
    top: '29%',
    left: '46%',
    size: '2.1rem',
    color: 'var(--color-quilt-gold)',
    delay: '-2.4s',
    icon: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <circle cx="12" cy="13.5" r="3.2" />
        <path d="M8.5 7l1.2-2h4.6l1.2 2" />
      </>
    ),
  },
  {
    top: '50%',
    left: '42%',
    size: '2.3rem',
    color: 'var(--color-soft-orange)',
    delay: '-3.2s',
    icon: (
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    ),
  },
  {
    top: '61%',
    left: '23%',
    size: '2rem',
    color: 'var(--color-lime-taffy)',
    delay: '-4.5s',
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4-4" />
      </>
    ),
  },
  {
    top: '57%',
    left: '54%',
    size: '2.2rem',
    color: 'var(--color-soft-orange)',
    delay: '-1.8s',
    icon: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9" r="1.6" />
        <path d="M4 16l5-4 4 3 3-2 4 3" />
      </>
    ),
  },
  {
    top: '71%',
    left: '36%',
    size: '1.9rem',
    color: 'var(--color-lime-taffy)',
    delay: '-5.5s',
    icon: (
      <>
        <path d="M4 10v4h3l6 4V6L7 10H4z" />
        <path d="M16 9a3 3 0 010 6" />
      </>
    ),
  },
];

/** Hand-placed motes (deterministic — server and client render identically). */
const MOTES: { top: string; left: string; delay: string }[] = [
  { top: '24%', left: '62%', delay: '0s' },
  { top: '68%', left: '50%', delay: '-4s' },
  { top: '14%', left: '40%', delay: '-7s' },
  { top: '82%', left: '74%', delay: '-2s' },
];

/**
 * Render the heading as word spans (whitespace-only split → Arabic/RTL safe); the last
 * word carries the accent gradient. Rendered in the JSX so React owns the DOM and GSAP
 * animates the words with no mutation.
 */
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
 * Services page hero — "Digital to Real" (Doc 09 Page 3 intro; content verbatim).
 *
 * Full-first-screen scene sized like AboutCinematicIntro. The right column stages the
 * Services story from the copy: a phone (first digital appearance on social media) emits
 * content that streams along a light path and assembles into a lit exhibition stand (a
 * real-world presence). Motion follows the shared hero contract — preloader-gated
 * entrance, cursor parallax, a scrubbed scroll exit; idle loops are CSS on nested /
 * independent channels. Reduced motion → still, legible scene.
 */
export function ServicesHero({ heading, paragraphs, ctaLabel, ctaHref }: ServicesHeroProps) {
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useGSAP(
    () => {
      const el = root.current;
      if (reduce || !el) return;
      const q = gsap.utils.selector(el);

      const words = q<HTMLElement>('[data-word]');
      const divider = q('[data-divider]');
      const paras = q('[data-para]');
      const cta = q('[data-cta]');
      const rail = q('[data-rail]');
      const content = q('[data-content]');
      const visual = q('[data-visual]');
      const glows = q('[data-glow]');
      const phone = q('[data-phone]');
      const path = q('[data-path]');
      const chips = q('[data-chip]');
      const standParts = q('[data-standpart]');
      const sign = q('[data-sign]');
      const motes = q('[data-mote]');

      // ── Cursor parallax (fine pointers) — layers shift via the CSS `translate` prop.
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

      // ── Hidden entrance states (CSS defaults are the SHOWN state, so reduced-motion
      //    and no-JS both render everything visible).
      gsap.set(words, { autoAlpha: 0, yPercent: 60, filter: 'blur(8px)' });
      gsap.set(divider, { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(paras, { autoAlpha: 0, y: 20 });
      gsap.set(cta, { autoAlpha: 0, y: 20 });
      gsap.set(rail, { autoAlpha: 0 });
      gsap.set(glows, { autoAlpha: 0 });
      gsap.set(phone, { autoAlpha: 0, scale: 0.9, y: 12 });
      gsap.set(path, { autoAlpha: 0 });
      gsap.set(chips, { autoAlpha: 0 });
      gsap.set(standParts, { autoAlpha: 0, y: 26 });
      gsap.set(sign, { autoAlpha: 0, scaleY: 0.4, transformOrigin: 'center bottom' });
      gsap.set(motes, { autoAlpha: 0 });

      // ── Entrance (paused; plays on the preloader hand-off). The story: the phone
      //    lights up → content streams down the path → the stand builds and its sign
      //    ignites; the text sets over it.
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
      tl.to(glows, { autoAlpha: 1, duration: 1, stagger: 0.1 }, 0)
        .to(phone, { autoAlpha: 1, scale: 1, y: 0, duration: 1, ease: 'expo.out' }, 0.1)
        .to(path, { autoAlpha: 1, duration: 0.6 }, 0.55)
        .to(chips, { autoAlpha: 1, duration: 0.5, stagger: 0.14 }, 0.65)
        .to(standParts, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'expo.out' }, 0.9)
        .to(sign, { autoAlpha: 1, scaleY: 1, duration: 0.6, ease: 'back.out(1.6)' }, 1.25)
        .to(motes, { autoAlpha: 1, duration: 0.8, stagger: 0.06 }, 1)
        // Text sets over the scene.
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
          0.4,
        )
        .to(divider, { scaleX: 1, duration: 0.6 }, 0.75)
        .to(paras, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.12 }, 0.8)
        .to(cta, { autoAlpha: 1, y: 0, duration: 0.6 }, 1.15)
        .to(rail, { autoAlpha: 1, duration: 0.6 }, 0.5);

      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        tl.play();
      };
      const off = onPreloaderDone(play);
      const safety = window.setTimeout(play, 1400);

      // ── Scrubbed scroll exit (desktop) — the scene drifts up and fades as the reader
      //    moves into the stacked-services story below.
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
          <div className={styles.content} data-content>
            <div className={styles.rail} data-rail aria-hidden="true">
              <span className={styles.railLine}>
                <span className={styles.railFill} />
              </span>
              <span className={styles.railDot} />
            </div>

            <div className={styles.copy}>
              <h1 className={styles.title}>{renderHeadingWords(heading)}</h1>
              <div className={styles.divider} data-divider aria-hidden="true" />
              {paragraphs.map((paragraph, index) => (
                <p key={index} data-para className={index === 0 ? styles.lead : styles.sub}>
                  {paragraph}
                </p>
              ))}
              <div className={styles.cta} data-cta>
                <Magnetic>
                  <Link href={ctaHref} className={buttonClasses('primary', 'lg')}>
                    {ctaLabel}
                    <Icon name="arrow-right" size={20} flipRtl />
                  </Link>
                </Magnetic>
              </div>
            </div>
          </div>

          {/* Right — Digital to Real */}
          <div className={styles.visual} data-visual aria-hidden="true">
            <span className={`${styles.glow} ${styles.glowA}`} data-glow />
            <span className={`${styles.glow} ${styles.glowB}`} data-glow />

            {/* connecting light path */}
            <svg className={styles.path} data-path viewBox="0 0 500 560" preserveAspectRatio="none">
              <defs>
                {/* Brand warm gradient — literal hex; CSS vars don't resolve in SVG
                    stop-color attributes. Mirrors --color-soft-orange / -quilt-gold /
                    -bonfire-flame. */}
                <linearGradient id="sh-pathgrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#ff7a45" />
                  <stop offset="0.5" stopColor="#eac46b" />
                  <stop offset="1" stopColor="#cf5138" />
                </linearGradient>
              </defs>
              <path className={styles.pathTrack} d={PATH_D} />
              <path className={styles.pathFlow} d={PATH_D} />
            </svg>

            {/* content in transit */}
            {CHIPS.map((chip, index) => (
              <span
                key={index}
                data-chip
                className={styles.chip}
                style={
                  {
                    insetBlockStart: chip.top,
                    insetInlineStart: chip.left,
                    inlineSize: chip.size,
                    blockSize: chip.size,
                    color: chip.color,
                    '--delay': chip.delay,
                  } as CSSProperties
                }
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  {chip.icon}
                </svg>
              </span>
            ))}

            {/* digital origin — the phone */}
            <div className={styles.phone} data-phone>
              <div className={styles.phoneStage}>
                <div className={styles.phoneBody} />
                <div className={styles.screen}>
                  <div className={styles.sRow}>
                    <span className={styles.sAvatar} />
                    <span className={styles.sLines}>
                      <i />
                      <i />
                    </span>
                  </div>
                  <div className={styles.sMedia}>
                    <span className={styles.sPlay} />
                  </div>
                  <div className={styles.sActions}>
                    <svg className={styles.heart} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M21 12a8 8 0 01-11.5 7.2L4 20l1-4.5A8 8 0 1121 12z" />
                    </svg>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="18" cy="5" r="2.5" />
                      <circle cx="6" cy="12" r="2.5" />
                      <circle cx="18" cy="19" r="2.5" />
                      <path d="M8 11l8-4M8 13l8 4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* real-world presence — the exhibition stand */}
            <div className={styles.stand} data-stand>
              <span className={styles.floor} data-standpart />
              <span className={styles.side} data-standpart />
              <div className={styles.wall} data-standpart>
                {/* eslint-disable-next-line @next/next/no-img-element -- static brand mark, sized by CSS */}
                <img
                  className={styles.wallLogo}
                  src="/brand/buyue-mark-trim.png"
                  alt=""
                  draggable={false}
                />
              </div>
              <div className={styles.sign} data-sign>
                Buyue
              </div>
              <div className={styles.counter} data-standpart />
            </div>

            {MOTES.map((mote, index) => (
              <span
                key={index}
                data-mote
                className={styles.mote}
                style={
                  {
                    insetBlockStart: mote.top,
                    insetInlineStart: mote.left,
                    '--delay': mote.delay,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
