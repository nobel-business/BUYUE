import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Locale-aware navigation APIs (next-intl). Use these instead of next/link and
 * next/navigation so every internal link keeps the active locale + prefix.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
