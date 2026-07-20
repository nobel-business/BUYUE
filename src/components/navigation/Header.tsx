'use client';

import { useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';
import { Logo } from './Logo';
import { NavLinks } from './NavLinks';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { NavCta } from './NavCta';
import { MobileMenu } from './MobileMenu';
import styles from './Header.module.css';

/**
 * Floating premium navbar (Linear / Vercel / Stripe language). A dark glass
 * "pill" centred over the page. On scroll it condenses, grows more transparent
 * and more blurred, and hides on scroll-down / reappears on scroll-up. The outer
 * <header> stays sticky (in-flow) so there is no overlap or layout shift; only
 * the pill inside is the visible surface.
 *
 * Motion: interactive/layout animation via Framer Motion (active pill, language
 * indicator, CTA); MotionConfig reducedMotion="user" makes all of it honour the
 * OS preference. Scroll state is a rAF-throttled scroll listener (works with the
 * Lenis-driven window scroll).
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const tUi = useTranslations('ui');

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    // Accumulate movement in one direction so momentum/settle jitter from the
    // smooth-scroll engine can't flip hide/show every frame (anti-flicker).
    let acc = 0;
    const THRESHOLD = 12; // px of committed travel before toggling
    const REVEAL_AT = 120; // always show near the top

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - last;
        last = y;
        raf = 0;

        setScrolled(y > 8);

        if (y < REVEAL_AT) {
          setHidden(false);
          acc = 0;
          return;
        }
        // Reset the accumulator whenever the direction changes.
        if ((delta > 0 && acc < 0) || (delta < 0 && acc > 0)) acc = 0;
        acc += delta;

        if (acc > THRESHOLD) {
          setHidden(true); // committed downward → hide
          acc = 0;
        } else if (acc < -THRESHOLD) {
          setHidden(false); // committed upward → reveal
          acc = 0;
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <header className={cn(styles.header, hidden && styles.hidden)}>
        <div className={cn(styles.pill, scrolled && styles.scrolled)}>
          <Logo label={tUi('brandName')} className={styles.logo} />

          <nav className={styles.desktopNav} aria-label={tUi('primaryNav')}>
            <NavLinks />
          </nav>

          <div className={styles.actions}>
            <ThemeToggle className={styles.themeToggle} />
            <LanguageSwitcher className={styles.switcher} />
            <div className={styles.ctaWrap}>
              <NavCta />
            </div>
            <MobileMenu />
          </div>
        </div>
      </header>
    </MotionConfig>
  );
}
