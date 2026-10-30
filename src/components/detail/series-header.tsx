import Link from 'next/link';
import Image from 'next/image';
import type { ManhwaDetail, ChapterItem } from '@/lib/mangadex/types';
import { cn } from '@/lib/utils';
import { BookOpen, PenTool, Palette, Calendar, ArrowLeft, Sparkles } from 'lucide-react';

interface SeriesHeaderProps {
  series: ManhwaDetail;
  firstChapter?: ChapterItem;
}

export function SeriesHeader({ series, firstChapter }: SeriesHeaderProps) {
  const isCompleted = series.status === 'completed';
  const isHiatus = series.status === 'hiatus';

  const readTargetHref = firstChapter
    ? `/read/${firstChapter.id}`
    : `/manga/${series.id}#chapters`;

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-surface-border bg-surface-canvas shadow-2xl">
      {/* Ambient Blurred Backdrop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image
          src={series.coverUrl}
          alt=""
          fill
          unoptimized
          aria-hidden="true"
          className="scale-110 object-cover opacity-15 blur-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-canvas via-surface-canvas/80 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col gap-6 p-6 sm:p-8 md:p-10">
        {/* Navigation Breadcrumb / Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-surface-border bg-surface-elevated/70 px-3.5 py-2 text-xs font-semibold text-foreground backdrop-blur-md transition-all hover:border-surface-muted hover:bg-surface-elevated active:scale-95"
          >
            <ArrowLeft className="h-4 w-4 text-surface-muted" />
            <span>Catalog</span>
          </Link>

          {/* Status Badge */}
          <span
            className={cn(
              'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur-md',
              isCompleted
                ? 'border border-status-complete/40 bg-status-complete/20 text-status-complete'
                : isHiatus
                  ? 'border border-status-dropped/40 bg-status-dropped/20 text-status-dropped'
                  : 'border border-status-reading/40 bg-status-reading/20 text-status-reading',
            )}
          >
            {isCompleted ? 'Completed' : isHiatus ? 'On Hiatus' : 'Ongoing'}
          </span>
        </div>

        {/* Hero Content Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
          {/* Cover Art Container */}
          <div className="relative mx-auto aspect-[3/4] w-36 shrink-0 overflow-hidden rounded-2xl border border-surface-border bg-surface-card shadow-2xl sm:w-44 md:mx-0 md:w-52">
            <Image
              src={series.coverUrl}
              alt={series.title}
              fill
              unoptimized
              priority
              sizes="(max-width: 640px) 144px, (max-width: 768px) 176px, 208px"
              className="object-cover"
            />
          </div>

          {/* Meta & Actions */}
          <div className="flex flex-1 flex-col items-center gap-4 text-center md:items-start md:text-left">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl md:text-4xl">
              {series.title}
            </h1>

            {/* Creators and Year Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              {series.author && (
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-surface-border bg-surface-elevated/80 px-3 py-1 text-xs font-medium text-surface-muted backdrop-blur-sm">
                  <PenTool className="h-3.5 w-3.5 text-brand-light" />
                  <span>{series.author}</span>
                </span>
              )}

              {series.artist && series.artist !== series.author && (
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-surface-border bg-surface-elevated/80 px-3 py-1 text-xs font-medium text-surface-muted backdrop-blur-sm">
                  <Palette className="h-3.5 w-3.5 text-brand-light" />
                  <span>{series.artist}</span>
                </span>
              )}

              {series.year && (
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-surface-border bg-surface-elevated/80 px-3 py-1 text-xs font-medium text-surface-muted backdrop-blur-sm">
                  <Calendar className="h-3.5 w-3.5 text-surface-muted" />
                  <span>{series.year}</span>
                </span>
              )}

              {series.latestChapter && (
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-brand-primary/40 bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-light backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Latest: Ch. {series.latestChapter}</span>
                </span>
              )}
            </div>

            {/* Quick Action CTA */}
            <div className="mt-2 flex w-full flex-wrap items-center justify-center gap-3 md:justify-start">
              <Link
                href={readTargetHref}
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-glow/30 transition-all hover:bg-brand-glow active:scale-95 sm:w-auto"
              >
                <BookOpen className="h-4 w-4" />
                <span>
                  {firstChapter
                    ? `Start Reading (Ch. ${firstChapter.chapterNumber})`
                    : 'Start Reading'}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
