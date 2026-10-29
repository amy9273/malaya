'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Search, Bookmark, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Discover', href: '/', icon: Compass },
  { label: 'Search', href: '/search', icon: Search },
  { label: 'Library', href: '/library', icon: Bookmark },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  // Hide bottom nav inside reader view to maximize screen estate
  if (pathname.startsWith('/read/')) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-surface-border bg-surface-canvas/90 backdrop-blur-lg pb-safe md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 transition-colors',
                isActive
                  ? 'text-brand-primary'
                  : 'text-surface-muted hover:text-foreground',
              )}
            >
              <div
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-lg transition-transform',
                  isActive && 'scale-110',
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
