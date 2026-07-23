'use client';

import { useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { useTranslations } from 'next-intl';
import { onLandingNavState, type LandingNavState } from '@/lib/motion/landing-signal';
import { cn } from '@/lib/utils/cn';
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
 * and more blurred, but stays pinned at the top of every page — it never hides on
 * scroll. The outer <header> is sticky (in-flow) so there is no overlap or layout
 * shift; only the pill inside is the visible surface. The one exception is the
 * landing intro, where the WebGL hero drives it off-screen and slides it in on the
 * capture (via the landing nav signal).
 *
 * Motion: interactive/layout animation via Framer Motion (active pill, language
 * indicator, CTA); MotionConfig reducedMotion="user" makes all of it honour the
 * OS preference. Scroll state is a rAF-throttled native-scroll listener.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  // Landing override: the WebGL hero drives the navbar over its intro/capture (design's
  // header-on-scroll). null everywhere else → the navbar is simply always visible.
  const [navOverride, setNavOverride] = useState<LandingNavState>(null);
  const tUi = useTranslations('ui');

  useEffect(() => onLandingNavState(setNavOverride), []);

  // Track only the "scrolled" condense state — the navbar stays pinned at all times
  // (no hide-on-scroll), so there's no scroll-direction bookkeeping here anymore.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        setScrolled(window.scrollY > 8);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  // The navbar is always visible; only the landing intro hides it ('hide' through the
  // cinematic, 'show' as the hero reveals). A normal scroll-down never hides it.
  const effectiveHidden = navOverride === 'hide';

  return (
    <MotionConfig reducedMotion="user">
      <header className={cn(styles.header, effectiveHidden && styles.hidden)}>
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
