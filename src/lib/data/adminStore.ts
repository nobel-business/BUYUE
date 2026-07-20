import { promises as fs } from 'fs';
import path from 'path';
import { clientLogos } from './clients';

/**
 * INTERIM ADMIN DATA STORE (dev scaffold — audit C-02).
 *
 * A local JSON file read/written via fs. This lets the admin panel manage
 * client logos + testimonials and have them reflect on the public Clients page.
 *
 * ⚠ NOT PRODUCTION: no auth, no database, and fs writes don't work on
 * serverless hosting. Replace with the real backend + auth once chosen (C-02).
 */
export type StoredTestimonial = { id: string; quote: string; author: string; role?: string };
export type AdminStore = { logos: string[]; testimonials: StoredTestimonial[] };

const STORE_PATH = path.join(process.cwd(), 'data', 'admin-store.json');

const seed: AdminStore = { logos: [...clientLogos], testimonials: [] };

export async function getStore(): Promise<AdminStore> {
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<AdminStore>;
    return {
      logos: Array.isArray(parsed.logos) ? parsed.logos : seed.logos,
      testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : [],
    };
  } catch {
    return { logos: [...seed.logos], testimonials: [] };
  }
}

export async function saveStore(store: AdminStore): Promise<void> {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
}
