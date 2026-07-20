import { NextResponse } from 'next/server';

/**
 * Contact form submission endpoint — STUB (audit C-09).
 *
 * Validates the payload and returns success, but does NOT yet deliver the lead.
 * BEFORE LAUNCH this must be wired to the real destination (email/CRM) with:
 *   - server-side spam protection (e.g. reCAPTCHA / rate limiting),
 *   - PDPL-compliant handling + a consent record,
 *   - the confirmed recipient (audit C-08 — email/domain unconfirmed).
 */
export async function POST(request: Request) {
  const data = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  const isNonEmptyString = (value: unknown): value is string =>
    typeof value === 'string' && value.trim().length > 0;

  if (
    !data ||
    !isNonEmptyString(data.name) ||
    !isNonEmptyString(data.email) ||
    !isNonEmptyString(data.message)
  ) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Honeypot: pretend success without processing.
  if (typeof data.website === 'string' && data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  // TODO(C-09): deliver the lead to the real destination here.
  return NextResponse.json({ ok: true });
}
