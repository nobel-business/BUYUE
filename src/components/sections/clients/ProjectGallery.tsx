'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils/cn';
import styles from './ProjectGallery.module.css';

/**
 * Project gallery (Doc 10 §34, Doc 02 §4.3). Each approved category tile shows a real
 * project image or an auto-playing, muted, looping video, with a legibility scrim under
 * the label. Videos are lazy: they load + play only while in view (IntersectionObserver),
 * and reduced-motion visitors get the poster frame, never motion. A tile with no media
 * falls back to the premium tinted placeholder.
 *
 * Media order matches `clients.gallery.categories` (not translatable). Assets live in
 * /public/projects: images are WebP; videos are silent, faststart MP4 with a poster frame.
 */
type Media = { type: 'image'; src: string } | { type: 'video'; src: string; poster: string };

const MEDIA: (Media | null)[] = [
  { type: 'video', src: '/projects/exhibition.mp4', poster: '/projects/exhibition-poster.webp' }, // Exhibition stand
  { type: 'image', src: '/projects/campaign.webp' }, // Campaign
  { type: 'image', src: '/projects/product.webp' }, // Product photography
  { type: 'image', src: '/projects/event.webp' }, // Event
  { type: 'video', src: '/projects/promotional.mp4', poster: '/projects/promotional-poster.webp' }, // Promotional material
  { type: 'video', src: '/projects/outdoor.mp4', poster: '/projects/outdoor-poster.webp' }, // Outdoor execution
];

export function ProjectGallery({ categories }: { categories: string[] }) {
  return (
    <ul className={styles.grid}>
      {categories.map((category, index) => {
        const media = MEDIA[index] ?? null;
        return (
          <li key={category} className={cn(styles.tile, !media && styles[`tint-${index % 4}`])}>
            {media?.type === 'image' && (
              // eslint-disable-next-line @next/next/no-img-element -- static /public asset, sized by CSS
              <img
                className={styles.media}
                src={media.src}
                alt=""
                loading="lazy"
                decoding="async"
                aria-hidden="true"
              />
            )}
            {media?.type === 'video' && <TileVideo src={media.src} poster={media.poster} />}
            <span className={styles.label}>{category}</span>
          </li>
        );
      })}
    </ul>
  );
}

/** Muted, looping video that loads + plays only while on screen; poster-only under reduced motion. */
function TileVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video || shouldReduce) return; // reduced motion → keep the still poster, never play
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [shouldReduce]);

  return (
    <video
      ref={ref}
      className={styles.media}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
