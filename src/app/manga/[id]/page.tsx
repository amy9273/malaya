import type { Metadata } from 'next';
import Link from 'next/link';
import { getMangaDetails, getMangaFeed } from '@/lib/mangadex/client';
import { SeriesHeader } from '@/components/detail/series-header';
import { SeriesInfo } from '@/components/detail/series-info';
import { ChapterList } from '@/components/detail/chapter-list';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { ArrowLeft, BookX } from 'lucide-react';

interface MangaDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(props: MangaDetailPageProps): Promise<Metadata> {
  const { id } = await props.params;

  try {
    const details = await getMangaDetails(id);
    const descriptionExcerpt =
      details.description.slice(0, 155) ||
      `Read ${details.title} online with continuous vertical scrolling on Malaya.`;

    return {
      title: `${details.title} — Malaya`,
      description: descriptionExcerpt,
      openGraph: {
        title: `${details.title} — Malaya`,
        description: descriptionExcerpt,
        images: [{ url: details.coverUrl }],
      },
    };
  } catch {
    return {
      title: 'Manhwa Details — Malaya',
      description: 'Read Korean webtoons and manhwa on Malaya.',
    };
  }
}

export default async function MangaDetailPage(props: MangaDetailPageProps) {
  const { id } = await props.params;

  try {
    const [series, feedResult] = await Promise.all([
      getMangaDetails(id),
      getMangaFeed(id, { limit: 500, order: { chapter: 'asc' } }),
    ]);

    const firstChapter =
      feedResult.chapters.length > 0 ? feedResult.chapters[0] : undefined;

    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8">
        {/* Series Cover & Identity Header */}
        <SeriesHeader series={series} firstChapter={firstChapter} />

        {/* Synopsis and Tag Cloud */}
        <SeriesInfo series={series} />

        {/* Chapters Index or Empty State */}
        {feedResult.chapters.length > 0 ? (
          <ChapterList chapters={feedResult.chapters} mangaId={series.id} />
        ) : (
          <EmptyState
            icon={BookX}
            title="No English Chapters Available"
            description="No English translated chapters have been uploaded for this title on MangaDex yet. Please check back later."
            action={{
              label: 'Browse Other Manhwa',
              href: '/',
            }}
          />
        )}
      </div>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown network error.';

    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-12 sm:px-6">
        <ErrorState
          title="Manhwa Unavailable"
          message={`Unable to load details for this title (${message}). It may have been removed or the ID is invalid.`}
        />

        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-brand-glow/30 transition-all hover:bg-brand-glow active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Catalog</span>
          </Link>
        </div>
      </div>
    );
  }
}
