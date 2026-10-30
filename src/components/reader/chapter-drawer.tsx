'use client';

import Link from 'next/link';
import { X, Layers, Check } from 'lucide-react';
import type { ChapterNavRef } from '@/lib/mangadex/types';
import { cn } from '@/lib/utils';

interface ChapterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentChapterId: string;
  allChapters: ChapterNavRef[];
}

export function ChapterDrawer({
  isOpen,
  onClose,
  currentChapterId,
  allChapters,
}: ChapterDrawerProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm transition-opacity"
      onClick={onClose}
      aria-label="Chapter Selection Drawer"
    >
      {/* Sheet Content Container */}
      <div
        className="flex max-h-[75vh] w-full flex-col rounded-t-3xl border-t border-surface-border bg-surface-card shadow-2xl pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-brand-light" />
            <h3 className="text-sm font-bold tracking-tight text-foreground sm:text-base">
              Select Chapter
            </h3>
            <span className="rounded-full border border-surface-border bg-surface-elevated px-2 py-0.5 text-[11px] font-semibold text-surface-muted">
              {allChapters.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-surface-muted transition-colors hover:text-foreground active:scale-95"
            aria-label="Close chapter drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chapters List */}
        <div className="flex flex-col divide-y divide-surface-border/50 overflow-y-auto px-2 py-2">
          {allChapters.map((chapter) => {
            const isCurrent = chapter.id === currentChapterId;

            return (
              <Link
                key={chapter.id}
                href={`/read/${chapter.id}`}
                onClick={onClose}
                className={cn(
                  'flex min-h-[48px] items-center justify-between rounded-xl px-4 py-2.5 transition-colors',
                  isCurrent
                    ? 'border border-brand-primary/40 bg-brand-primary/15 text-brand-light font-bold'
                    : 'text-surface-muted hover:bg-surface-elevated/70 hover:text-foreground',
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold">
                    Chapter {chapter.chapterNumber}
                  </span>
                  {chapter.title && (
                    <span className="truncate text-xs text-surface-muted max-w-[200px] sm:max-w-xs">
                      {chapter.title}
                    </span>
                  )}
                </div>

                {isCurrent && <Check className="h-4 w-4 text-brand-light" />}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
