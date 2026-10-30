'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ChapterPage, ChapterNavRef } from '@/lib/mangadex/types';
import { cn } from '@/lib/utils';
import { CheckCircle2, ChevronRight, ArrowLeft, ArrowUp } from 'lucide-react';

interface WebtoonStripProps {
  pages: ChapterPage[];
  chapterNumber: string;
  mangaId: string;
  nextChapter: ChapterNavRef | null;
  widthClass: string;
}

function WebtoonPanel({ page }: { page: ChapterPage }) {
  const [src, setSrc] = useState(page.url);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (src !== page.fallbackUrl) {
      setSrc(page.fallbackUrl);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-2 border border-status-dropped/30 bg-surface-card p-4 text-center">
        <span className="text-xs font-semibold text-status-dropped">
          Failed to load panel {page.pageNumber}
        </span>
        <button
          type="button"
          onClick={() => {
            setHasError(false);
            setSrc(`${page.url}&t=${Date.now()}`);
          }}
          className="rounded-lg border border-surface-border bg-surface-elevated px-3 py-1 text-xs text-foreground hover:bg-surface-border"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`Page ${page.pageNumber}`}
      loading={page.pageNumber <= 3 ? 'eager' : 'lazy'}
      decoding="async"
      onError={handleError}
      className="webtoon-panel bg-surface-card"
    />
  );
}

export function WebtoonStrip({
  pages,
  chapterNumber,
  mangaId,
  nextChapter,
  widthClass,
}: WebtoonStripProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={cn('webtoon-strip mx-auto transition-all duration-200', widthClass)}>
      {/* Consecutive Panel Images */}
      {pages.map((page) => (
        <WebtoonPanel key={page.pageNumber} page={page} />
      ))}

      {/* End of Chapter Card */}
      <div className="my-12 flex w-full max-w-lg flex-col items-center gap-5 rounded-3xl border border-surface-border bg-surface-card/90 p-8 text-center shadow-2xl backdrop-blur-md">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-status-complete/15 text-status-complete">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            You finished Chapter {chapterNumber}
          </h3>
          <p className="text-xs text-surface-muted">
            {nextChapter
              ? `Continue your reading journey with Chapter ${nextChapter.chapterNumber}`
              : 'You have caught up with the latest released chapter!'}
          </p>
        </div>

        {/* Action CTAs */}
        <div className="mt-2 flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
          {nextChapter && (
            <Link
              href={`/read/${nextChapter.id}`}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand-glow/30 transition-all hover:bg-brand-glow active:scale-95"
            >
              <span>Read Next (Ch. {nextChapter.chapterNumber})</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}

          <Link
            href={mangaId ? `/manga/${mangaId}` : '/'}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-elevated px-5 py-2.5 text-xs font-semibold text-foreground transition-all hover:bg-surface-border active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Series Detail</span>
          </Link>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border border-surface-border bg-surface-elevated/60 px-4 py-2.5 text-xs font-medium text-surface-muted transition-all hover:text-foreground active:scale-95"
          >
            <ArrowUp className="h-4 w-4" />
            <span>Top</span>
          </button>
        </div>
      </div>
    </div>
  );
}
