import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getStore, saveStore } from '@/lib/data/adminStore';

// Add a testimonial. Dev scaffold — no auth (audit C-02).
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    quote?: unknown;
    author?: unknown;
    role?: unknown;
  } | null;
  const quote = typeof body?.quote === 'string' ? body.quote.trim() : '';
  const author = typeof body?.author === 'string' ? body.author.trim() : '';
  const role = typeof body?.role === 'string' ? body.role.trim() : undefined;
  if (!quote || !author) return NextResponse.json({ ok: false }, { status: 400 });

  const store = await getStore();
  store.testimonials.push({ id: randomUUID(), quote, author, role });
  await saveStore(store);
  return NextResponse.json(store);
}

// Remove a testimonial (by id).
export async function DELETE(request: Request) {
  const body = (await request.json().catch(() => null)) as { id?: unknown } | null;
  const id = typeof body?.id === 'string' ? body.id : '';
  const store = await getStore();
  store.testimonials = store.testimonials.filter((testimonial) => testimonial.id !== id);
  await saveStore(store);
  return NextResponse.json(store);
}
