import type { ChapterItem } from '@/lib/mangadex/types';

/**
 * Formats an ISO publish date string into a clean, human-readable date.
 * Fallback to '-' if date is empty or invalid.
 */
export function formatPublishDate(dateString: string): string {
  if (!dateString) return '-';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '-';
  }
}

/**
 * Filters chapters by query string (matching chapter number or title)
 * and sorts them in ascending or descending numerical order.
 */
export function filterAndSortChapters(
  chapters: ChapterItem[],
  query: string,
  sortOrder: 'asc' | 'desc' = 'asc',
): ChapterItem[] {
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = normalizedQuery
    ? chapters.filter((ch) => {
        const matchesNumber =
          ch.chapterNumber.toLowerCase().includes(normalizedQuery) ||
          ch.numericChapter.toString().includes(normalizedQuery);
        const matchesTitle = ch.title && ch.title.toLowerCase().includes(normalizedQuery);
        return matchesNumber || matchesTitle;
      })
    : [...chapters];

  return filtered.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.numericChapter - b.numericChapter;
    }
    return b.numericChapter - a.numericChapter;
  });
}
