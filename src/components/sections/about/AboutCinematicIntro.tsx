'use client';

import { useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { onPreloaderDone } from '@/lib/motion/preloader-signal';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils/cn';
import styles from './AboutCinematicIntro.module.css';

type AboutCinematicIntroProps = {
  heading: string;
  paragraphs: string[];
};

const PARTICLE_COUNT = 14;

/** Split an element's text into inline-block word spans (idempotent). Word-level,
 *  never character-level: Arabic is cursive and character splitting would break the
 *  connected letterforms. Whitespace nodes are preserved so wrapping is unchanged. */
function splitWords(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split === 'true') {
    return Array.from(el.querySelectorAll<HTMLElement>('[data-w]'));
  }
  const tokens = (el.textContent ?? '').split(/(\s+)/);
  el.textContent = '';
  const out: HTMLElement[] = [];
  for (const token of tokens) {
    if (token.length === 0) continue;
    if (/^\s+$/.test(token)) {
      el.appendChild(document.createTextNode(token));
      continue;
    }
    const span = document.createElement('span');
    span.dataset.w = '';
    span.textContent = token;
    span.style.display = 'inline-block';
    span.style.willChange = 'transform, opacity, filter';
    el.appendChild(span);
    out.push(span);
  }
  el.dataset.split = 'true';
  return out;
}

/**
 * About hero — a cinematic dark 3D scene (all copy verbatim; the eyebrow, scroll
 * label, stats and tagline are additive bilingual strings). A layered environment
 * (dark gradient → two orange ambients → vignette → noise → particles → light
 * streaks) sits behind a two-column composition: the text on the reading edge and,
 * on the other side, a glowing "planet" with a floating smoked-glass Buyue panel and
 * a glass stats card. A left rail marks the section.
 *
 * Conflict-free channels: GSAP owns entrance + scroll-camera `transform`; mouse
 * parallax writes the independent CSS `translate` property; every forever-loop is a
 * CSS animation on a NESTED element so it never shares a transform with GSAP. Title
 * entrance plays on the preloader hand-off; paragraphs reveal word by word. Desktop
 * drives the scroll camera; mobile & reduced motion render a calm static scene.
 */
export function AboutCinematicIntro({ heading, paragraphs }: AboutCinematicIntroProps) {
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Heading: colour the last word (e.g. "Us") in the accent, keeping the exact text.
  const headingWords = heading.trim().split(/\s+/);
  const accent = headingWords.length > 1 ? headingWords[headingWords.length - 1] : heading;
  const lead = headingWords.length > 1 ? headingWords.slice(0, -1).join(' ') : '';

  useGSAP(
    () => {
      const el = root.current;
      if (reduce || !el) return;

      // ── Mouse parallax: one listener sets --mx/--my (−1…1); layers offset by their
      //    own depth via the CSS `translate` property (composes with all transforms).
      let frame = 0;
      let px = 0;
      let py = 0;
      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        px = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        py = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          el.style.setProperty('--mx', px.toFixed(3));
          el.style.setProperty('--my', py.toFixed(3));
        });
      };
      const onCursor = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--cx', `${event.clientX - rect.left}px`);
        el.style.setProperty('--cy', `${event.clientY - rect.top}px`);
      };
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointermove', onCursor);

      // ── Entrance timeline (one-shot, on preloader hand-off).
      const title = el.querySelector<HTMLElement>('[data-title]');
      const paraEls = gsap.utils.toArray<HTMLElement>('[data-para]', el);
      const paraWords = paraEls.flatMap((p) => splitWords(p));

      gsap.set('[data-hero-fade]', { autoAlpha: 0, y: 20 });
      gsap.set('[data-divider]', { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('[data-visual]', { autoAlpha: 0, y: 40, scale: 0.94 });
      // Cards reveal via opacity only (their transform belongs to the CSS float loop).
      gsap.set('[data-card-float]', { autoAlpha: 0 });
      gsap.set(paraWords, { autoAlpha: 0, yPercent: 40, filter: 'blur(6px)' });
      if (title) {
        gsap.set(title, {
          autoAlpha: 0,
          filter: 'blur(30px)',
          scale: 0.9,
          rotateX: 15,
          y: 44,
          transformPerspective: 900,
          transformOrigin: 'center bottom',
        });
      }

      const entrance = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
      if (title) {
        entrance.to(
          title,
          {
            autoAlpha: 1,
            filter: 'blur(0px)',
            scale: 1,
            rotateX: 0,
            y: 0,
            duration: 1.4,
            ease: 'power4.out',
          },
          0.1,
        );
      }
      entrance
        .to('[data-divider]', { scaleX: 1, duration: 0.8, ease: 'power3.inOut' }, 0.5)
        .to(
          paraWords,
          { autoAlpha: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.012 },
          0.6,
        )
        .to('[data-visual]', { autoAlpha: 1, y: 0, scale: 1, duration: 1.1 }, 0.35)
        .to('[data-card-float]', { autoAlpha: 1, duration: 0.5, stagger: 0.06 }, 0.6)
        .to('[data-rail]', { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.4');

      // Play on the preloader hand-off — but never depend on it: a safety timer plays
      // the entrance regardless, so the hero can never be left frozen/hidden.
      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        entrance.play();
      };
      const offPreloader = onPreloaderDone(play);
      const fallback = window.setTimeout(play, 1400);

      // ── Scroll camera (desktop): background slower, glass faster, planet slower,
      //    particles drift up — the "moving through space" feel as the hero exits.
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        tl.to('[data-bg]', { yPercent: 8, ease: 'none' }, 0);
        tl.to('[data-stage-inner]', { yPercent: -12, ease: 'none' }, 0);
        tl.to('[data-particles]', { yPercent: -30, ease: 'none' }, 0);
        tl.to('[data-content]', { yPercent: -10, autoAlpha: 0.6, ease: 'none' }, 0);
        tl.fromTo('[data-rail-fill]', { scaleY: 0 }, { scaleY: 1, ease: 'none' }, 0);
      });

      // The page-transition wrapper (template.tsx) is still animating `y`/`filter`
      // when these triggers are built, so start/end get measured against a moving
      // ancestor. Reconcile once it has settled — same fix as ValuesScene.
      const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 700);

      return () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointermove', onCursor);
        if (frame) cancelAnimationFrame(frame);
        window.clearTimeout(fallback);
        window.clearTimeout(refresh);
        offPreloader();
        mm.revert();
      };
    },
    { scope: root, dependencies: [reduce] },
  );

  return (
    <section ref={root} className={styles.scene}>
      {/* ── Background layers ─────────────────────────────────────────────── */}
      <div className={styles.bg} data-bg aria-hidden="true">
        <span className={styles.gradient} />
        <span className={styles.brown} />
        <span className={styles.bloom} />
        <span className={styles.rays} />
        <span className={styles.ambientTop} data-depth="10" />
        <span className={styles.ambientBottom} data-depth="8" />
        <div className={styles.stars}>
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className={styles.star} />
          ))}
        </div>
        <span className={styles.streak} />
        <span className={styles.streak2} />
        <div className={styles.particles} data-particles data-depth="6">
          {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
            <span key={i} className={styles.particle} />
          ))}
        </div>
        <span className={styles.noise} />
        <span className={styles.vignette} />
        <span className={styles.cursorGlow} aria-hidden="true" />
      </div>

      {/* ── Left section rail — a scroll-progress line + dot (no numbers) ─────── */}
      <div className={styles.rail} data-rail data-hero-fade aria-hidden="true">
        <span className={styles.railLine}>
          <i className={styles.railFill} data-rail-fill />
          <i className={styles.railDot} />
        </span>
      </div>

      <Container className={styles.container}>
        <div className={styles.grid}>
          {/* ── Text column ─────────────────────────────────────────────── */}
          <div className={styles.left} data-content>
            <h1 className={styles.title} data-title>
              {lead ? `${lead} ` : ''}
              <span className={styles.titleAccent}>{accent}</span>
            </h1>
            <span className={styles.divider} data-divider aria-hidden="true" />

            <p className={styles.lead} data-para>
              {paragraphs[0]}
            </p>
            <ul className={styles.paraList}>
              {paragraphs.slice(1).map((paragraph, index) => (
                <li key={index} className={styles.paraItem}>
                  <span className={styles.paraDot} aria-hidden="true" />
                  <span data-para>{paragraph}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Visual column — cinematic creative-agency composition ─────── */}
          <div className={styles.right}>
            <div className={styles.visual} data-visual>
              {/* Decorative scene: a cinema camera orbited by glass creative panels.
                  Labels are visual props (aria-hidden) — no real copy is added here. */}
              <div className={styles.stage} data-stage-inner aria-hidden="true">
                <span className={styles.orbitRing} />

                <span className={cn(styles.cube, styles.cubeA)} data-depth="18" />
                <span className={cn(styles.cube, styles.cubeB)} data-depth="14" />
                <span className={cn(styles.cube, styles.cubeC)} data-depth="20" />
                <span className={cn(styles.cube, styles.cubeD)} data-depth="12" />

                {/* Cinema camera */}
                <div className={styles.camera} data-depth="6">
                  <span className={styles.camTop} />
                  <span className={styles.camBody} />
                  <span className={styles.camLens}>
                    <span className={styles.camLensRing} />
                    <span className={styles.camLensGlass} />
                  </span>
                  <span className={styles.camBrand}>Buyue</span>
                </div>

                {/* Floating glass panels */}
                <div
                  className={cn(styles.card, styles.cardStrategy)}
                  data-card-float
                  data-depth="22"
                >
                  <span className={styles.cardKicker}>Brand Strategy</span>
                  <span className={styles.cardTitle}>Creative Direction</span>
                  <span className={styles.cardLine} />
                </div>

                <div className={cn(styles.card, styles.cardClap)} data-card-float data-depth="26">
                  <span className={styles.clapBar} />
                  <div className={styles.clapMeta}>
                    <span>
                      <i>SCENE</i>
                      <b>01</b>
                    </span>
                    <span>
                      <i>TAKE</i>
                      <b>03</b>
                    </span>
                    <span>
                      <i>ROLL</i>
                      <b>02</b>
                    </span>
                  </div>
                  <span className={styles.clapStudio}>Buyue Studio · 2024</span>
                </div>

                <div className={cn(styles.card, styles.cardGrade)} data-card-float data-depth="16">
                  <span className={styles.cardKicker}>Color Grading</span>
                  <span className={styles.wheel} />
                  <div className={styles.sliders}>
                    <span className={styles.slider} />
                    <span className={styles.slider} />
                    <span className={styles.slider} />
                  </div>
                </div>

                <div className={cn(styles.card, styles.cardChart)} data-card-float data-depth="24">
                  <span className={styles.cardKicker}>Campaign</span>
                  <span className={styles.chartValue}>+128%</span>
                  <div className={styles.bars}>
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                </div>

                <div
                  className={cn(styles.card, styles.cardContent)}
                  data-card-float
                  data-depth="18"
                >
                  <span className={styles.cardKicker}>Content Production</span>
                  <div className={styles.thumbs}>
                    <i />
                    <i />
                    <i />
                  </div>
                </div>

                <div
                  className={cn(styles.card, styles.cardTimeline)}
                  data-card-float
                  data-depth="10"
                >
                  <span className={styles.play} />
                  <div className={styles.tracks}>
                    <span className={styles.wave} />
                    <span className={cn(styles.wave, styles.waveB)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
