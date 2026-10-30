import { Skeleton } from '@/components/ui/skeleton';

export function ReaderSkeleton() {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center bg-surface-canvas overflow-hidden"
      aria-label="Loading chapter panels"
    >
      {/* Top Header Shimmer */}
      <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-surface-border bg-surface-canvas/90 px-4 py-3 pt-safe">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20 rounded-xl" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>

      {/* Panels Canvas Shimmer */}
      <div className="flex w-full max-w-3xl flex-col items-center gap-1 pt-16">
        <Skeleton className="aspect-[3/5] w-full" />
        <Skeleton className="aspect-[3/5] w-full" />
        <Skeleton className="aspect-[3/5] w-full" />
      </div>

      {/* Floating Bottom Dock Shimmer */}
      <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 pb-safe">
        <div className="flex w-full max-w-md items-center justify-between rounded-2xl border border-surface-border bg-surface-canvas/95 p-2 shadow-2xl">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-8 w-12 rounded-xl" />
          <Skeleton className="h-10 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
