import Link from 'next/link';
import Image from 'next/image';
import type { ManhwaSummary } from '@/lib/mangadex/types';
import { cn } from '@/lib/utils';
import { BookOpen } from 'lucide-react';

interface ManhwaCardProps {
  manhwa: ManhwaSummary;
  priority?: boolean;
}

export function ManhwaCard({ manhwa, priority = false }: ManhwaCardProps) {
  const isCompleted = manhwa.status === 'completed';

  return (
    <Link
      href={`/manga/${manhwa.id}`}
      className="group flex flex-col gap-2 rounded-2xl transition-all duration-200 active:scale-[0.98]"
    >
      {/* 3:4 Aspect Ratio Cover Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-surface-border bg-surface-card shadow-md transition-all duration-300 group-hover:border-brand-primary/50 group-hover:shadow-brand-glow/10 group-hover:shadow-xl">
        {/* Cover Image */}
        <Image
          src={manhwa.coverUrl}
          alt={manhwa.title}
          fill
          unoptimized
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Gradient Overlay for Top and Bottom Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-canvas/90 via-transparent to-surface-canvas/40 pointer-events-none" />

        {/* Status Badge (Top-Left) */}
        <div className="absolute left-2.5 top-2.5">
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide backdrop-blur-md',
              isCompleted
                ? 'border border-status-complete/40 bg-status-complete/20 text-status-complete'
                : 'border border-status-reading/40 bg-status-reading/20 text-status-reading',
            )}
          >
            {isCompleted ? 'Completed' : 'Ongoing'}
          </span>
        </div>

        {/* Latest Chapter Pill (Bottom-Right) */}
        {manhwa.latestChapter && (
          <div className="absolute bottom-2.5 right-2.5">
            <span className="inline-flex items-center gap-1 rounded-lg border border-surface-border/80 bg-surface-canvas/80 px-2 py-0.5 text-[10px] font-medium text-surface-muted backdrop-blur-md">
              <BookOpen className="h-2.5 w-2.5 text-brand-light" />
              <span>Ch. {manhwa.latestChapter}</span>
            </span>
          </div>
        )}
      </div>

      {/* Title & Metadata */}
      <div className="flex flex-col gap-0.5 px-0.5">
        <h3
          title={manhwa.title}
          className="line-clamp-2 text-xs font-semibold tracking-tight text-foreground transition-colors group-hover:text-brand-light sm:text-sm"
        >
          {manhwa.title}
        </h3>

        {/* Tags Row */}
        {manhwa.tags.length > 0 && (
          <p className="line-clamp-1 text-[11px] text-surface-muted">
            {manhwa.tags.slice(0, 2).join(' • ')}
          </p>
        )}
      </div>
    </Link>
  );
}
