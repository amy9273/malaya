'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { POPULAR_GENRES, type GenreOption } from '@/lib/catalog/genres';

export { POPULAR_GENRES, type GenreOption };

interface GenreFilterBarProps {
  activeTagId?: string;
}

export function GenreFilterBar({ activeTagId = 'all' }: GenreFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSelectGenre = (genre: GenreOption) => {
    const params = new URLSearchParams(searchParams.toString());

    if (genre.id === 'all' || !genre.tagUuid) {
      params.delete('tag');
      params.delete('genre');
    } else {
      params.set('genre', genre.id);
      params.set('tag', genre.tagUuid);
    }

    params.delete('page'); // Reset to page 1 on filter switch
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div className="no-scrollbar flex w-full gap-2 overflow-x-auto py-1">
        {POPULAR_GENRES.map((genre) => {
          const isActive =
            genre.id === 'all'
              ? !activeTagId || activeTagId === 'all'
              : activeTagId === genre.tagUuid || activeTagId === genre.id;

          return (
            <button
              key={genre.id}
              type="button"
              onClick={() => handleSelectGenre(genre)}
              className={cn(
                'whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 active:scale-95',
                isActive
                  ? 'border border-brand-primary bg-brand-primary text-white shadow-md shadow-brand-glow/30'
                  : 'border border-surface-border bg-surface-card/80 text-surface-muted hover:border-surface-muted hover:text-foreground',
              )}
            >
              {genre.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
