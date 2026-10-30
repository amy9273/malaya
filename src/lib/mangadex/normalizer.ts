import type {
  MangaDexManga,
  MangaDexChapter,
  MangaDexRelationship,
  ManhwaSummary,
  ManhwaDetail,
  ChapterItem,
} from './types';

/**
 * Resolves the most readable title for a manga, prioritizing English (in titleMap or altTitles),
 * then Romanized Korean (ko-ro), Romanized Japanese (ja-ro), native Korean (ko), or first available.
 */
export function resolveTitle(
  titleMap: Record<string, string> | undefined,
  altTitles: Record<string, string>[] = [],
): string {
  // 1. Check titleMap for English or Romanized Korean
  if (titleMap?.en?.trim()) return titleMap.en.trim();
  if (titleMap?.['ko-ro']?.trim()) return titleMap['ko-ro'].trim();

  // 2. Check altTitles for English or Romanized Korean
  for (const alt of altTitles) {
    if (alt.en?.trim()) return alt.en.trim();
    if (alt['ko-ro']?.trim()) return alt['ko-ro'].trim();
  }

  // 3. Check Romanized Japanese or native Korean
  if (titleMap?.['ja-ro']?.trim()) return titleMap['ja-ro'].trim();
  if (titleMap?.ko?.trim()) return titleMap.ko.trim();

  // 4. Check altTitles for Romanized Japanese or native Korean
  for (const alt of altTitles) {
    if (alt['ja-ro']?.trim()) return alt['ja-ro'].trim();
    if (alt.ko?.trim()) return alt.ko.trim();
  }

  // 5. Fallback to first available title in titleMap
  if (titleMap) {
    const firstKey = Object.keys(titleMap)[0];
    if (firstKey && titleMap[firstKey]?.trim()) {
      return titleMap[firstKey].trim();
    }
  }

  // 6. Fallback to first available title in altTitles
  for (const alt of altTitles) {
    const firstAltKey = Object.keys(alt)[0];
    if (firstAltKey && alt[firstAltKey]?.trim()) {
      return alt[firstAltKey].trim();
    }
  }

  return 'Untitled Manhwa';
}

/**
 * Extracts English description or falls back to the first available translation.
 */
export function resolveDescription(descMap: Record<string, string> | undefined): string {
  if (!descMap) return '';
  if (descMap.en && descMap.en.trim() !== '') return descMap.en.trim();

  const firstKey = Object.keys(descMap)[0];
  if (firstKey && descMap[firstKey]?.trim()) {
    return descMap[firstKey].trim();
  }

  return '';
}

/**
 * Extracts cover art filename from a MangaDex relationship collection.
 */
export function extractCoverFileName(
  relationships: MangaDexRelationship[] = [],
): string | undefined {
  const coverRel = relationships.find((rel) => rel.type === 'cover_art');
  if (
    coverRel &&
    coverRel.attributes &&
    typeof coverRel.attributes.fileName === 'string'
  ) {
    return coverRel.attributes.fileName;
  }
  return undefined;
}

/**
 * Formats a secure MangaDex cover image URL routed through the Malaya proxy.
 */
export function buildCoverUrl(
  mangaId: string,
  fileName?: string,
  size: '256' | '512' = '512',
): string {
  if (!fileName) {
    return '/images/cover-placeholder.png';
  }

  const rawUrl = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.${size}.jpg`;
  return `/api/proxy-image?url=${encodeURIComponent(rawUrl)}`;
}

/**
 * Resolves creator credits (author & artist) from relationships.
 */
export function extractAuthorAndArtist(relationships: MangaDexRelationship[] = []): {
  author: string | null;
  artist: string | null;
} {
  const authorRel = relationships.find((rel) => rel.type === 'author');
  const artistRel = relationships.find((rel) => rel.type === 'artist');

  const authorName =
    authorRel?.attributes && typeof authorRel.attributes.name === 'string'
      ? authorRel.attributes.name
      : null;

  const artistName =
    artistRel?.attributes && typeof artistRel.attributes.name === 'string'
      ? artistRel.attributes.name
      : null;

  return { author: authorName, artist: artistName };
}

/**
 * Parses numeric chapter representation (e.g. "12.5" -> 12.5, "100" -> 100).
 */
export function parseChapterNumber(chapterStr?: string | null): number {
  if (!chapterStr || chapterStr.trim() === '') return 0;
  const parsed = parseFloat(chapterStr);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * Normalizes a raw MangaDex Manga object into a compact ManhwaSummary DTO.
 */
export function normalizeManhwaSummary(manga: MangaDexManga): ManhwaSummary {
  const coverFileName = extractCoverFileName(manga.relationships);
  const tags = (manga.attributes.tags || [])
    .map((t) => t.attributes.name.en)
    .filter((name): name is string => typeof name === 'string' && name.length > 0);

  return {
    id: manga.id,
    title: resolveTitle(manga.attributes.title, manga.attributes.altTitles),
    description: resolveDescription(manga.attributes.description),
    coverUrl: buildCoverUrl(manga.id, coverFileName, '512'),
    status: manga.attributes.status,
    year: manga.attributes.year || null,
    tags,
    latestChapter: manga.attributes.lastChapter || null,
  };
}

/**
 * Normalizes a raw MangaDex Manga object into an extended ManhwaDetail DTO.
 */
export function normalizeManhwaDetail(manga: MangaDexManga): ManhwaDetail {
  const summary = normalizeManhwaSummary(manga);
  const { author, artist } = extractAuthorAndArtist(manga.relationships);

  const altTitles = (manga.attributes.altTitles || [])
    .flatMap((alt) => Object.values(alt))
    .filter((title) => typeof title === 'string' && title.trim().length > 0)
    .slice(0, 5); // Take top 5 alternate titles

  return {
    ...summary,
    altTitles,
    author,
    artist,
  };
}

/**
 * Normalizes a raw MangaDex Chapter object into a clean ChapterItem DTO.
 */
export function normalizeChapter(chapter: MangaDexChapter): ChapterItem {
  const chapterNumberStr = chapter.attributes.chapter || '0';

  return {
    id: chapter.id,
    chapterNumber: chapterNumberStr,
    numericChapter: parseChapterNumber(chapterNumberStr),
    title: chapter.attributes.title || null,
    publishAt: chapter.attributes.publishAt,
    pagesCount: chapter.attributes.pages,
    externalUrl: chapter.attributes.externalUrl || null,
  };
}

/**
 * Sorts chapter items by their numeric chapter value.
 */
export function sortChapters(
  chapters: ChapterItem[],
  direction: 'asc' | 'desc' = 'asc',
): ChapterItem[] {
  return [...chapters].sort((a, b) => {
    if (direction === 'asc') {
      return a.numericChapter - b.numericChapter;
    }
    return b.numericChapter - a.numericChapter;
  });
}
