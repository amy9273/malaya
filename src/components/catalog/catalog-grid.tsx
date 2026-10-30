import Link from 'next/link';
import type { ManhwaSummary } from '@/lib/mangadex/types';
import { ManhwaCard } from './manhwa-card';
import { EmptyState } from '@/components/ui/empty-state';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { buildCatalogPageUrl } from '@/lib/catalog/pagination';

export { buildCatalogPageUrl };

interface CatalogGridProps {
  items: ManhwaSummary[];
  total: number;
  currentPage: number;
  pageSize?: number;
  activeTagId?: string;
  activeGenre?: string;
}

export function CatalogGrid({
  items,
  total,
  currentPage,
  pageSize = 20,
  activeTagId,
  activeGenre,
}: CatalogGridProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No Manhwa Found"
        description="No titles match the selected genre or search filters. Try selecting a different category."
        action={{
          label: 'Reset Filters',
          href: '/',
        }}
      />
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <section className="flex flex-col gap-6" aria-label="Manhwa Catalog">
      {/* Cards Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((manhwa) => (
          <ManhwaCard key={manhwa.id} manhwa={manhwa} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-surface-border pt-4">
          {hasPrevious ? (
            <Link
              href={buildCatalogPageUrl(currentPage - 1, activeTagId, activeGenre)}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-surface-border bg-surface-card px-4 py-2 text-xs font-semibold text-foreground transition-all hover:border-surface-muted hover:bg-surface-elevated active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Link>
          ) : (
            <span className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-surface-border/40 bg-surface-card/40 px-4 py-2 text-xs font-semibold text-surface-muted/40 cursor-not-allowed">
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </span>
          )}

          <span className="text-xs font-medium text-surface-muted">
            Page <span className="font-bold text-foreground">{currentPage}</span> of{' '}
            <span className="font-bold text-foreground">{totalPages}</span>
          </span>

          {hasNext ? (
            <Link
              href={buildCatalogPageUrl(currentPage + 1, activeTagId, activeGenre)}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-surface-border bg-surface-card px-4 py-2 text-xs font-semibold text-foreground transition-all hover:border-surface-muted hover:bg-surface-elevated active:scale-95"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-surface-border/40 bg-surface-card/40 px-4 py-2 text-xs font-semibold text-surface-muted/40 cursor-not-allowed">
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </div>
      )}
    </section>
  );
}
