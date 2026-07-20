'use client';

import { useRef, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { Heading, Text } from '@/components/ui/Typography';
import { clientLogos, type ClientLogo } from '@/lib/data/clientLogos';
import { cn } from '@/lib/utils/cn';
import styles from './ClientLogoMosaic.module.css';

/**
 * Clients — a scroll-driven gallery of three curated groups (12 / 12 / 6) rendered
 * on a permanently dark band.
 *
 * The 30 logos are split into three groups stacked on the same grid cell, so a
 * group can exit upward while the next rises from below in the SAME instant —
 * one continuous transformation, never a fade or a hard cut.
 *
 * ONE ScrollTrigger `scrub` timeline over a ~300vh track drives the groups from a
 * pre-set state (`gsap.set` + pure `to`), so the scrollbar IS the playhead: stop
 * halfway and it holds; scroll up and it rewinds group 3 → 2 → 1.
 *
 * Timeline (arbitrary units; scrub normalises):
 *    0– 30  hold group 1
 *   30– 55  group 1 lifts out ↑  ⟂  group 2 rises in ↑ (staggered, overlapping)
 *   55– 70  hold group 2
 *   70– 95  group 2 lifts out ↑  ⟂  group 3 rises in ↑ (final, centred row)
 *   95–110  hold group 3
 *
 * THREE TRANSFORM CHANNELS, THREE ELEMENTS — they can never fight:
 *   .cell     GSAP scroll timeline  → y, scale, autoAlpha, filter
 *   .floater  GSAP ambient float    → y
 *   .card     CSS spotlight + hover → transform
 *
 * Once a group settles, an auto-spotlight walks its cards one at a time (~2s each)
 * and loops. The spotlit card's float pauses and resumes on its own phase. The cycle
 * runs only while the section is on screen AND the tab is visible.
 *
 * `interactive={false}` (Clients page) → static wall, no scroll track; the spotlight
 * walks all 30. Reduced motion → fully static, no ambient motion.
 */

const GROUP_1 = clientLogos.slice(0, 12);
const GROUP_2 = clientLogos.slice(12, 24);
const GROUP_3 = clientLogos.slice(24, 30);

/** Dwell time on each spotlit card, seconds. */
const SPOT_DWELL = 2;

type MosaicProps = { heading?: ReactNode; subheading?: ReactNode; interactive?: boolean };

export function ClientLogoMosaic({ heading, subheading, interactive = true }: MosaicProps) {
  const root = useRef<HTMLElement>(null);
  const shouldReduce = useReducedMotion();

  useGSAP(
    () => {
      if (shouldReduce || !root.current) return;
      const rootEl = root.current;

      const cellsOf = (group: string) =>
        gsap.utils.toArray<HTMLElement>(`[data-group="${group}"] [data-cell]`, rootEl);
      const groups: Record<string, HTMLElement[]> = {
        '1': cellsOf('1'),
        '2': cellsOf('2'),
        '3': cellsOf('3'),
      };
      const allCells = [...groups['1']!, ...groups['2']!, ...groups['3']!];
      if (!allCells.length) return;

      const floaterOf = (cell: HTMLElement) => cell.querySelector<HTMLElement>('[data-float]');
      const cardOf = (cell: HTMLElement) => cell.querySelector<HTMLElement>('[data-card]');

      // ── Ambient float — one paused tween per card, on the .floater layer.
      // Rest is y:0 and drift is upward only (0 → -2/-3px), so a card never dips
      // below its row baseline. Amplitude, duration (6–10s) AND starting phase are
      // randomised, so no two cards ever crest together.
      const floats = new Map<HTMLElement, gsap.core.Tween>();
      allCells.forEach((cell) => {
        const floater = floaterOf(cell);
        if (!floater) return;
        const tween = gsap.to(floater, {
          y: -3,
          duration: 8,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          paused: true,
        });
        // Desynchronise: each card enters its cycle at a different point, so no two
        // ever crest together (equivalent to a randomised animation-delay).
        tween.progress(gsap.utils.random(0, 1));
        floats.set(cell, tween);
      });

      // ── Spotlight — exactly one card lit at any time ────────────────────────
      let spotlit: HTMLElement | null = null;
      let floatsOn = false;

      const setSpot = (cell: HTMLElement | null) => {
        if (spotlit === cell) return;
        if (spotlit) {
          cardOf(spotlit)?.removeAttribute('data-spot');
          // `play()`, never `restart()` — resuming mid-cycle preserves the card's
          // phase, so it rejoins the wall's drift instead of snapping to y:0.
          if (floatsOn) floats.get(spotlit)?.play();
        }
        spotlit = cell;
        if (!cell) return;
        cardOf(cell)?.setAttribute('data-spot', '');
        // Hold still under the light. Pausing (rather than tweening to rest) keeps
        // the tween's phase intact for a seamless resume; the offset is ≤3px.
        floats.get(cell)?.pause();
      };

      let cycle: gsap.core.Timeline | null = null;
      const stopCycle = () => {
        cycle?.kill();
        cycle = null;
        setSpot(null);
      };
      const startCycle = (cells: HTMLElement[]) => {
        cycle = gsap.timeline({ repeat: -1 });
        cells.forEach((cell) => {
          cycle!.call(() => setSpot(cell));
          cycle!.to({}, { duration: SPOT_DWELL });
        });
      };

      // ── State machine: which group (if any) is settled and showable ─────────
      let settled = interactive ? '1' : 'all';
      let inView = false;
      let tabVisible = typeof document === 'undefined' || !document.hidden;
      let applied = '';

      const apply = () => {
        const active = inView && tabVisible ? settled : '';
        if (active === applied) return;
        applied = active;

        stopCycle();
        floatsOn = false;
        // Pause in place — no y reset. Phases survive, so re-entering the section
        // resumes the drift exactly where it left off (the ≤3px offset is invisible).
        floats.forEach((tween) => tween.pause());
        if (!active) return;

        const cells = active === 'all' ? allCells : (groups[active] ?? []);
        if (!cells.length) return;
        floatsOn = true;
        cells.forEach((cell) => floats.get(cell)?.play());
        startCycle(cells);
      };

      // Pause everything when the section is off screen (perf) …
      const visibility = ScrollTrigger.create({
        trigger: rootEl,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          inView = self.isActive;
          apply();
        },
      });

      // … and when the tab is backgrounded.
      const onVisibility = () => {
        tabVisible = !document.hidden;
        apply();
      };
      document.addEventListener('visibilitychange', onVisibility);

      let scrollTl: gsap.core.Timeline | null = null;

      if (interactive) {
        const g1 = groups['1']!;
        const g2 = groups['2']!;
        const g3 = groups['3']!;

        // Pre-set: group 1 in place, groups 2 + 3 waiting below (hidden → inert hover).
        gsap.set(g1, { y: 0, autoAlpha: 1, scale: 1, filter: 'blur(0px)' });
        gsap.set([...g2, ...g3], { y: 110, autoAlpha: 0, scale: 0.94, filter: 'blur(12px)' });

        const exit = {
          y: -110,
          autoAlpha: 0,
          scale: 0.94,
          filter: 'blur(10px)',
          ease: 'power2.in',
          duration: 22,
          stagger: { amount: 7, from: 'start' as const },
        };
        const enter = {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          filter: 'blur(0px)',
          ease: 'power3.out',
          duration: 24,
          stagger: { amount: 9, from: 'start' as const },
        };

        // Which group is fully settled at a given scrub progress ('' = mid-transition).
        const TOTAL = 110;
        const settledAt = (p: number) => {
          const t = p * TOTAL;
          if (t < 30) return '1';
          if (t >= 55 && t < 70) return '2';
          if (t >= 95) return '3';
          return '';
        };

        scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: rootEl,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.8,
            onUpdate: (self) => {
              const next = settledAt(self.progress);
              if (next !== settled) {
                settled = next;
                apply();
              }
            },
          },
        });

        // Stage 1 → 2. The overlap (exit at 30, enter at 33) is what makes the two
        // groups read as one gallery transforming into the next.
        scrollTl.to(g1, exit, 30);
        scrollTl.to(g2, enter, 33);

        // Stage 2 → 3.
        scrollTl.to(g2, exit, 70);
        scrollTl.to(g3, enter, 73);

        // Tail hold, so the final group settles before the section releases.
        scrollTl.to({}, { duration: 5 }, 105);
      }

      return () => {
        document.removeEventListener('visibilitychange', onVisibility);
        visibility.kill();
        stopCycle();
        floats.forEach((tween) => tween.kill());
        scrollTl?.scrollTrigger?.kill();
        scrollTl?.kill();
      };
    },
    { scope: root, dependencies: [shouldReduce, interactive] },
  );

  return (
    <section ref={root} className={styles.scene} data-static={!interactive || undefined}>
      <div className={styles.sticky}>
        <div className={styles.stage}>
          {(heading || subheading) && (
            <header className={styles.head}>
              {heading && <Heading level={2}>{heading}</Heading>}
              {subheading && (
                <Text size="body-l" className={styles.subtitle}>
                  {subheading}
                </Text>
              )}
            </header>
          )}

          <div className={styles.groups}>
            <Group id="1" logos={GROUP_1} />
            <Group id="2" logos={GROUP_2} />
            <Group id="3" logos={GROUP_3} final />
          </div>
        </div>
      </div>
    </section>
  );
}

function Group({ id, logos, final }: { id: string; logos: ClientLogo[]; final?: boolean }) {
  // Groups 1 + 2: two rows of six. Group 3: one centred row of six — no empty row.
  const rows = final ? [logos] : [logos.slice(0, 6), logos.slice(6, 12)];
  return (
    <div className={cn(styles.group, final && styles.groupFinal)} data-group={id}>
      {rows.map((row, r) => (
        <div key={r} className={styles.row}>
          {row.map((logo, i) => (
            <Cell key={i} logo={logo} />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Single logo card — a 1:1 translation of the supplied Tailwind template. This project
 * has no Tailwind (CSS Modules + design tokens), so each utility is expressed as its
 * exact computed value in ClientLogoMosaic.module.css. Class → value mapping:
 *
 * Every card is identical frosted glass — no per-logo detection. The material,
 * reflections and internal light all live in ClientLogoMosaic.module.css; only the
 * active/hover animation differs. `.sweep` is the active card's light reflection.
 */
function Cell({ logo }: { logo: ClientLogo }) {
  return (
    <div className={styles.cell} data-cell>
      <div className={styles.floater} data-float>
        <div className={styles.card} data-card>
          <span className={styles.sweep} aria-hidden="true" />
          <div className={styles.logoBox}>
            {/* eslint-disable-next-line @next/next/no-img-element -- static /public logo, sized by CSS */}
            <img
              className={styles.logo}
              src={logo.src}
              alt={logo.alt}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
