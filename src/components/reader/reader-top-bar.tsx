'use client';

import Link from 'next/link';
import { ArrowLeft, Maximize, Minimize, Sliders } from 'lucide-react';
import type { ReaderWidthMode } from '@/lib/reader/reader-utils';
import { cn } from '@/lib/utils';

interface ReaderTopBarProps {
  isVisible: boolean;
  mangaId: string;
  mangaTitle: string;
  chapterNumber: string;
  widthMode: ReaderWidthMode;
  onCycleWidthMode: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export function ReaderTopBar({
  isVisible,
  mangaId,
  mangaTitle,
  chapterNumber,
  widthMode,
  onCycleWidthMode,
  isFullscreen,
  onToggleFullscreen,
}: ReaderTopBarProps) {
  const widthModeLabel =
    widthMode === 'compact' ? 'Compact' : widthMode === 'standard' ? 'Webtoon' : 'Full';

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-surface-border bg-surface-canvas/90 px-4 py-3 shadow-lg backdrop-blur-md transition-transform duration-200 ease-out pt-safe',
        isVisible ? 'translate-y-0' : '-translate-y-full pointer-events-none',
      )}
      aria-label="Reader Navigation Header"
    >
      {/* Back to Manga Detail Link */}
      <div className="flex items-center gap-3">
        <Link
          href={mangaId ? `/manga/${mangaId}` : '/'}
          aria-label="Back to series details"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-surface-border bg-surface-elevated/70 text-foreground transition-all hover:bg-surface-elevated active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        {/* Title and Chapter Identification */}
        <div className="flex flex-col overflow-hidden max-w-[180px] sm:max-w-md">
          <span className="truncate text-xs font-bold tracking-tight text-foreground sm:text-sm">
            {mangaTitle}
          </span>
          <span className="text-[11px] font-semibold text-brand-light">
            Chapter {chapterNumber}
          </span>
        </div>
      </div>

      {/* Reader Controls: Width Mode & Fullscreen */}
      <div className="flex items-center gap-2">
        {/* Width Mode Button */}
        <button
          type="button"
          onClick={onCycleWidthMode}
          title={`Reading Width: ${widthModeLabel} (Click to toggle)`}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-surface-border bg-surface-elevated/70 px-3 py-1.5 text-xs font-semibold text-surface-muted transition-all hover:text-foreground active:scale-95"
        >
          <Sliders className="h-3.5 w-3.5 text-brand-light" />
          <span className="hidden sm:inline">{widthModeLabel}</span>
        </button>

        {/* Fullscreen Toggle Button */}
        <button
          type="button"
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-surface-border bg-surface-elevated/70 text-surface-muted transition-all hover:text-foreground active:scale-95"
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </button>
      </div>
    </header>
  );
}
