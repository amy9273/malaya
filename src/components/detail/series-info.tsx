'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ManhwaDetail } from '@/lib/mangadex/types';
import { ChevronDown, ChevronUp, Tag } from 'lucide-react';

interface SeriesInfoProps {
  series: ManhwaDetail;
}

export function SeriesInfo({ series }: SeriesInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongDescription = series.description.length > 280;

  return (
    <section
      className="flex flex-col gap-6 rounded-3xl border border-surface-border bg-surface-card/60 p-6 backdrop-blur-sm sm:p-8"
      aria-label="Series Overview"
    >
      {/* Synopsis Section */}
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
          Synopsis
        </h2>

        {series.description ? (
          <div className="flex flex-col items-start gap-2">
            <p
              className={`text-sm text-surface-muted leading-relaxed ${
                !isExpanded && isLongDescription ? 'line-clamp-4' : ''
              }`}
            >
              {series.description}
            </p>

            {isLongDescription && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex min-h-[44px] items-center gap-1 text-xs font-semibold text-brand-light transition-colors hover:text-white"
              >
                <span>{isExpanded ? 'Show less' : 'Read more'}</span>
                {isExpanded ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>
            )}
          </div>
        ) : (
          <p className="text-sm italic text-surface-muted">
            No description available for this series.
          </p>
        )}
      </div>

      {/* Genres and Themes */}
      {series.tags.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-surface-border/60 pt-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-surface-muted">
            <Tag className="h-3.5 w-3.5" />
            <span>Genres & Tags</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {series.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-xl border border-surface-border bg-surface-elevated/70 px-3 py-1.5 text-xs font-medium text-surface-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Alternative Titles */}
      {series.altTitles.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-surface-border/60 pt-4">
          <span className="text-xs font-bold uppercase tracking-wider text-surface-muted">
            Alternative Titles
          </span>
          <p className="text-xs text-surface-muted/80 leading-relaxed">
            {series.altTitles.slice(0, 5).join(' • ')}
          </p>
        </div>
      )}
    </section>
  );
}
