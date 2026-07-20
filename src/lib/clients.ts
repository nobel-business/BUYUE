/**
 * Client logo list (Doc 02 §4.2). Brand names are locale-independent, so they
 * live here rather than in the message catalogues.
 *
 * ⚠ FLAGS:
 * - audit H-04: the approved copy claims "أكثر من 30" but only these ~13 are
 *   supplied. Confirm the full canonical list with the client.
 * - audit H-15: usage rights for third-party marks (Vodafone, Coca-Cola,
 *   Red Bull, etc.) must be confirmed before publishing real logos.
 * - audit C-11: real logo image assets are pending; rendered as text wordmarks.
 * This list is data-driven and will be admin-managed (audit C-04).
 */
export const clientLogos: readonly string[] = [
  'Vodafone',
  'Coca-Cola',
  'Red Bull',
  'Talabat',
  'stc',
  'Zain',
  'Foodics',
  'BAVO',
  'Sparx',
  'Al Ahly SC',
  'NAPCO AQUA',
  'MAKKA',
  'Jazeera Paints',
] as const;
