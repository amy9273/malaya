import Link from 'next/link';
import { BookOpen, Search, Bookmark } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-border bg-surface-canvas/80 backdrop-blur-md pt-safe">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary text-white shadow-md shadow-brand-glow/30">
            <BookOpen className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-foreground">
              Malaya
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Search Manhwa"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border bg-surface-card text-surface-muted transition-colors hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </Link>
          <Link
            href="/library"
            aria-label="Personal Library"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border bg-surface-card text-surface-muted transition-colors hover:text-foreground"
          >
            <Bookmark className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
