import { Skeleton } from '@/components/ui/skeleton';

export function CatalogSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-label="Loading catalog content">
      {/* Hero Banner Skeleton */}
      <div className="relative overflow-hidden rounded-3xl border border-surface-border bg-surface-card p-6 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
          <Skeleton className="aspect-[3/4] w-28 rounded-2xl sm:w-36 md:w-44 shrink-0" />
          <div className="flex flex-1 flex-col gap-3">
            <Skeleton className="h-5 w-32 rounded-full" />
            <Skeleton className="h-8 w-3/4 rounded-xl sm:h-10" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-lg" />
              <Skeleton className="h-6 w-20 rounded-lg" />
              <Skeleton className="h-6 w-16 rounded-lg" />
            </div>
            <Skeleton className="h-14 w-full max-w-xl rounded-lg" />
            <div className="mt-2 flex gap-3">
              <Skeleton className="h-10 w-32 rounded-xl" />
              <Skeleton className="h-10 w-28 rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Skeletons */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
