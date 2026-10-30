import Link from 'next/link';
import Image from 'next/image';
import type { ManhwaSummary } from '@/lib/mangadex/types';
import { Flame, BookOpen, ChevronRight } from 'lucide-react';

interface TrendingHeroProps {
  featured: ManhwaSummary;
}

export function TrendingHero({ featured }: TrendingHeroProps) {
  return (
    <section className="relative w-full overflow-hidden rounded-3xl border border-surface-border bg-gradient-to-b from-surface-card to-surface-canvas p-6 shadow-2xl sm:p-8">
      {/* Background Ambience / Glow */}
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-primary/15 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image
          src={featured.coverUrl}
          alt=""
          fill
          unoptimized
          aria-hidden="true"
          className="object-cover opacity-10 blur-sm pointer-events-none"
        />
      </div>

      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
        {/* Cover Thumbnail on Desktop / Mobile Badge */}
        <div className="relative aspect-[3/4] w-28 shrink-0 overflow-hidden rounded-2xl border border-surface-border shadow-xl sm:w-36 md:w-44">
          <Image
            src={featured.coverUrl}
            alt={featured.title}
            fill
            unoptimized
            priority
            sizes="(max-width: 640px) 112px, (max-width: 768px) 144px, 176px"
            className="object-cover"
          />
        </div>

        {/* Content Info */}
        <div className="flex flex-1 flex-col items-start gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-status-plan/40 bg-status-plan/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-status-plan">
            <Flame className="h-3.5 w-3.5" />
            <span>#1 Trending Manhwa</span>
          </div>

          <h2 className="text-xl font-black tracking-tight text-foreground sm:text-3xl md:text-4xl">
            {featured.title}
          </h2>

          {/* Tags */}
          {featured.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {featured.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-surface-border bg-surface-elevated/80 px-2.5 py-1 text-[11px] font-medium text-surface-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Description Excerpt */}
          {featured.description && (
            <p className="line-clamp-3 text-xs text-surface-muted sm:text-sm leading-relaxed max-w-2xl">
              {featured.description}
            </p>
          )}

          {/* CTA Actions */}
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Link
              href={`/manga/${featured.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-glow/30 transition-all hover:bg-brand-glow active:scale-95"
            >
              <BookOpen className="h-4 w-4" />
              <span>Start Reading</span>
            </Link>

            <Link
              href={`/manga/${featured.id}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-surface-border bg-surface-elevated/80 px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:border-surface-muted active:scale-95"
            >
              <span>View Details</span>
              <ChevronRight className="h-4 w-4 text-surface-muted" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
