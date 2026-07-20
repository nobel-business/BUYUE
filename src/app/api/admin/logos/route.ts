import { NextResponse } from 'next/server';
import { getStore, saveStore } from '@/lib/adminStore';

// Add a client logo (by name). Dev scaffold — no auth (audit C-02).
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { name?: unknown } | null;
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  if (!name) return NextResponse.json({ ok: false }, { status: 400 });

  const store = await getStore();
  if (!store.logos.includes(name)) store.logos.push(name);
  await saveStore(store);
  return NextResponse.json(store);
}

// Remove a client logo (by name).
export async function DELETE(request: Request) {
  const body = (await request.json().catch(() => null)) as { name?: unknown } | null;
  const name = typeof body?.name === 'string' ? body.name : '';
  const store = await getStore();
  store.logos = store.logos.filter((logo) => logo !== name);
  await saveStore(store);
  return NextResponse.json(store);
}
