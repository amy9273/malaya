import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Malaya — Mobile Webtoon & Manhwa Reader',
    short_name: 'Malaya',
    description: 'High-performance, zero-gap vertical webtoon and manhwa reader.',
    start_url: '/',
    display: 'standalone',
    background_color: '#08090C',
    theme_color: '#08090C',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
