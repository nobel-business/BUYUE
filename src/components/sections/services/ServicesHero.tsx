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

/** Refracted spectrum bands — fixed fan angles + brand warm colours, dense → sparse. */
const BANDS: { r: string; c: string; o: number; delay: string }[] = [
  { r: '6deg', c: 'var(--color-bonfire-flame)', o: 0.72, delay: '0s' },
  { r: '13deg', c: 'var(--color-soft-orange)', o: 0.7, delay: '-1.1s' },
  { r: '20deg', c: '#ffb066', o: 0.66, delay: '-2.3s' },
  { r: '28deg', c: 'var(--color-quilt-gold)', o: 0.6, delay: '-3.4s' },
  { r: '36deg', c: '#d8d19a', o: 0.5, delay: '-4.6s' },
  { r: '44deg', c: 'var(--color-lime-taffy)', o: 0.4, delay: '-5.5s' },
];

/** Hand-placed light motes (deterministic — server and client render identically). */
const MOTES: { top: string; left: string; size: number; delay: string }[] = [
  { top: '40%', left: '58%', size: 4, delay: '0s' },
  { top: '62%', left: '70%', size: 3, delay: '-3s' },
  { top: '30%', left: '46%', size: 2, delay: '-6s' },
  { top: '72%', left: '54%', size: 3, delay: '-8s' },
  { top: '50%', left: '78%', size: 2, delay: '-2s' },
];

/**
 * Render the heading as word spans (whitespace-only split → Arabic/RTL safe). The last
 * word carries the accent gradient, matching the About hero's title treatment. Rendered
 * in the JSX itself so React owns the DOM and GSAP animates the words with no mutation.
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
 * Services page hero — "The Refractor" (Doc 09 Page 3 intro; content verbatim).
 *
 * Full-first-screen scene sized like AboutCinematicIntro; the right column is a glass
 * crystal refracting one beam into a warm brand spectrum — the visual metaphor for
 * integrated, creative services. Motion follows the shared hero contract: GSAP entrance
 * gated on the preloader hand-off, cursor parallax, a scrubbed scroll exit; idle loops
 * are CSS on nested elements. Reduced motion → still, legible scene.
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
      const bloom = q('[data-bloom]');
      const crystal = q('[data-crystal]');
      const beam = q('[data-beam]');
      const bandInners = q('[data-band] > i');
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

      // ── Hidden entrance states (CSS defaults are the SHOWN state, so reduced motion
      //    and no-JS both render everything visible).
      gsap.set(words, { autoAlpha: 0, yPercent: 60, filter: 'blur(8px)' });
      gsap.set(divider, { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(paras, { autoAlpha: 0, y: 20 });
      gsap.set(cta, { autoAlpha: 0, y: 20 });
      gsap.set(rail, { autoAlpha: 0 });
      gsap.set(bloom, { autoAlpha: 0, scale: 0.7 });
      gsap.set(crystal, { autoAlpha: 0, scale: 0.82, filter: 'blur(10px)' });
      gsap.set(beam, { autoAlpha: 0, scaleX: 0, transformOrigin: 'right center' });
      gsap.set(bandInners, { scaleX: 0 });
      gsap.set(motes, { autoAlpha: 0 });

      // ── Entrance (paused; plays on the preloader hand-off, like About/Home).
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
      // Visual arrives first: bloom + crystal, then the beam strikes and refracts.
      tl.to(bloom, { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'expo.out' }, 0)
        .to(
          crystal,
          { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1.1, ease: 'expo.out' },
          0.15,
        )
        .to(beam, { autoAlpha: 1, scaleX: 1, duration: 0.7 }, 0.5)
        .to(bandInners, { scaleX: 1, duration: 0.9, stagger: 0.08, ease: 'expo.out' }, 0.6)
        .to(motes, { autoAlpha: 1, duration: 0.8, stagger: 0.06 }, 0.95)
        // Text sets over it: heading words, divider, paragraphs, CTA, rail.
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
        .to(divider, { scaleX: 1, duration: 0.6 }, 0.7)
        .to(paras, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.12 }, 0.75)
        .to(cta, { autoAlpha: 1, y: 0, duration: 0.6 }, 1)
        .to(rail, { autoAlpha: 1, duration: 0.6 }, 0.5);

      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        tl.play();
      };
      // The split happens under the preloader cover, so the text swap is never seen; the
      // safety timer guarantees the hero can never be left hidden if the signal is missed.
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

      // Reconcile with the page-transition wrapper once its blur/lift has settled.
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
              <span>01</span>
              <span className={styles.railLine}>
                <span className={styles.railFill} />
              </span>
              <span className={styles.railDot} />
              <span>10</span>
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

          {/* Right — The Refractor */}
          <div className={styles.visual} data-visual aria-hidden="true">
            <div className={styles.stage}>
              <div className={styles.bloom} data-bloom>
                <span className={styles.bloomCore} />
              </div>

              <div className={styles.spectrum}>
                {BANDS.map((band, index) => (
                  <div
                    key={index}
                    data-band
                    className={styles.band}
                    style={{ '--r': band.r } as CSSProperties}
                  >
                    <i
                      style={
                        { '--c': band.c, '--o': band.o, '--delay': band.delay } as CSSProperties
                      }
                    />
                  </div>
                ))}
              </div>

              <div className={styles.beam} data-beam />

              <div className={styles.crystal} data-crystal>
                <div className={styles.crystalSpin}>
                  <span className={`${styles.clip} ${styles.edge}`} />
                  <span className={`${styles.clip} ${styles.glass}`} />
                  <span className={`${styles.clip} ${styles.facet}`} />
                  <span className={styles.spark} />
                </div>
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
                      inlineSize: `${mote.size}px`,
                      blockSize: `${mote.size}px`,
                      '--delay': mote.delay,
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
