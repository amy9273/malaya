import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppHeader } from '@/components/layout/app-header';
import { BottomNav } from '@/components/layout/bottom-nav';

export const metadata: Metadata = {
  title: {
    default: 'Malaya — Mobile Webtoon & Manhwa Reader',
    template: '%s | Malaya',
  },
  description:
    'A high-performance, mobile-first webtoon reader with continuous vertical streaming, MangaDex integration, and cloud progress tracking.',
  applicationName: 'Malaya',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Malaya',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#08090C',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-surface-canvas font-sans text-foreground antialiased selection:bg-brand-primary/30">
        <div className="relative flex min-h-screen flex-col">
          <AppHeader />
          <main className="flex-1 pb-20 md:pb-8">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
