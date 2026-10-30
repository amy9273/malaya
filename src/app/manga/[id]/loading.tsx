import { DetailSkeleton } from '@/components/detail/detail-skeleton';

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8">
      <DetailSkeleton />
    </div>
  );
}
