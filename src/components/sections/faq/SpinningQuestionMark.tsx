import styles from './SpinningQuestionMark.module.css';

/**
 * Decorative "?" that revolves around its own vertical axis — a quiet bridge in
 * the empty band between the final CTA and the FAQ. Display glyph (--font-display)
 * over a soft bonfire glow, spun with a CSS 3D rotateY so it turns endlessly on
 * itself. Purely ornamental: aria-hidden, no interaction, and the spin stops
 * under prefers-reduced-motion (see the module CSS).
 */
export function SpinningQuestionMark() {
  return (
    <div className={styles.band} aria-hidden="true">
      <span className={styles.glow} />
      <span className={styles.stage}>
        <span className={styles.mark}>?</span>
      </span>
    </div>
  );
}
