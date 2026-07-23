import type { CSSProperties } from 'react';
import styles from './WhyMotif.module.css';

/**
 * The four abstract ember motifs that head the "Why choose Buyue?" cards.
 *
 * Pure inline SVG + CSS animation — no images, no JS, no GSAP, so this stays a
 * server component and ships zero runtime. Every coordinate is derived
 * deterministically at module scope (never Math.random), so the server and client
 * render byte-identical markup and hydration stays clean.
 *
 * Each motif paints twice: a heavily blurred copy underneath for the bloom, and a
 * crisp copy on top for definition. Both passes carry the same animation, so the
 * glow tracks the motion instead of sitting behind it as a static smear.
 *
 * Per-element base opacity travels as the `--o` custom property rather than an
 * inline `opacity`, because a CSS animation outranks an inline style — keyframes
 * would flatten the depth. The keyframes modulate `calc(var(--o) * k)` instead,
 * so each element animates around its own resting value.
 */
export type MotifVariant = 'wave' | 'mesh' | 'rings' | 'nodes';

const W = 320;
const H = 132;

const f = (n: number) => n.toFixed(2);

/** Inline custom properties (`--o`, `--d`) need the cast; React types stop at CSS. */
const vars = (o: number, delay: number): CSSProperties =>
  ({ '--o': o, '--d': `${delay.toFixed(2)}s` }) as CSSProperties;

/* ── 02 — mesh ──────────────────────────────────────────────────────────────
   A wireframe surface: parallel sine ribs whose amplitude and phase drift line to
   line, so the sheet reads as a folded surface catching light rather than a grid.
   Each rib's animation delay is offset by its depth, so the shimmer propagates
   across the sheet as one travelling swell rather than blinking in unison. */
const MESH_LINES = Array.from({ length: 26 }, (_, i) => {
  const t = i / 25;
  const baseY = 16 + t * 92;
  const amp = 26 * (1 - t * 0.55);
  const phase = t * 2.4;
  const pts: string[] = [];
  for (let x = -10; x <= W + 10; x += 10) {
    const u = (x / W) * Math.PI * 2.6;
    const y = baseY + amp * Math.sin(u + phase) * 0.5 + amp * 0.35 * Math.sin(u * 0.5 - phase);
    pts.push(`${f(x)} ${f(y)}`);
  }
  return { d: `M ${pts.join(' L ')}`, o: 0.16 + (1 - t) * 0.5, delay: -t * 3.2 };
});

/* ── 04 — nodes ─────────────────────────────────────────────────────────────
   A connected network. Points sit on a jittered lattice (deterministic trig, not
   random), and every pair closer than LINK_DIST is joined — so the topology is
   emergent rather than hand-drawn, and always planar-looking. */
const NODES = Array.from({ length: 22 }, (_, i) => {
  const col = i % 6;
  const row = Math.floor(i / 6);
  const x = 18 + col * 57 + Math.sin(i * 2.7) * 16;
  const y = 26 + row * 28 + Math.cos(i * 1.9) * 13;
  // Irrational-ish step spreads the twinkle so no two neighbours fire together.
  return { x, y, r: 2.1 + ((i * 7) % 5) * 0.4, delay: -((i * 0.618) % 1) * 4.2 };
});

const LINK_DIST = 66;
const LINKS: Array<{ a: number; b: number; o: number; delay: number }> = [];
for (let i = 0; i < NODES.length; i++) {
  for (let j = i + 1; j < NODES.length; j++) {
    const a = NODES[i]!;
    const b = NODES[j]!;
    const d = Math.hypot(a.x - b.x, a.y - b.y);
    if (d < LINK_DIST) {
      LINKS.push({
        a: i,
        b: j,
        o: 0.5 * (1 - d / LINK_DIST) + 0.12,
        delay: -((LINKS.length * 0.37) % 1) * 5,
      });
    }
  }
}

/* ── 01 — wave ──────────────────────────────────────────────────────────────
   A thick ribbon folding over itself. Drawn as one round-capped stroke so the
   crossing reads as a single continuous tube. */
const WAVE = 'M -14 74 C 44 8, 92 132, 150 74 C 196 28, 214 108, 262 66 C 292 40, 316 52, 336 44';
const WAVE_UNDER = 'M -14 92 C 52 34, 104 146, 162 92';

/* ── 03 — rings ─────────────────────────────────────────────────────────────
   Concentric shells around a hot core — an impact radiating outward. Delays run
   inner-to-outer so the breath reads as energy leaving the centre. */
const RINGS = [13, 24, 36, 49, 63].map((r, i) => ({
  r,
  o: 0.55 - i * 0.09,
  w: 2.4 - i * 0.32,
  delay: -i * 0.55,
}));

function Wave() {
  return (
    <>
      <path className={styles.ribbonUnder} d={WAVE_UNDER} />
      <path className={styles.ribbon} d={WAVE} />
      {/* pathLength normalises the dash pattern to 100 units regardless of the
          path's real length, so the travelling highlight loops seamlessly. */}
      <path className={styles.ribbonCore} d={WAVE} pathLength={100} />
    </>
  );
}

function Mesh() {
  return (
    <g className={styles.meshG}>
      {MESH_LINES.map((l, i) => (
        <path key={i} className={styles.meshLine} d={l.d} style={vars(l.o, l.delay)} />
      ))}
    </g>
  );
}

function Rings() {
  return (
    <g transform={`translate(${W * 0.27} ${H * 0.46})`}>
      {RINGS.map((r, i) => (
        <circle
          key={i}
          className={styles.ring}
          r={r.r}
          style={{ ...vars(r.o, r.delay), strokeWidth: r.w }}
        />
      ))}
      <circle className={styles.ringHalo} r="26" />
      <circle className={styles.ringCore} r="7" />
    </g>
  );
}

function Nodes() {
  return (
    <g>
      {LINKS.map((l, i) => {
        const a = NODES[l.a]!;
        const b = NODES[l.b]!;
        return (
          <line
            key={i}
            className={styles.link}
            x1={f(a.x)}
            y1={f(a.y)}
            x2={f(b.x)}
            y2={f(b.y)}
            style={vars(l.o, l.delay)}
          />
        );
      })}
      {NODES.map((n, i) => (
        <circle
          key={i}
          className={styles.node}
          cx={f(n.x)}
          cy={f(n.y)}
          r={f(n.r)}
          style={vars(0.9, n.delay)}
        />
      ))}
    </g>
  );
}

const SHAPES: Record<MotifVariant, () => React.JSX.Element> = {
  wave: Wave,
  mesh: Mesh,
  rings: Rings,
  nodes: Nodes,
};

/** Decorative — `aria-hidden`, so the card's heading carries all of the meaning. */
export function WhyMotif({ variant }: { variant: MotifVariant }) {
  const Shape = SHAPES[variant];
  return (
    <svg
      className={styles.motif}
      data-variant={variant}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      {/* Bloom pass — the same geometry, blurred, painted beneath the crisp pass. */}
      <g className={styles.bloom}>
        <Shape />
      </g>
      <g className={styles.crisp}>
        <Shape />
      </g>
    </svg>
  );
}
