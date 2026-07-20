'use client';

import { useRef, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { Container } from '@/components/primitives/Container';
import { cn } from '@/lib/cn';
import styles from './ValuesScene.module.css';

type ValueItem = { title: string; body: string };

/** Premium line icons — one per value (spark / overlap / diamond / target). */
const VALUE_ICONS: ReactNode[] = [
  <path key="s" d="M12 3 L13.8 9.2 L20 11 L13.8 12.8 L12 19 L10.2 12.8 L4 11 L10.2 9.2 Z" />,
  <g key="t">
    <circle cx="9.5" cy="12" r="5.5" />
    <circle cx="14.5" cy="12" r="5.5" />
  </g>,
  <g key="d">
    <path d="M12 3 L20 12 L12 21 L4 12 Z" />
    <path d="M4 12 H20 M12 3 V21" />
  </g>,
  <g key="r">
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </g>,
];

const CARD_POS = [styles.pos1, styles.pos2, styles.pos3, styles.pos4];
const DARK_PARTICLES = 12;
const DUST = 14;

/** Render the heading as word-spans in the JSX itself — React owns the DOM so GSAP
 *  can animate the words without a mutation conflict (word-level keeps Arabic safe). */
function renderTitleWords(heading: string): ReactNode[] {
  return heading.split(/(\s+)/).map((token, i) =>
    /^\s+$/.test(token) || token.length === 0 ? (
      token
    ) : (
      <span key={i} data-w className={styles.word}>
        {token}
      </span>
    ),
  );
}

/**
 * "Our Values" as a HARDCOVER BOOK OPENING (content verbatim — Doc 02 §2).
 *
 * The dark section is the front cover of a luxury book. As the reader scrolls into
 * the pinned scene, the cover folds open in real 3D perspective — hinged on the
 * trailing edge (right for LTR, mirrored for RTL) — with paper thickness, a crease
 * inner-shadow, a contact shadow on the page beneath, and a specular highlight
 * sweeping the folding edge. The warm-gray page (#D7D2CB) is revealed ONLY by the
 * fold — no wipe, no blur, no white rectangle. Once open, the title sets and the
 * value cards stagger in; on the way out the exact fold reverses and the cover
 * closes back to the dark world.
 *
 * ScrollTrigger owns the pin with `pinType: 'transform'` (never a fixed pin, which
 * glitches under the page-transition transform ancestor) and sizes its own spacer,
 * so there is no leftover empty space. The fold is a scrubbed timeline that peels
 * from the first pixel of scroll, refreshed once the transition settles.
 */
export function ValuesScene({ heading, items }: { heading: string; items: ValueItem[] }) {
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useGSAP(
    () => {
      const el = root.current;
      if (reduce || !el) return;

      // Mouse parallax (warm page) + per-card cursor light.
      let frame = 0;
      let mvx = 0;
      let mvy = 0;
      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        mvx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        mvy = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          el.style.setProperty('--mx', mvx.toFixed(3));
          el.style.setProperty('--my', mvy.toFixed(3));
        });
      };
      el.addEventListener('pointermove', onMove);

      const mm = gsap.matchMedia();

      mm.add('(min-width: 900px)', () => {
        const stage = el.querySelector<HTMLElement>('[data-stage]');
        const cover = el.querySelector<HTMLElement>('[data-cover]');
        const shade = el.querySelector<HTMLElement>('[data-shade]');
        const spec = el.querySelector<HTMLElement>('[data-spec]');
        const edge = el.querySelector<HTMLElement>('[data-edge]');
        const contact = el.querySelector<HTMLElement>('[data-contact]');
        const ornament = el.querySelector<HTMLElement>('[data-ornament]');
        const cards = gsap.utils.toArray<HTMLElement>('[data-vcard]', el);
        const words = gsap.utils.toArray<HTMLElement>('[data-w]', el);
        const cleanups: Array<() => void> = [];

        // Direction: LTR hinges on the RIGHT edge, RTL on the LEFT (mirrored).
        const rtl = getComputedStyle(el).direction === 'rtl';
        // Hinge on the trailing edge; the cover lifts UP toward the viewer (positive
        // for LTR) so it peels off the page — matching the cast contact shadow.
        const openDeg = rtl ? -112 : 112;
        const specFrom = rtl ? 180 : -80;
        const specTo = rtl ? -80 : 180;
        el.style.setProperty('--hinge-dir', rtl ? 'left' : 'right');

        // Closed cover = the dark world covering the warm page.
        gsap.set(cover, { transformOrigin: rtl ? 'left center' : 'right center', rotateY: 0 });
        // Paper-thickness edge extrudes behind the free (lifting) edge.
        if (edge) {
          gsap.set(edge, {
            transformOrigin: rtl ? '100% 50%' : '0% 50%',
            rotateY: rtl ? 90 : -90,
          });
        }
        gsap.set(shade, { opacity: 0.16 });
        gsap.set(spec, { xPercent: specFrom, autoAlpha: 0 });
        gsap.set(contact, {
          transformOrigin: rtl ? 'left center' : 'right center',
          opacity: 0.55,
          scaleX: 1,
        });
        // Title words rise into place (2D only — a 3D flip fights background-clip:text).
        // Cards set BACK in 3D so they lay down onto the page.
        gsap.set(words, { autoAlpha: 0, yPercent: 100 });
        gsap.set(cards, { autoAlpha: 0, y: 90, scale: 0.94, rotate: 2, rotationX: 16 });
        gsap.set(ornament, { autoAlpha: 0, scaleX: 0.3 });

        // Active-card spotlight during the open hold.
        let active = -1;
        const setActive = (idx: number) => {
          if (idx === active) return;
          active = idx;
          cards.forEach((c, i) => c.toggleAttribute('data-active', i === idx));
        };

        // ── One scrubbed master timeline: OPEN → title → cards → hold → CLOSE ──
        // ScrollTrigger OWNS the pin (pinType 'transform', never fixed → no glitch
        // under the page-transition ancestor) and sizes the pin-spacer to the exact
        // scroll distance, so there is never leftover empty space around the section.
        // The pin (+=190%) gives the fold room to complete well inside the pinned range
        // and keeps per-pixel motion gentle; the warm paper still holds for most of the
        // scroll. A low scrub keeps the fold locked to the scroll at both handoffs.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: '+=190%',
            pin: stage ?? true,
            pinType: 'transform',
            // `scrub` is a CATCH-UP LAG, but pin engage/release is instant at the
            // boundary — so a large value desynchronises the two and the section
            // unpins while the cover is still mid-fold. 0.5 still smooths the
            // stepped native wheel (there is no Lenis smoothing) without the fold
            // visibly trailing the scroll at the handoff.
            scrub: 0.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // Spotlight walks the cards only while the book is held open. Measured in
              // TIMELINE TIME, not scroll progress, so these bounds stay aligned with the
              // tween positions below even when the timeline's total duration changes.
              const p = self.progress * tl.totalDuration();
              const lo = 0.5;
              const hi = 0.9;
              if (p < lo || p > hi) return;
              const idx = Math.min(
                cards.length - 1,
                Math.floor(((p - lo) / (hi - lo)) * cards.length),
              );
              setActive(idx);
            },
          },
        });

        // OPEN — the page peels from the FIRST pixel of scroll (power2.out moves
        // immediately, no flat/static-dark start), lifting off the page as it opens.
        tl.to(
          cover,
          { rotateY: openDeg, z: 60, yPercent: -2, ease: 'power2.out', duration: 0.26 },
          0,
        );
        // Crease inner-shadow deepens through the bend, then clears as it flattens.
        tl.to(shade, { opacity: 0.55, ease: 'power1.inOut', duration: 0.13 }, 0);
        tl.to(shade, { opacity: 0, ease: 'power1.in', duration: 0.13 }, 0.13);
        // Specular highlight sweeps across the folding edge.
        tl.to(spec, { autoAlpha: 0.9, duration: 0.05, ease: 'sine.out' }, 0.02);
        tl.to(spec, { xPercent: specTo, ease: 'sine.inOut', duration: 0.22 }, 0.02);
        tl.to(spec, { autoAlpha: 0, duration: 0.07, ease: 'sine.in' }, 0.21);
        // Contact shadow beneath the lifting page shrinks toward the spine and fades.
        tl.to(contact, { opacity: 0, scaleX: 0.3, ease: 'power2.in', duration: 0.26 }, 0);

        // TITLE sets onto the open page — words rise into place (0.24 → 0.38).
        tl.to(
          words,
          { autoAlpha: 1, yPercent: 0, ease: 'power3.out', duration: 0.14, stagger: 0.045 },
          0.24,
        );
        // Diamond divider draws outward under the title.
        tl.to(ornament, { autoAlpha: 1, scaleX: 1, ease: 'power2.out', duration: 0.1 }, 0.3);

        // CARDS lay down onto the page one by one, with a soft settle (0.3 → 0.52).
        tl.to(
          cards,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            rotationX: 0,
            ease: 'back.out(1.5)',
            duration: 0.2,
            stagger: 0.055,
          },
          0.3,
        );

        // HOLD open + readable (0.52 → 0.9) — most of the pin: the chapter breathes.

        // LEAVE — cards lift back off, then the cover closes to the dark world (0.9 → 1).
        tl.to(
          cards,
          {
            autoAlpha: 0,
            y: -32,
            scale: 0.97,
            rotationX: 12,
            ease: 'power2.in',
            duration: 0.05,
            stagger: 0.025,
          },
          0.9,
        );
        tl.to(words, { autoAlpha: 0, yPercent: -60, ease: 'power2.in', duration: 0.04 }, 0.91);
        tl.to(contact, { opacity: 0.55, scaleX: 1, ease: 'power2.out', duration: 0.1 }, 0.92);
        tl.to(shade, { opacity: 0.42, ease: 'power1.inOut', duration: 0.05 }, 0.93);
        tl.to(shade, { opacity: 0.16, ease: 'power1.in', duration: 0.05 }, 0.98);
        tl.to(
          spec,
          { autoAlpha: 0.7, xPercent: specFrom, ease: 'sine.inOut', duration: 0.06 },
          0.92,
        );
        tl.to(spec, { autoAlpha: 0, duration: 0.04 }, 0.99);
        tl.to(cover, { rotateY: 0, z: 0, yPercent: 0, ease: 'power2.inOut', duration: 0.1 }, 0.92);

        // SETTLE — an empty trailing tween that only extends the timeline. ScrollTrigger
        // maps scroll 0→1 onto totalDuration, so without this the final tween lands
        // exactly ON the unpin point and the section detaches the same frame the cover
        // stops moving. This reserves the last ~7% of the pin as a fully-closed dark
        // cover, identical to the section's unpinned state, so the release is invisible.
        tl.to({}, { duration: 0.08 }, 1.03);

        // Reconcile ScrollTrigger with the page-transition ancestor once its blur/lift
        // has settled, so start/end land at the right scroll offsets.
        const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 700);

        // Per-card cursor tilt + light (fine pointers).
        if (window.matchMedia('(pointer: fine)').matches) {
          cards.forEach((card) => {
            const inner = card.querySelector<HTMLElement>('[data-inner]');
            if (!inner) return;
            const rx = gsap.quickTo(inner, 'rotationX', { duration: 0.5, ease: 'power3' });
            const ry = gsap.quickTo(inner, 'rotationY', { duration: 0.5, ease: 'power3' });
            const move = (e: PointerEvent) => {
              const r = card.getBoundingClientRect();
              const cx = (e.clientX - r.left) / r.width - 0.5;
              const cy = (e.clientY - r.top) / r.height - 0.5;
              ry(cx * 9);
              rx(-cy * 9);
              inner.style.setProperty('--cx', `${(cx + 0.5) * 100}%`);
              inner.style.setProperty('--cy', `${(cy + 0.5) * 100}%`);
            };
            const leave = () => {
              rx(0);
              ry(0);
            };
            card.addEventListener('pointermove', move);
            card.addEventListener('pointerleave', leave);
            cleanups.push(() => {
              card.removeEventListener('pointermove', move);
              card.removeEventListener('pointerleave', leave);
            });
          });
        }

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
          window.clearTimeout(refresh);
          cleanups.forEach((fn) => fn());
        };
      });

      return () => {
        el.removeEventListener('pointermove', onMove);
        if (frame) cancelAnimationFrame(frame);
        mm.revert();
      };
    },
    { scope: root, dependencies: [reduce] },
  );

  return (
    <section ref={root} className={styles.scene}>
      <div className={styles.stage} data-stage>
        {/* ── The warm page underneath — revealed only by the fold ───────────── */}
        <div className={styles.warm}>
          <span className={styles.wGray} aria-hidden="true" />
          <span className={styles.wMesh} aria-hidden="true" />
          <span className={styles.wRadial} aria-hidden="true" />
          <span className={styles.wLeak} aria-hidden="true" />
          <span className={styles.wVignette} aria-hidden="true" />
          <span className={styles.wPaper} aria-hidden="true" />
          <div className={styles.wDust} aria-hidden="true">
            {Array.from({ length: DUST }).map((_, i) => (
              <span key={i} className={styles.dust} />
            ))}
          </div>

          <Container className={styles.inner}>
            <h2 className={styles.title} data-vtitle>
              {renderTitleWords(heading)}
            </h2>
            <div className={styles.ornament} data-ornament aria-hidden="true">
              <span className={styles.ornamentGem} />
            </div>
            <div className={styles.cardStage}>
              {items.map((value, index) => (
                <div key={index} className={cn(styles.cardWrap, CARD_POS[index % CARD_POS.length])}>
                  <article data-vcard className={styles.card}>
                    <div data-inner className={styles.cardInner}>
                      <span className={styles.icon} aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          {VALUE_ICONS[index % VALUE_ICONS.length]}
                        </svg>
                      </span>
                      <h3 className={styles.cardTitle}>{value.title}</h3>
                      <p className={styles.cardBody}>{value.body}</p>
                      <span className={styles.cardArrow} aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </Container>
        </div>

        {/* ── Contact shadow the lifting cover casts on the page beneath ──────── */}
        <div className={styles.contact} data-contact aria-hidden="true" />

        {/* ── The hardcover — folds open in 3D, hinged on the trailing edge ───── */}
        <div className={styles.cover} data-cover aria-hidden="true">
          <div className={styles.coverFace}>
            <span className={styles.darkBase} />
            <span className={styles.darkOrange} />
            <div className={styles.darkParticles}>
              {Array.from({ length: DARK_PARTICLES }).map((_, i) => (
                <span key={i} className={styles.darkParticle} />
              ))}
            </div>
            <span className={styles.darkGrain} />
            <span className={styles.coverShade} data-shade />
            <span className={styles.specular} data-spec />
          </div>
          <div className={styles.coverBack} />
          <span className={styles.coverEdge} data-edge />
        </div>
      </div>
    </section>
  );
}
