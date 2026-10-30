import { Suspense } from 'react';
import { getManhwaCatalog } from '@/lib/mangadex/client';
import { GenreFilterBar } from '@/components/catalog/genre-filter-bar';
import { TrendingHero } from '@/components/catalog/trending-hero';
import { CatalogGrid } from '@/components/catalog/catalog-grid';
import { CatalogSkeleton } from '@/components/catalog/catalog-skeleton';
import { ErrorState } from '@/components/ui/error-state';

interface HomePageProps {
  searchParams: Promise<{
    tag?: string;
    genre?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 20;

async function CatalogContent({
  tag,
  genre,
  page,
}: {
  tag?: string;
  genre?: string;
  page: number;
}) {
  try {
    const offset = (page - 1) * PAGE_SIZE;
    const includedTags = tag ? [tag] : undefined;

    const { manhwa, total } = await getManhwaCatalog({
      includedTags,
      limit: PAGE_SIZE,
      offset,
    });

    if (manhwa.length === 0) {
      return (
        <CatalogGrid
          items={[]}
          total={0}
          currentPage={page}
          pageSize={PAGE_SIZE}
          activeTagId={tag}
          activeGenre={genre}
        />
      );
    }

    const isMainFeatured = !tag && page === 1;
    const featuredItem = isMainFeatured ? manhwa[0] : null;
    const gridItems = isMainFeatured ? manhwa.slice(1) : manhwa;

    return (
      <div className="flex flex-col gap-8">
        {featuredItem && <TrendingHero featured={featuredItem} />}

        {gridItems.length > 0 && (
          <CatalogGrid
            items={gridItems}
            total={total}
            currentPage={page}
            pageSize={PAGE_SIZE}
            activeTagId={tag}
            activeGenre={genre}
          />
        )}
      </div>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to retrieve manhwa catalog.';

    return (
      <ErrorState
        title="Catalog Unavailable"
        message={`Unable to connect to MangaDex (${errorMessage}). Please check your connection and try again.`}
      />
    );
  }
}

export default async function HomePage(props: HomePageProps) {
  const searchParams = await props.searchParams;
  const page = Math.max(1, parseInt(searchParams.page || '1', 10) || 1);
  const tag = searchParams.tag;
  const genre = searchParams.genre;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6">
      {/* Category Navigation Bar */}
      <Suspense
        fallback={
          <div className="h-11 w-full animate-pulse rounded-xl bg-surface-card/60" />
        }
      >
        <GenreFilterBar activeTagId={tag || genre} />
      </Suspense>

      {/* Main Catalog Section */}
      <Suspense key={`${tag ?? 'all'}-${page}`} fallback={<CatalogSkeleton />}>
        <CatalogContent tag={tag} genre={genre} page={page} />
      </Suspense>
    </div>
  );
}
