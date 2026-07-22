'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { onLandingSceneRunning } from '@/lib/motion/landing-signal';
import { cn } from '@/lib/utils/cn';
import styles from './HomeHero.module.css';

type HomeHeroProps = {
  /** Heading; wrap the highlighted portion in [[ ]] (e.g. "We Sell [[Results,]] Not…"). */
  heading: string;
  sub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaPrimaryHref: string;
  ctaSecondaryHref: string;
  /** Arabic → whole-word spans (preserve cursive joining); Latin → per-character. */
  rtl: boolean;
};

/**
 * Builds the design headline structure. The scene (LandingScene, in the layout) reveals
 * it by adding `.in` to #head; the per-token `.ltr` spans then stagger in via
 * transition-delay — reproducing the design's buildHead() exactly for Latin (word →
 * per-character `.ltr`, staggered idx*0.05s). Arabic splits per WORD only, so intra-word
 * letter joining is never broken. The highlighted [[ ]] segment gets `.hi`.
 */
function renderHead(heading: string, rtl: boolean): ReactNode[] {
  const parts: { text: string; hi: boolean }[] = [];
  const re = /\[\[(.+?)\]\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(heading))) {
    if (m.index > last) parts.push({ text: heading.slice(last, m.index), hi: false });
    parts.push({ text: m[1]!, hi: true });
    last = re.lastIndex;
  }
  if (last < heading.length) parts.push({ text: heading.slice(last), hi: false });

  const nodes: ReactNode[] = [];
  let idx = 0;
  let key = 0;
  for (const part of parts) {
    for (const w of part.text.split(/(\s+)/)) {
      if (w.length === 0) continue;
      if (/^\s+$/.test(w)) {
        nodes.push(<span key={key++}>{w}</span>);
        continue;
      }
      if (rtl) {
        nodes.push(
          <span
            key={key++}
            className={part.hi ? 'word ltr hi' : 'word ltr'}
            style={{ transitionDelay: `${idx++ * 0.05}s` }}
          >
            {w}
          </span>,
        );
      } else {
        const chars = [...w].map((ch, ci) => (
          <span key={ci} className="ltr" style={{ transitionDelay: `${idx++ * 0.05}s` }}>
            {ch}
          </span>
        ));
        nodes.push(
          <span key={key++} className={part.hi ? 'word hi' : 'word'}>
            {chars}
          </span>,
        );
      }
    }
  }
  return nodes;
}

/**
 * Home hero copy — the settled-Hero copy from the Claude Design landing, server-rendered
 * (semantic <h1> for SEO) inside a 250vh stage. The WebGL scene (LandingScene, a truly-
 * fixed layer in the layout) plays behind this transparent stage and REVEALS the copy on
 * scroll-to-capture (adds `.in`). When the scene is running (`onLandingSceneRunning`) the
 * copy switches to its hidden-until-`.in` state and the stage extends to 250vh; otherwise
 * (no WebGL / reduced motion) the copy is a clean, visible static hero. The copy is
 * `position: sticky`, pinned over the fixed scene, matching the design's fixed #copy.
 */
export function HomeHero({
  heading,
  sub,
  ctaPrimary,
  ctaSecondary,
  ctaPrimaryHref,
  ctaSecondaryHref,
  rtl,
}: HomeHeroProps) {
  const [armed, setArmed] = useState(false);
  useEffect(() => onLandingSceneRunning(setArmed), []);

  return (
    <div className={cn(styles.stage, armed && styles.armed)}>
      <div className={styles.pin}>
        <div id="copy" className={styles.copy}>
          <h1 id="head" className={styles.head}>
            {renderHead(heading, rtl)}
          </h1>
          <p id="sub" className={styles.sub}>
            {sub}
          </p>
          <div id="ctas" className={styles.ctas}>
            <Link id="cta1" href={ctaPrimaryHref} className={cn(styles.btn, styles.btnP)}>
              {ctaPrimary}
            </Link>
            <Link id="cta2" href={ctaSecondaryHref} className={cn(styles.btn, styles.btnG)}>
              {ctaSecondary}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
