'use client';

import { useRef, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/layout/Container';
import { Icon } from '@/components/ui/Icon';
import { buttonClasses } from '@/components/ui/Button';
import { Magnetic } from '@/lib/motion/Magnetic';
import { onPreloaderDone } from '@/lib/motion/preloader-signal';
import styles from './ClientsHero.module.css';

type ClientsHeroProps = {
  heading: string;
  statValue: number;
  statPrefix: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
};

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

/* ══════════════════════════════════════════════════════════════════════════════
   The Constellation Network — a canvas relationship graph.

   A warm central hub (Buyue) is linked to a field of abstract partner nodes; light
   pulses travel the links so the relationships read as LIVING, not a static diagram.
   Node + link + centre is the one composition a first-time visitor decodes instantly
   as "a connected network of trusted partners" — the page's purpose, without logos.

   Layout is seeded (stable across reloads); the whole visual is decorative
   (aria-hidden). Drawing is theme-aware, read fresh each frame so a theme toggle is
   picked up live. Entrance is gated by the same clock the copy uses (set on the
   preloader hand-off); reduced motion renders one still, legible frame and never
   loops. Cleanup cancels the frame loop and the resize observer.
   ══════════════════════════════════════════════════════════════════════════════ */
type RGB = [number, number, number];
const FLAME: RGB = [207, 81, 56];
const SOFT: RGB = [255, 122, 69];
const GOLD: RGB = [234, 196, 107];
const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

function mountNetwork(
  canvas: HTMLCanvasElement,
  reduce: boolean,
  mouse: { tx: number; ty: number },
  clock: { start: number },
): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  // ── Seeded layout (deterministic → identical every load; no hydration concern
  //    since the canvas is client-only). Nodes are placed around the hub in an
  //    organic ring so the graph reads as relationships, not a symmetric mesh.
  let seed = 1337;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const core = { x: 0.6, y: 0.46 };
  const N = 16;
  const nodes = Array.from({ length: N }, (_, i) => {
    const ang = rnd() * Math.PI * 2;
    const rad = 0.16 + rnd() * 0.42;
    return {
      bx: core.x + Math.cos(ang) * rad * 0.9,
      by: core.y + Math.sin(ang) * rad * 1.05,
      r: 3 + rnd() * 6,
      ph: rnd() * Math.PI * 2,
      sp: 0.3 + rnd() * 0.5,
      amp: 0.006 + rnd() * 0.012,
      col: i % 3 === 0 ? GOLD : i % 3 === 1 ? SOFT : FLAME,
      depth: 0.5 + rnd() * 0.5,
    };
  });
  type Link = { a: number; b: number; pulse: number };
  const links: Link[] = nodes.map((_, i) => ({ a: -1, b: i, pulse: rnd() })); // a = -1 → hub
  for (let k = 0; k < 7; k++) {
    const a = Math.floor(rnd() * N);
    const b = Math.floor(rnd() * N);
    if (a !== b) links.push({ a, b, pulse: rnd() });
  }

  let W = 0;
  let H = 0;
  let mx = 0;
  let my = 0;
  let raf = 0;
  const dpr = () => Math.min(2, window.devicePixelRatio || 1);
  const resize = () => {
    const d = dpr();
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(W * d));
    canvas.height = Math.max(1, Math.round(H * d));
    ctx.setTransform(d, 0, 0, d, 0, 0);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const draw = (now: number) => {
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    // Entrance progress (easeOutCubic). 0 until the preloader clock starts; 1 at
    // once for reduced motion.
    const ee = reduce
      ? 1
      : clock.start
        ? 1 - Math.pow(1 - Math.min(1, (now - clock.start) / 1800), 3)
        : 0;
    const t = reduce ? 0 : now / 1000;
    mx += (mouse.tx - mx) * 0.06;
    my += (mouse.ty - my) * 0.06;

    // Right-panel box, offset by the eased cursor parallax.
    const bx = W * 0.3;
    const by = H * 0.1;
    const bw = W * 0.66;
    const bh = H * 0.8;
    const P = (nx: number, ny: number, depth = 1) => ({
      x: bx + nx * bw + mx * 22 * depth,
      y: by + ny * bh + my * 16 * depth,
    });

    ctx.clearRect(0, 0, W, H);

    const cp = P(core.x, core.y);

    // Hub bloom.
    const bloom = ctx.createRadialGradient(cp.x, cp.y, 0, cp.x, cp.y, Math.max(120, bw * 0.28));
    bloom.addColorStop(0, rgba(SOFT, (light ? 0.16 : 0.22) * ee));
    bloom.addColorStop(0.4, rgba(FLAME, (light ? 0.08 : 0.1) * ee));
    bloom.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = bloom;
    ctx.beginPath();
    ctx.arc(cp.x, cp.y, Math.max(120, bw * 0.28), 0, 7);
    ctx.fill();

    // Live node positions (gentle idle drift).
    const pos = nodes.map((n) => {
      const dx = Math.cos(t * n.sp + n.ph) * n.amp;
      const dy = Math.sin(t * n.sp * 1.1 + n.ph) * n.amp;
      return P(n.bx + dx, n.by + dy, n.depth);
    });

    // Links — draw outward on entrance (staggered), then a light pulse travels.
    for (let i = 0; i < links.length; i++) {
      const L = links[i]!;
      const A = L.a === -1 ? cp : pos[L.a]!;
      const B = pos[L.b]!;
      const drawn = Math.min(1, Math.max(0, ee * 1.4 - i * 0.02));
      if (drawn <= 0) continue;
      const ex = A.x + (B.x - A.x) * drawn;
      const ey = A.y + (B.y - A.y) * drawn;
      const lg = ctx.createLinearGradient(A.x, A.y, B.x, B.y);
      lg.addColorStop(0, rgba(FLAME, 0));
      lg.addColorStop(0.5, rgba(light ? FLAME : SOFT, light ? 0.32 : 0.28));
      lg.addColorStop(1, rgba(light ? FLAME : GOLD, light ? 0.04 : 0.05));
      ctx.strokeStyle = lg;
      ctx.lineWidth = L.a === -1 ? 1.4 : 0.9;
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      if (drawn >= 1) {
        const pp = (t * 0.28 + L.pulse) % 1;
        const px = A.x + (B.x - A.x) * pp;
        const py = A.y + (B.y - A.y) * pp;
        ctx.fillStyle = rgba(light ? [176, 74, 40] : GOLD, light ? 0.85 : 0.9);
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, 7);
        ctx.fill();
        ctx.fillStyle = rgba(SOFT, light ? 0.18 : 0.25);
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, 7);
        ctx.fill();
      }
    }

    // Nodes — pop on (scale) in a stagger; a warm glow + a bright centre dot.
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i]!;
      const sc = Math.min(1, Math.max(0, ee * 1.5 - i * 0.05));
      if (sc <= 0) continue;
      const p = pos[i]!;
      const r = n.r * sc;
      const gg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
      gg.addColorStop(0, rgba(n.col, light ? 0.55 : 0.9));
      gg.addColorStop(0.4, rgba(n.col, light ? 0.22 : 0.4));
      gg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gg;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 4, 0, 7);
      ctx.fill();
      ctx.fillStyle = rgba(light ? [150, 52, 32] : [255, 250, 244], light ? 0.85 : 0.95);
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 0.6, 0, 7);
      ctx.fill();
    }

    // Hub centre + halo (drawn last so it sits on top).
    ctx.fillStyle = rgba(light ? [150, 52, 32] : [255, 244, 232], ee);
    ctx.beginPath();
    ctx.arc(cp.x, cp.y, 7 * ee, 0, 7);
    ctx.fill();
    const halo = ctx.createRadialGradient(cp.x, cp.y, 0, cp.x, cp.y, 26);
    halo.addColorStop(0, rgba(GOLD, (light ? 0.4 : 0.6) * ee));
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cp.x, cp.y, 26, 0, 7);
    ctx.fill();
  };

  if (reduce) {
    draw(0);
    return () => ro.disconnect();
  }

  const loop = (now: number) => {
    if (!document.hidden) draw(now);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
  };
}

/**
 * Clients page hero — "The Constellation Network" (Doc 09 Page 4; content verbatim).
 *
 * Full-first-screen scene sized like AboutCinematicIntro. The right column is a
 * living relationship graph on a canvas: a warm Buyue hub linked to abstract partner
 * nodes, with light pulsing along the links. It communicates a connected network of
 * trusted clients WITHOUT logos (the wall below owns those). Motion follows the
 * shared hero contract: preloader-gated entrance (with a +count-up on the trust
 * stat), cursor parallax, a scrubbed scroll exit; the canvas is self-contained and
 * theme-aware. Reduced motion → one still, legible frame.
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
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useGSAP(
    () => {
      const el = root.current;
      const cv = canvas.current;
      if (!el || !cv) return;

      // Shared state the canvas reads: cursor targets + the entrance clock.
      const mouse = { tx: 0, ty: 0 };
      const clock = { start: reduce ? 1 : 0 };
      const stopNetwork = mountNetwork(cv, !!reduce, mouse, clock);

      if (reduce) return stopNetwork;

      const q = gsap.utils.selector(el);
      const words = q<HTMLElement>('[data-word]');
      const stat = q('[data-stat]');
      const statNum = el.querySelector<HTMLElement>('[data-statnum]');
      const divider = q('[data-divider]');
      const bodyEl = q('[data-body]');
      const cta = q('[data-cta]');
      const content = q('[data-content]');
      const visual = q('[data-visual]');

      // ── Cursor parallax (fine pointers) — feeds the canvas its target offset.
      let frame = 0;
      const onMove = (event: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const nx = ((event.clientX - r.left) / r.width - 0.5) * 2;
        const ny = ((event.clientY - r.top) / r.height - 0.5) * 2;
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          mouse.tx = nx;
          mouse.ty = ny;
        });
      };
      const fine = window.matchMedia('(pointer: fine)').matches;
      if (fine) el.addEventListener('pointermove', onMove);

      // ── Hidden entrance states (CSS defaults are the SHOWN state → reduced motion
      //    / no-JS render everything visible).
      gsap.set(words, { autoAlpha: 0, yPercent: 60, filter: 'blur(8px)' });
      gsap.set(stat, { autoAlpha: 0, y: 18 });
      gsap.set(divider, { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(bodyEl, { autoAlpha: 0, y: 20 });
      gsap.set(cta, { autoAlpha: 0, y: 20 });
      gsap.set(visual, { autoAlpha: 0 });
      if (statNum) statNum.textContent = '0';

      // ── Entrance (paused; plays on the preloader hand-off). The canvas fades up
      //    and starts drawing its network (via the shared clock), while the copy sets.
      const counter = { v: 0 };
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
      tl.to(visual, { autoAlpha: 1, duration: 1, ease: 'power2.out' }, 0)
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
        clock.start = performance.now();
        tl.play();
      };
      const off = onPreloaderDone(play);
      const safety = window.setTimeout(play, 1400);

      // ── Scrubbed scroll exit (desktop) — the scene drifts up and fades as the
      //    reader moves into the logo wall below.
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
        stopNetwork();
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

          {/* Right — The Constellation Network (canvas) */}
          <div className={styles.visual} data-visual aria-hidden="true">
            <canvas ref={canvas} className={styles.network} />
          </div>
        </div>
      </Container>
    </section>
  );
}
