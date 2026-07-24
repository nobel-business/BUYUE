'use client';

import { Fragment, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/motion/gsap';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/layout/Container';
import { Icon } from '@/components/ui/Icon';
import { Magnetic } from '@/lib/motion/Magnetic';
import type { AccordionItem } from '@/components/ui/Accordion';
import { endsSentence } from '@/lib/utils/sentences';
import styles from './FaqSection.module.css';

type FaqSectionProps = {
  heading: string;
  items: AccordionItem[];
  ctaLabel: string;
  ctaHref: string;
};

/**
 * Premium FAQ — a glass "spotlight cards" scene, shared by About / Services /
 * Clients so every FAQ on the site reads as one component.
 *
 * Accessible disclosure: real <button> triggers with aria-expanded/aria-controls,
 * a labelled region panel, and `inert` when collapsed so hidden answers stay out
 * of the tab + AT order. Content is verbatim — the heading, every question/answer
 * and the full CTA label render exactly as supplied.
 *
 * Motion (GSAP + ScrollTrigger, transform/opacity/filter only, reduced-motion safe):
 *   entrance   — title words reveal (blur→sharp), then cards stagger up;
 *   open/close — grid-rows height + the answer's words cascade in line by line;
 *   hover      — lift + accent glow + a cursor-tracking light and a one-pass sheen.
 *
 * `heading` and `ctaLabel` are plain strings, not ReactNode: the heading is split
 * into words at runtime for the reveal, which needs flat text content.
 */
export function FaqSection({ heading, items, ctaLabel, ctaHref }: FaqSectionProps) {
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set());
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (reduce || !root) return;

      // Split the title into words (Arabic-safe — never characters) for the reveal.
      const title = root.querySelector<HTMLElement>('[data-faq-title]');
      let words: HTMLElement[] = [];
      if (title && title.dataset.split !== 'true') {
        const tokens = (title.textContent ?? '').split(/(\s+)/);
        title.textContent = '';
        for (const token of tokens) {
          if (token.length === 0) continue;
          if (/^\s+$/.test(token)) {
            title.appendChild(document.createTextNode(token));
            continue;
          }
          const span = document.createElement('span');
          span.textContent = token;
          span.style.display = 'inline-block';
          span.style.willChange = 'transform, opacity, filter';
          title.appendChild(span);
          words.push(span);
        }
        title.dataset.split = 'true';
      } else if (title) {
        words = Array.from(title.querySelectorAll<HTMLElement>('span'));
      }

      const cards = gsap.utils.toArray<HTMLElement>('[data-faq-card]', root);
      gsap.set(words, { autoAlpha: 0, yPercent: 40, filter: 'blur(6px)' });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 78%', once: true },
      });
      tl.to(words, {
        autoAlpha: 1,
        yPercent: 0,
        filter: 'blur(0px)',
        duration: 0.6,
        stagger: 0.035,
        ease: 'power3.out',
        onComplete: () => {
          for (const word of words) word.style.willChange = 'auto';
        },
      });
      if (cards.length) {
        tl.fromTo(
          cards,
          { autoAlpha: 0, y: 34, filter: 'blur(6px)' },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            clearProps: 'filter',
          },
          '-=0.3',
        );
      }
    },
    { scope: rootRef, dependencies: [reduce] },
  );

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const trackPointer = (event: PointerEvent<HTMLLIElement>) => {
    if (reduce) return;
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    el.style.setProperty('--my', `${event.clientY - rect.top}px`);
  };

  return (
    <section className={styles.scene}>
      <span className={styles.glow} aria-hidden="true" />
      <Container size="wide" className={styles.container}>
        <div ref={rootRef}>
          <h2 className={styles.title} data-faq-title>
            {heading}
          </h2>

          <ul className={styles.list}>
            {items.map((item, index) => {
              const isOpen = open.has(item.id);
              const triggerId = `${item.id}-trigger`;
              const panelId = `${item.id}-panel`;
              return (
                <li
                  key={item.id}
                  data-faq-card
                  className={styles.card}
                  data-open={isOpen}
                  onPointerMove={trackPointer}
                >
                  <span className={styles.spot} aria-hidden="true" />
                  <span className={styles.sheen} aria-hidden="true" />
                  <h3 className={styles.head}>
                    <button
                      type="button"
                      id={triggerId}
                      className={styles.trigger}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(item.id)}
                    >
                      <span className={styles.index} aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className={styles.question}>{item.question}</span>
                      <span className={styles.icon} aria-hidden="true">
                        <i />
                        <i />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    className={styles.panel}
                    inert={!isOpen}
                  >
                    <div className={styles.panelInner}>
                      <p className={styles.answer}>
                        {typeof item.answer === 'string'
                          ? (() => {
                              const words = item.answer.split(/\s+/).filter(Boolean);
                              return words.map((word, wi) => (
                                <Fragment key={wi}>
                                  <span
                                    className={styles.word}
                                    style={{ '--wi': wi } as CSSProperties}
                                  >
                                    {word}
                                  </span>
                                  {/* One sentence per line: break after a sentence-ending
                                      word instead of emitting the usual space. */}
                                  {endsSentence(word) && wi < words.length - 1 ? <br /> : ' '}
                                </Fragment>
                              ));
                            })()
                          : item.answer}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className={styles.cta}>
            <Magnetic>
              <Link href={ctaHref} className={styles.ctaBtn}>
                <span className={styles.ctaLabel}>{ctaLabel}</span>
                <Icon name="arrow-right" size={20} flipRtl className={styles.ctaArrow} />
              </Link>
            </Magnetic>
          </div>
        </div>
      </Container>
    </section>
  );
}
