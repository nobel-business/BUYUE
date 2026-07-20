'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/motion/gsap';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/primitives/Container';
import { navItems } from '@/lib/config/nav';
import { Icon } from '@/components/Icon/Icon';
import { Logo } from './Logo';
import styles from './Footer.module.css';

/**
 * Footer — the calm, integrated ending of the site (visual-refinement pass).
 * Full-bleed dark band (edge-to-edge background, content constrained by the
 * shared Container), NOT a floating card: no big radius, no heavy shadow, tight
 * vertical rhythm. Three top-aligned columns (Brand · Quick Links · Contact) +
 * a slim bottom bar (copyright · Sitemap · back-to-top). Language switching
 * lives only in the navbar. Only existing/approved content is used.
 */
export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const shouldReduce = useReducedMotion();
  const t = useTranslations();
  const year = String(new Date().getFullYear());

  useGSAP(
    () => {
      if (shouldReduce || !ref.current) return;
      const q = gsap.utils.selector(ref.current);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true },
        defaults: { ease: 'expo.out' },
      });
      tl.from(q('[data-fx="brand"] > *'), { autoAlpha: 0, y: 16, stagger: 0.06, duration: 0.5 })
        .from(q('[data-fx="col"]'), { autoAlpha: 0, y: 16, stagger: 0.1, duration: 0.5 }, '-=0.3')
        .from(q('[data-fx="bottom"]'), { autoAlpha: 0, y: 12, duration: 0.45 }, '-=0.2')
        .from(
          q('[data-fx="totop"]'),
          { autoAlpha: 0, scale: 0.7, duration: 0.4, ease: 'power3.out' },
          '-=0.2',
        );
    },
    { scope: ref, dependencies: [shouldReduce] },
  );

  const backToTop = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo({ top: 0 });
    } else {
      window.dispatchEvent(new Event('buyue:scroll-top'));
    }
  };

  const phones = t.raw('contact.details.phones') as string[];

  return (
    <footer ref={ref} className={styles.footer}>
      <span className={styles.glow} aria-hidden="true" />
      <Container className={styles.inner}>
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand} data-fx="brand">
            <Logo label={t('ui.brandName')} className={styles.logo} />
            <p className={styles.desc}>{t('ui.parentCompany')}</p>
          </div>

          {/* Quick Links */}
          <nav className={styles.col} data-fx="col" aria-label={t('ui.primaryNav')}>
            <h2 className={styles.colTitle}>
              <span className={styles.dot} aria-hidden="true" />
              {t('ui.primaryNav')}
            </h2>
            <ul className={styles.links}>
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className={styles.link}>
                    <span className={styles.linkArrow} aria-hidden="true">
                      <Icon name="chevron-right" size={13} flipRtl />
                    </span>
                    <span className={styles.linkLabel}>{t(`nav.${item.key}`)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Details */}
          <div className={styles.col} data-fx="col">
            <h2 className={styles.colTitle}>
              <span className={styles.dot} aria-hidden="true" />
              {t('contact.details.heading')}
            </h2>
            <address className={styles.contact}>
              <span className={styles.contactItem}>{t('contact.details.address')}</span>
              <span className={styles.contactPhones}>
                {phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className={styles.contactLink}
                  >
                    {phone}
                  </a>
                ))}
              </span>
              <a href={`mailto:${t('contact.details.email')}`} className={styles.contactLink}>
                {t('contact.details.email')}
              </a>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottom} data-fx="bottom">
          <p className={styles.copyright}>{t('footer.copyright', { year })}</p>
          <div className={styles.bottomActions}>
            <a href="/sitemap.xml" className={styles.metaLink}>
              Sitemap
            </a>
            <button
              type="button"
              className={styles.toTop}
              onClick={backToTop}
              aria-label={t('ui.backToTop')}
              data-fx="totop"
            >
              <Icon name="arrow-up" size={16} />
            </button>
          </div>
        </div>
      </Container>
    </footer>
  );
}
