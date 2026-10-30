import type { Metadata } from 'next';
import Link from 'next/link';
import { getChapterContext } from '@/lib/mangadex/client';
import { ReaderContainer } from '@/components/reader/reader-container';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { BookX, ArrowLeft } from 'lucide-react';

interface ReadPageProps {
  params: Promise<{ chapterId: string }>;
}

export async function generateMetadata(props: ReadPageProps): Promise<Metadata> {
  const { chapterId } = await props.params;

  try {
    const context = await getChapterContext(chapterId);
    return {
      title: `${context.mangaTitle} — Chapter ${context.chapter.chapterNumber} — Malaya`,
      description: `Read ${context.mangaTitle} Chapter ${context.chapter.chapterNumber} with continuous vertical scrolling on Malaya.`,
    };
  } catch {
    return {
      title: 'Webtoon Reader — Malaya',
      description: 'Continuous zero-gap mobile webtoon reading experience.',
    };
  }
}

export default async function ReadPage(props: ReadPageProps) {
  const { chapterId } = await props.params;

  try {
    const context = await getChapterContext(chapterId);

    if (context.chapter.pages.length === 0) {
      return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
          <EmptyState
            icon={BookX}
            title="No Panels Available"
            description="No image panels were found for this chapter. The chapter may still be distributing across MangaDex@Home nodes."
            action={{
              label: 'Return to Series',
              href: context.mangaId ? `/manga/${context.mangaId}` : '/',
            }}
          />
        </div>
      );
    }

    return <ReaderContainer context={context} />;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to retrieve chapter.';

    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-4 py-12">
        <ErrorState
          title="Chapter Unavailable"
          message={`Unable to connect to MangaDex chapter stream (${message}). Please check your internet connection.`}
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
