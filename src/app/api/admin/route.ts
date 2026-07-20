import { NextResponse } from 'next/server';
import { getStore } from '@/lib/data/adminStore';

// Returns the full admin store. Dev scaffold — no auth (audit C-02).
export async function GET() {
  const store = await getStore();
  return NextResponse.json(store);
}
