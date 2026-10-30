import { Skeleton } from '@/components/ui/skeleton';

export function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-label="Loading series details and chapters">
      {/* Header Skeleton */}
      <div className="relative overflow-hidden rounded-3xl border border-surface-border bg-surface-canvas p-6 sm:p-8 md:p-10">
        <div className="flex items-center justify-between pb-6">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
          <Skeleton className="mx-auto aspect-[3/4] w-36 rounded-2xl sm:w-44 md:mx-0 md:w-52 shrink-0" />
          <div className="flex flex-1 flex-col items-center gap-4 md:items-start">
            <Skeleton className="h-9 w-3/4 rounded-xl sm:h-11" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-7 w-28 rounded-xl" />
              <Skeleton className="h-7 w-24 rounded-xl" />
              <Skeleton className="h-7 w-16 rounded-xl" />
            </div>
            <Skeleton className="mt-2 h-12 w-full max-w-xs rounded-xl" />
          </div>
        </div>
      </div>

      {/* Synopsis Skeleton */}
      <div className="flex flex-col gap-4 rounded-3xl border border-surface-border bg-surface-card/60 p-6 sm:p-8">
        <Skeleton className="h-6 w-24 rounded-lg" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />

        <div className="flex flex-wrap gap-2 pt-4">
          <Skeleton className="h-7 w-20 rounded-xl" />
          <Skeleton className="h-7 w-24 rounded-xl" />
          <Skeleton className="h-7 w-16 rounded-xl" />
          <Skeleton className="h-7 w-20 rounded-xl" />
        </div>
      </div>

      {/* Chapters Skeleton */}
      <div className="flex flex-col gap-4 rounded-3xl border border-surface-border bg-surface-card/60 p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-32 rounded-lg" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-36 rounded-xl" />
            <Skeleton className="h-10 w-24 rounded-xl" />
          </div>
        </div>

        <div className="flex flex-col divide-y divide-surface-border/50 overflow-hidden rounded-2xl border border-surface-border bg-surface-elevated/40">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex h-14 items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-7 w-16 rounded-lg" />
                <Skeleton className="h-4 w-40 rounded" />
              </div>
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
