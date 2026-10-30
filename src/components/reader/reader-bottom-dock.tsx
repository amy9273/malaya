'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import type { ChapterNavRef } from '@/lib/mangadex/types';
import { cn } from '@/lib/utils';

interface ReaderBottomDockProps {
  isVisible: boolean;
  chapterNumber: string;
  scrollProgress: number;
  prevChapter: ChapterNavRef | null;
  nextChapter: ChapterNavRef | null;
  onOpenDrawer: () => void;
}

export function ReaderBottomDock({
  isVisible,
  chapterNumber,
  scrollProgress,
  prevChapter,
  nextChapter,
  onOpenDrawer,
}: ReaderBottomDockProps) {
  return (
    <div
      className={cn(
        'fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 transition-transform duration-200 ease-out pb-safe',
        isVisible ? 'translate-y-0' : 'translate-y-28 pointer-events-none opacity-0',
      )}
      aria-label="Floating Reader Dock"
    >
      <div className="flex w-full max-w-md items-center justify-between rounded-2xl border border-surface-border bg-surface-canvas/95 p-1.5 shadow-2xl backdrop-blur-md">
        {/* Previous Chapter Button */}
        {prevChapter ? (
          <Link
            href={`/read/${prevChapter.id}`}
            title={`Previous Chapter (Ch. ${prevChapter.chapterNumber})`}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-surface-border bg-surface-elevated/80 text-foreground transition-all hover:bg-surface-elevated active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
        ) : (
          <span className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-surface-border/40 bg-surface-card/40 text-surface-muted/40 cursor-not-allowed">
            <ChevronLeft className="h-5 w-5" />
          </span>
        )}

        {/* Chapter Drawer Toggle Pill */}
        <button
          type="button"
          onClick={onOpenDrawer}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-surface-border bg-surface-elevated/60 px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-surface-muted hover:bg-surface-elevated active:scale-95"
        >
          <Layers className="h-3.5 w-3.5 text-brand-light" />
          <span>Ch. {chapterNumber}</span>
        </button>

        {/* Live Progress Pill */}
        <div className="flex min-w-[44px] items-center justify-center rounded-xl border border-surface-border/60 bg-surface-elevated/40 px-2 py-1 text-xs font-bold tabular-nums text-surface-muted">
          <span>{scrollProgress}%</span>
        </div>

        {/* Next Chapter Button (High-Contrast Hero CTA) */}
        {nextChapter ? (
          <Link
            href={`/read/${nextChapter.id}`}
            title={`Next Chapter (Ch. ${nextChapter.chapterNumber})`}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-brand-primary px-4 py-2 text-xs font-bold text-white shadow-lg shadow-brand-glow/30 transition-all hover:bg-brand-glow active:scale-95"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className="inline-flex min-h-[44px] items-center rounded-xl border border-status-complete/40 bg-status-complete/15 px-3 py-2 text-xs font-bold text-status-complete">
            Completed
          </span>
        )}
      </div>
    </div>
  );
}
