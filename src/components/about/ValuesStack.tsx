'use client';

import { useRef, type CSSProperties } from 'react';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/motion/gsap';
import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/typography/Typography';
import { FeatureCard } from '@/components/Card/FeatureCard';
import styles from './ValuesStack.module.css';

type ValueItem = { title: string; body: string };

/* Per-card personality — a distinct brand hue drives each card's ghost number,
   cursor light and border glow (brand palette only; no new colours). */
const ACCENTS = [
  'var(--color-bonfire-flame)',
  'var(--color-quilt-gold)',
  'var(--color-lime-taffy)',
  'var(--color-bonfire-flame)',
];

/**
 * Values as a pinned stacked-card sequence (content verbatim — same FeatureCards as
 * before, only re-staged). A CSS-sticky stage (no fixed-pin) holds while a scrubbed
 * timeline moves through the cards one step at a time: the current card lifts up and
 * scales back as the next scales into focus — transform-led, never a plain fade. The
 * active (visible) card tilts toward the cursor and carries a cursor-follow light and
 * border glow; hidden cards are visibility:hidden so only the focused one is hoverable.
 *
 * Channel safety: the scrub owns each `.card` (outer) transform; the tilt owns the
 * `.cardInner` rotation — different elements, so they never fight. Desktop-only
 * (matchMedia); mobile & reduced motion render every card in a calm static column.
 */
export function ValuesStack({ heading, items }: { heading: string; items: ValueItem[] }) {
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useGSAP(
    () => {
      const el = root.current;
      if (reduce || !el) return;

      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px)', () => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-card]', el);
        if (cards.length === 0) return;

        const [first, ...rest] = cards;
        if (!first) return;
        gsap.set(first, { yPercent: 0, scale: 1, autoAlpha: 1 });
        gsap.set(rest, { yPercent: 16, scale: 0.9, autoAlpha: 0 });

        const n = cards.length;
        const seg = 1 / n;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
        });
        for (let i = 0; i < n - 1; i += 1) {
          const cur = cards[i];
          const nxt = cards[i + 1];
          if (!cur || !nxt) continue;
          const at = (i + 1) * seg - seg * 0.5;
          tl.to(
            cur,
            { yPercent: -14, scale: 0.9, autoAlpha: 0, duration: seg * 0.7, ease: 'power2.inOut' },
            at,
          );
          tl.to(
            nxt,
            { yPercent: 0, scale: 1, autoAlpha: 1, duration: seg * 0.7, ease: 'power2.inOut' },
            at,
          );
        }

        // Cursor tilt + light on whichever card is in focus (hidden ones can't be hit).
        const cleanups: Array<() => void> = [];
        cards.forEach((card) => {
          const inner = card.querySelector<HTMLElement>('[data-inner]');
          if (!inner) return;
          const rx = gsap.quickTo(inner, 'rotationX', { duration: 0.5, ease: 'power3' });
          const ry = gsap.quickTo(inner, 'rotationY', { duration: 0.5, ease: 'power3' });
          const onMove = (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            ry(px * 6);
            rx(-py * 6);
            card.style.setProperty('--mx', `${(px + 0.5) * 100}%`);
            card.style.setProperty('--my', `${(py + 0.5) * 100}%`);
          };
          const onLeave = () => {
            rx(0);
            ry(0);
          };
          card.addEventListener('pointermove', onMove);
          card.addEventListener('pointerleave', onLeave);
          cleanups.push(() => {
            card.removeEventListener('pointermove', onMove);
            card.removeEventListener('pointerleave', onLeave);
          });
        });
        return () => cleanups.forEach((fn) => fn());
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [reduce] },
  );

  return (
    <section
      ref={root}
      className={styles.scene}
      style={{ '--count': items.length } as CSSProperties}
    >
      <div className={styles.sticky}>
        <Container>
          <header className={styles.head}>
            <Heading level={2}>{heading}</Heading>
          </header>
          <div className={styles.stack}>
            {items.map((item, index) => (
              <article
                key={index}
                data-card
                className={styles.card}
                style={{ '--accent': ACCENTS[index % ACCENTS.length] } as CSSProperties}
              >
                <span className={styles.ghost} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div data-inner className={styles.cardInner}>
                  <span className={styles.light} aria-hidden="true" />
                  <FeatureCard title={item.title} index={index + 1}>
                    {item.body}
                  </FeatureCard>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
