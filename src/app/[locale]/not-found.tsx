/**
 * Localized 404 scaffold (Doc 09 §25, Doc 10 §"404 State").
 *
 * PHASE 1: minimal, accessible, on-brand shell. The final branded 404 — with
 * approved copy and routes back to key pages — is completed in a later phase.
 * The global (unmatched-locale) 404 refinement is flagged for Phase 10 assembly.
 */
export default function NotFound() {
  return (
    <main id="main-content">
      <section
        style={{
          minBlockSize: '60svh',
          display: 'grid',
          placeItems: 'center',
          paddingInline: '1.25rem',
          textAlign: 'center',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', marginBlockEnd: '0.5rem' }}>404</h1>
          <p style={{ opacity: 0.7 }}>Page not found.</p>
        </div>
      </section>
    </main>
  );
}
