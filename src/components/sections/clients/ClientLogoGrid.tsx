import styles from './ClientLogoGrid.module.css';

/**
 * Client logo wall (Doc 10 §10). Renders text wordmark cells as placeholders
 * until real logo image assets are provided (audit C-11/H-15). Data-driven
 * (admin-managed later — audit C-04).
 */
export function ClientLogoGrid({ names }: { names: readonly string[] }) {
  return (
    <ul className={styles.grid}>
      {names.map((name) => (
        <li key={name} className={styles.cell}>
          <span className={styles.name}>{name}</span>
        </li>
      ))}
    </ul>
  );
}
