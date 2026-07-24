'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Link } from '@/i18n/navigation';
import { Image } from '@/components/ui/Image';
import { Icon } from '@/components/ui/Icon';
import { Magnetic } from '@/lib/motion/Magnetic';
import { SceneReveal } from '@/lib/motion/SceneReveal';
import { duration, easing } from '@/lib/motion/tokens';
import { cn } from '@/lib/utils/cn';
import styles from './ServiceShowcase.module.css';

export type ShowcaseService = {
  /** Stable id — links the tab to its panel. */
  id: string;
  /** Service name — the left-column label (verbatim, Doc 02). */
  title: string;
  /** One-line lead shown in the content column (verbatim). */
  intro: string;
  /** The offerings list — the service's deliverables (verbatim). */
  offerings: string[];
  /** The closing value line (verbatim). */
  value: string;
  /**
   * Large supporting image (centre column). OPTIONAL: a branded panel stands in
   * when absent. Wire real paths in `SERVICE_IMAGES` in the services page (C-11).
   */
  image?: string;
  imageAlt?: string;
};

type ServiceShowcaseProps = {
  eyebrow?: string;
  /** Section heading (approved copy). */
  heading: string;
  /** Label for the value line, e.g. "القيمة" (approved copy). */
  valueLabel: string;
  services: ShowcaseService[];
  ctaLabel: string;
  ctaHref: string;
};

/**
 * SERVICE SHOWCASE — a two-column selector structured after the reference
 * (above-limits.com/service): the service names (start column) and a PANEL (end
 * column) whose image is anchored top-start at ~half the panel width with the text
 * inset over it, offerings 2-up, then the CTA. Selecting a service cross-dissolves
 * the image and the content in step; exactly one service is active.
 *
 * The section heading occupies its own grid row, so the panel starts level with the
 * FIRST SERVICE NAME rather than with the heading above it.
 *
 * A11y: WAI-ARIA tabs with automatic activation (hover, focus, arrow keys select).
 * Arrow math derives from the FOCUSED tab (not the hover-mutated active index), and
 * mirrors for RTL. The panel's text side is the tabpanel. Reveals use SceneReveal
 * (SSR-visible); every transition collapses to instant under prefers-reduced-motion.
 */
export function ServiceShowcase({
  eyebrow,
  heading,
  valueLabel,
  services,
  ctaLabel,
  ctaHref,
}: ServiceShowcaseProps) {
  const [active, setActive] = useState(0);
  const shouldReduce = useReducedMotion();
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeService = services[active];
  if (!activeService) return null;

  const tabId = (i: number) => `${baseId}-tab-${i}`;
  const panelId = `${baseId}-panel`;

  // Arrow-key nav from the FOCUSED tab (never the hover-mutated `active`), mirrored
  // for RTL so ArrowLeft is always "reading-backward".
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, from: number) => {
    const rtl = event.currentTarget.closest('[dir="rtl"]') !== null;
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const backward = rtl ? 'ArrowRight' : 'ArrowLeft';
    let next: number | null = null;

    if (event.key === 'ArrowDown' || event.key === forward) next = (from + 1) % services.length;
    else if (event.key === 'ArrowUp' || event.key === backward)
      next = (from - 1 + services.length) % services.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = services.length - 1;

    if (next !== null) {
      event.preventDefault();
      setActive(next);
      tabRefs.current[next]?.focus();
    }
  };

  const panelTransition = shouldReduce
    ? { duration: 0 }
    : { duration: duration.medium, ease: easing.outSoft };
  const indicatorTransition = shouldReduce
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 320, damping: 34, mass: 0.9 };
  const exitTransition = shouldReduce
    ? { duration: 0 }
    : { opacity: { duration: duration.fast, ease: easing.standard } };

  return (
    <SceneReveal variant="rise" className={styles.grid}>
      {/* ── Row 1: the section heading, names column only. Keeping it in its own row
          is what lets the panel below start level with the first service name. ─── */}
      {(eyebrow || heading) && (
        <div className={styles.head}>
          {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
          <h2 className={styles.heading}>{heading}</h2>
        </div>
      )}

      {/* ── Row 2, start column: the service names (tablist) ──────────────────── */}
      <div role="tablist" aria-label={heading} className={styles.list}>
        {services.map((service, i) => {
          const selected = i === active;
          return (
            <button
              key={service.id}
              ref={(node) => {
                tabRefs.current[i] = node;
              }}
              type="button"
              role="tab"
              id={tabId(i)}
              aria-selected={selected}
              aria-controls={selected ? panelId : undefined}
              tabIndex={selected ? 0 : -1}
              className={cn(styles.item, selected && styles.itemActive)}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onKeyDown={(event) => onKeyDown(event, i)}
            >
              {selected && (
                <motion.span
                  layoutId={shouldReduce ? undefined : `${baseId}-indicator`}
                  className={styles.indicator}
                  aria-hidden="true"
                  transition={indicatorTransition}
                />
              )}
              <span className={styles.itemLabel}>{service.title}</span>
            </button>
          );
        })}
      </div>

      {/* ── Row 2, end column: the PANEL — image anchored top-start at ~half the
          panel width, text inset over it (reference `.serv-box`/`.serv-content`). ── */}
      <div className={styles.panel}>
        {/* Chamfered image (cross-dissolves in step). */}
        <div className={styles.media}>
          <div className={styles.mediaFrame}>
            <AnimatePresence initial={false}>
              <motion.div
                key={activeService.id}
                className={styles.mediaLayer}
                initial={shouldReduce ? false : { opacity: 0, scale: 1.03, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, transition: exitTransition }}
                transition={panelTransition}
              >
                {activeService.image ? (
                  <Image
                    src={activeService.image}
                    alt={activeService.imageAlt ?? activeService.title}
                    ratio="3 / 2"
                    rounded="none"
                    sizes="(max-width: 860px) 92vw, 31vw"
                    className={styles.image}
                  />
                ) : (
                  <div className={styles.placeholder} role="img" aria-label={activeService.title}>
                    <span className={styles.placeholderMark} aria-hidden="true" />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── The detail content (tabpanel; cross-dissolves in step) ───────────── */}
        <div
          id={panelId}
          role="tabpanel"
          aria-labelledby={tabId(active)}
          tabIndex={0}
          className={styles.content}
        >
          <div className={styles.contentStack}>
            <AnimatePresence initial={false}>
              <motion.div
                key={activeService.id}
                className={styles.contentLayer}
                initial={shouldReduce ? false : { opacity: 0, y: 12, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, transition: exitTransition }}
                transition={panelTransition}
              >
                {/* No title here — the service name is the active item in the list
                  (this panel is aria-labelledby that item), so repeating it would
                  duplicate it, matching the reference. */}
                <p className={styles.lead}>{activeService.intro}</p>

                <ul className={styles.offerings}>
                  {activeService.offerings.map((offering, oi) => (
                    <li key={oi} className={styles.offering}>
                      <Icon name="arrow-right" size={16} flipRtl className={styles.offeringMark} />
                      <span>{offering}</span>
                    </li>
                  ))}
                </ul>

                <div className={styles.value}>
                  <span className={styles.valueLabel}>{valueLabel}</span>
                  <p className={styles.valueText}>{activeService.value}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={styles.cta}>
            <Magnetic>
              <Link href={ctaHref} className={styles.ctaButton}>
                <span className={styles.ctaLabel}>{ctaLabel}</span>
                <Icon name="arrow-right" size={18} flipRtl className={styles.ctaArrow} />
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </SceneReveal>
  );
}
