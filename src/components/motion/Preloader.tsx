'use client';

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/motion/gsap';
import { markPreloaderDone } from '@/lib/motion/preloader-signal';
import styles from './Preloader.module.css';

/* ── Orbital constellation coordinate space (scaled to fit the viewport) ─────────
   The logo leads the hierarchy: it is sized to ~57% of the composition height and the
   whole system is sized around it. The ring is pushed far out so the mark keeps a
   clear ≥120px halo (measured from its diagonal corner, the direction the splines
   run). Everything is one scaled coordinate space, so spacing stays proportional at
   every breakpoint. */
const VW = 2080;
const VH = 1740;
const C = { x: VW / 2, y: VH / 2 }; // logo centre (1040, 870)
const R = 940; // outer constellation radius — the four stations sit on this circle

const f = (n: number) => n.toFixed(2);

/** Polar point around the centre (0° = top, clockwise). */
const polar = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: C.x + r * Math.cos(a), y: C.y + r * Math.sin(a) };
};

/** Clockwise unit tangent at a ring angle (0° = top). */
const tangent = (deg: number) => {
  const th = ((deg - 90) * Math.PI) / 180;
  return { x: -Math.sin(th), y: Math.cos(th) };
};

type Pillar = { key: string; title: string; desc: string; node: { x: number; y: number } };

/** Four quadrant stations (clockwise): Insight → Strategy → Analytics → Growth. */
const PILLARS: Pillar[] = [
  { key: 'tl', title: 'INSIGHT', desc: 'Understanding what truly matters', node: polar(R, 315) },
  { key: 'tr', title: 'STRATEGY', desc: 'Turning insight into direction', node: polar(R, 45) },
  { key: 'br', title: 'ANALYTICS', desc: 'Turning data into real decisions', node: polar(R, 135) },
  {
    key: 'bl',
    title: 'GROWTH',
    desc: 'Creating measurable and lasting impact',
    node: polar(R, 225),
  },
];

/** A smooth CLOSED loop that connects the four stations and wraps the logo. Built from
 *  four 90° cubic-arc segments (tangent-matched at each node), so it passes exactly
 *  through every station and reads as one continuous, organised path around the mark.
 *  `r` offsets create a slim fan of filaments centred on the ring radius. */
const RING_ANGLES = [45, 135, 225, 315];
function ringPath(r: number): string {
  const k = r * 0.5523; // cubic handle length for a 90° circular arc
  let d = '';
  for (let i = 0; i < 4; i++) {
    const a0 = RING_ANGLES[i]!;
    const a1 = RING_ANGLES[(i + 1) % 4]!;
    const p0 = polar(r, a0);
    const p1 = polar(r, a1);
    const t0 = tangent(a0);
    const t1 = tangent(a1);
    const c1 = { x: p0.x + t0.x * k, y: p0.y + t0.y * k };
    const c2 = { x: p1.x - t1.x * k, y: p1.y - t1.y * k };
    if (i === 0) d += `M ${f(p0.x)} ${f(p0.y)} `;
    d += `C ${f(c1.x)} ${f(c1.y)} ${f(c2.x)} ${f(c2.y)} ${f(p1.x)} ${f(p1.y)} `;
  }
  return `${d}Z`;
}

const CONNS = PILLARS; // nodes + labels
// Only two very thin orbit strokes (≈50% lighter than before) for an elegant ring.
const ORBIT_LINES = [-4, 4].map((o) => ringPath(R + o));
const ORBIT_PATH = ringPath(R); // path the flowing light + pulses travel
const PARTICLES = [0, 1, 2]; // three golden light pulses circulating the orbit

/**
 * Cinematic first-visit intro — a premium strategic-network data-visualisation.
 *
 * The BUYUE mark is the hero on a Black Powder stage with a gold radial glow and gold
 * dust. Four anchor pillars (STRATEGY / INSIGHT / ANALYTICS / GROWTH) surround it,
 * joined by organic flowing filaments that draw from the logo outward; light pulses
 * travel the lines, premium nodes breathe and glow, and sparkles flicker along the
 * network — luxury data-viz / watch mechanics, always secondary to the logo. After a
 * hold, a measured FLIP carries the mark into its navbar position.
 *
 * Guardrails: plays on every full load/refresh; reduced-motion resolves instantly;
 * no-JS keeps the overlay hidden by CSS; aria-hidden (decorative);
 * the hero waits on markPreloaderDone(). The scene scales to fit; the mark scales via
 * width (not transform) so the FLIP stays pixel-accurate.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      // Plays on EVERY full load / refresh. Only prefers-reduced-motion skips it
      // (accessibility); no-JS never shows it (the overlay is CSS-hidden by default).
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) {
        markPreloaderDone();
        return;
      }

      // Scale the fixed composition to fit the viewport (keeps the symmetry).
      const fit = () => {
        const s = Math.min(1, (window.innerWidth * 0.92) / VW, (window.innerHeight * 0.92) / VH);
        el.style.setProperty('--net-scale', String(s));
      };
      fit();
      window.addEventListener('resize', fit);

      setActive(true);

      const finish = () => {
        setActive(false);
        markPreloaderDone();
      };

      const q = gsap.utils.selector(el);
      const stage = q('[data-pre-stage]')[0];
      const glow = q('[data-pre-glow]')[0];
      const scene = q('[data-pre-scene]')[0];
      const particles = q('[data-pre-particle]');
      const lines = q('[data-pre-line]');
      const runners = q('[data-pre-runner]');
      const nodes = q('[data-pre-node]');
      const labels = q('[data-pre-label]');
      const markBox = q('[data-pre-mark]')[0] as HTMLElement | undefined;
      const markImg = q('[data-pre-img]')[0];

      if (!stage || !glow || !scene || !markBox || !markImg) {
        window.removeEventListener('resize', fit);
        finish();
        return;
      }

      const flipMarkToNavbar = () => {
        const target = document.querySelector<HTMLElement>('[data-nav-logo]');
        if (!markBox || !target) return;
        const first = markBox.getBoundingClientRect();
        const last = target.getBoundingClientRect();
        if (!first.height || !last.height) return;
        const scale = last.height / first.height;
        const dx = last.left + last.width / 2 - (first.left + first.width / 2);
        const dy = last.top + last.height / 2 - (first.top + first.height / 2);
        gsap.to(markBox, { x: dx, y: dy, scale, duration: 1.0, ease: 'expo.inOut' });
      };

      // Subtle parallax: the blurred glow layer drifts a few px against the crisp
      // filaments, lending the constellation depth.
      const glowLayer = q('[data-pre-glowlayer]')[0];
      if (glowLayer) {
        gsap.to(glowLayer, {
          x: 6,
          y: -4,
          duration: 9,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      }

      // Gold dust drifts gently (continuous, subtle).
      particles.forEach((p) => {
        gsap.to(p, {
          x: gsap.utils.random(-30, 30),
          y: gsap.utils.random(-40, 40),
          duration: gsap.utils.random(6, 11),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // 1 — Stage + gold atmosphere + dust.
      tl.set(el, { autoAlpha: 1 })
        .fromTo(stage, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 })
        .fromTo(glow, { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 1.7 }, 0)
        .fromTo(particles, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.0, stagger: 0.03 }, 0.3);

      // 2 — The logo settles in with its warm glow.
      tl.fromTo(
        markImg,
        { autoAlpha: 0, scale: 1.06, filter: 'blur(6px)' },
        { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out' },
        0.5,
      );

      // 3 — Connections draw from the logo outward.
      tl.fromTo(
        lines,
        { strokeDashoffset: 100, autoAlpha: 0 },
        { strokeDashoffset: 0, autoAlpha: 1, duration: 1.6, ease: 'power2.inOut', stagger: 0.03 },
        1.1,
      );

      // 4 — Nodes "lock on" with a sparkle, then hold (CSS breathes them thereafter).
      tl.fromTo(
        nodes,
        { autoAlpha: 0, scale: 0 },
        {
          autoAlpha: 1,
          scale: 1.5,
          duration: 0.4,
          ease: 'power3.out',
          stagger: 0.14,
          transformOrigin: 'center',
        },
        2.3,
      ).to(nodes, { scale: 1, duration: 0.5, ease: 'power2.out', stagger: 0.14 }, '>-0.25');

      // 5 — Light pulses begin travelling (CSS); labels resolve.
      tl.to(runners, { autoAlpha: 1, duration: 0.6 }, 2.7).fromTo(
        labels,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out', stagger: 0.12 },
        2.6,
      );

      // 6 — Hold in silence.
      tl.to({}, { duration: 1.2 }, 4.0);

      // 7 — Clear the network, FLIP the mark into the navbar, lift the stage.
      tl.to(scene, { autoAlpha: 0, duration: 0.7, ease: 'power2.in' }, 5.3)
        .add(flipMarkToNavbar, 5.5)
        .to(stage, { autoAlpha: 0, duration: 0.8, ease: 'power2.inOut' }, 5.8)
        .to(el, { autoAlpha: 0, duration: 0.4, onComplete: finish }, 6.3);

      return () => {
        window.removeEventListener('resize', fit);
        tl.kill();
        gsap.killTweensOf(particles);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className={styles.overlay} data-active={active} aria-hidden="true">
      <div className={styles.stage} data-pre-stage>
        <span className={styles.glow} data-pre-glow aria-hidden="true" />
        <span className={styles.noise} aria-hidden="true" />

        <span className={styles.particles} aria-hidden="true">
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i} className={styles.particle} data-pre-particle />
          ))}
        </span>

        {/* Fixed composition, scaled to fit. */}
        <div className={styles.scene} data-pre-scene>
          <svg className={styles.network} viewBox={`0 0 ${VW} ${VH}`} aria-hidden="true">
            {/* Living energy ring: two thin strokes that gently breathe, a slow
                flowing light, and golden pulses circulating the loop. Fixed geometry. */}
            <g className={styles.orbit}>
              {/* Reduced soft glow underlay — subtle parallax drift. */}
              <g className={styles.linesGlow} data-pre-glowlayer>
                {ORBIT_LINES.map((d, i) => (
                  <path
                    key={`g${i}`}
                    className={styles.glowLine}
                    data-pre-line
                    d={d}
                    pathLength={100}
                  />
                ))}
              </g>
              {/* Two thin crisp strokes. */}
              <g className={styles.lines}>
                {ORBIT_LINES.map((d, i) => (
                  <path
                    key={`l${i}`}
                    className={styles.line}
                    data-pre-line
                    d={d}
                    pathLength={100}
                  />
                ))}
              </g>
              {/* Flowing light travelling slowly inside the orbit. */}
              <path className={styles.flow} data-pre-runner d={ORBIT_PATH} pathLength={100} />
            </g>
            {/* Golden light pulses circulating the loop (different speeds + phases). */}
            <g className={styles.pulses}>
              {PARTICLES.map((i) => (
                <path
                  key={i}
                  className={styles.pulse}
                  data-pre-runner
                  d={ORBIT_PATH}
                  pathLength={100}
                />
              ))}
            </g>
            {/* Premium nodes — fixed stations. */}
            <g className={styles.nodesG}>
              {CONNS.map((c, i) => (
                <g key={`n${i}`} className={styles.node} data-pre-node>
                  <circle className={styles.halo} cx={f(c.node.x)} cy={f(c.node.y)} r="38" />
                  {/* Watch-complication rings: a thin outer bezel, filled mid rings,
                      and a softly breathing core. */}
                  <circle className={styles.nRing} cx={f(c.node.x)} cy={f(c.node.y)} r="26" />
                  <circle className={styles.nOuter} cx={f(c.node.x)} cy={f(c.node.y)} r="18" />
                  <circle className={styles.nMid} cx={f(c.node.x)} cy={f(c.node.y)} r="11.5" />
                  <g className={styles.nodePulse}>
                    <circle className={styles.nInner} cx={f(c.node.x)} cy={f(c.node.y)} r="5.2" />
                  </g>
                </g>
              ))}
            </g>
          </svg>

          {/* Pillar labels. */}
          {CONNS.map((c) => (
            <div
              key={c.key}
              className={`${styles.pillar} ${styles[`pillar-${c.key}`]}`}
              data-pre-label
              style={{ left: `${(c.node.x / VW) * 100}%`, top: `${(c.node.y / VH) * 100}%` }}
            >
              <p className={styles.pillarTitle}>{c.title}</p>
              <p className={styles.pillarDesc}>{c.desc}</p>
            </div>
          ))}
        </div>

        {/* The mark — centred independently of the scaled scene so the FLIP stays exact;
            its size tracks --net-scale via width, not transform. */}
        <div className={styles.mark} data-pre-mark>
          {/* eslint-disable-next-line @next/next/no-img-element -- static brand mark */}
          <img className={styles.markImg} data-pre-img src="/brand/buyue-mark-trim.png" alt="" />
        </div>
      </div>
    </div>
  );
}
