'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { ChapterItem } from '@/lib/mangadex/types';
import { filterAndSortChapters, formatPublishDate } from '@/lib/detail/formatters';
import {
  ArrowDownUp,
  Search,
  BookOpen,
  ChevronRight,
  ExternalLink,
  Layers,
} from 'lucide-react';

interface ChapterListProps {
  chapters: ChapterItem[];
  mangaId: string;
}

export function ChapterList({ chapters, mangaId }: ChapterListProps) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const displayedChapters = useMemo(() => {
    return filterAndSortChapters(chapters, searchQuery, sortOrder);
  }, [chapters, searchQuery, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <section
      id="chapters"
      className="flex flex-col gap-4 rounded-3xl border border-surface-border bg-surface-card/60 p-6 backdrop-blur-sm sm:p-8"
      aria-label="Chapter Feed"
    >
      {/* Header and Controls Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <Layers className="h-5 w-5 text-brand-light" />
          <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            Chapters
          </h2>
          <span className="rounded-full border border-surface-border bg-surface-elevated px-2.5 py-0.5 text-xs font-semibold text-surface-muted">
            {chapters.length}
          </span>
        </div>

        {/* Action Controls: Search & Order Toggle */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-48 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-surface-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter chapters..."
              className="h-10 w-full rounded-xl border border-surface-border bg-surface-elevated/90 pl-8 pr-3 text-xs text-foreground placeholder-surface-muted outline-none transition-colors focus:border-brand-primary"
            />
          </div>

          {/* Sort Order Toggle Button */}
          <button
            type="button"
            onClick={toggleSortOrder}
            title={
              sortOrder === 'desc'
                ? 'Showing latest first (Click for oldest first)'
                : 'Showing oldest first (Click for latest first)'
            }
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-surface-border bg-surface-elevated px-3 py-2 text-xs font-semibold text-foreground transition-all hover:border-surface-muted active:scale-95"
          >
            <ArrowDownUp className="h-3.5 w-3.5 text-brand-light" />
            <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
          </button>
        </div>
      </div>

      {/* Chapters Table / List */}
      {displayedChapters.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-surface-border/60 bg-surface-elevated/40 p-8 text-center">
          <BookOpen className="h-8 w-8 text-surface-muted/60" />
          <p className="mt-2 text-xs text-surface-muted">
            No chapters match &ldquo;{searchQuery}&rdquo;.
          </p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-surface-border/50 overflow-hidden rounded-2xl border border-surface-border/80 bg-surface-elevated/40">
          {displayedChapters.map((chapter) => {
            const isExternal = Boolean(chapter.externalUrl);
            const destinationHref = isExternal
              ? (chapter.externalUrl as string)
              : `/read/${chapter.id}`;

            return (
              <Link
                key={chapter.id}
                href={destinationHref}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="group flex min-h-[52px] items-center justify-between px-4 py-3 transition-colors hover:bg-surface-elevated/80 active:scale-[0.99]"
              >
                {/* Chapter Left Info */}
                <div className="flex flex-1 items-center gap-3 pr-2">
                  <span className="inline-flex min-w-[70px] shrink-0 items-center justify-center rounded-lg border border-brand-primary/20 bg-brand-primary/10 px-2 py-1 text-xs font-bold text-brand-light">
                    Ch. {chapter.chapterNumber}
                  </span>

                  <div className="flex flex-col overflow-hidden">
                    {chapter.title ? (
                      <span className="truncate text-xs font-semibold text-foreground group-hover:text-brand-light sm:text-sm">
                        {chapter.title}
                      </span>
                    ) : (
                      <span className="text-xs text-surface-muted">
                        Chapter {chapter.chapterNumber}
                      </span>
                    )}
                  </div>
                </div>

                {/* Chapter Right Info */}
                <div className="flex shrink-0 items-center gap-3 text-xs text-surface-muted">
                  <span className="hidden sm:inline">
                    {formatPublishDate(chapter.publishAt)}
                  </span>

                  {chapter.pagesCount > 0 && (
                    <span className="hidden text-[11px] md:inline">
                      {chapter.pagesCount}p
                    </span>
                  )}

                  {isExternal ? (
                    <ExternalLink className="h-4 w-4 text-surface-muted group-hover:text-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-surface-muted transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
