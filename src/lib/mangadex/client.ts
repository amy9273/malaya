import type {
  MangaDexCollection,
  MangaDexResponse,
  MangaDexManga,
  MangaDexChapter,
  MangaDexAtHomeResponse,
  CatalogQueryParams,
  FeedQueryParams,
  ManhwaSummary,
  ManhwaDetail,
  ChapterItem,
  ChapterPagesPayload,
} from './types';
import {
  normalizeManhwaSummary,
  normalizeManhwaDetail,
  normalizeChapter,
  sortChapters,
} from './normalizer';

const MANGADEX_API_BASE = 'https://api.mangadex.org';
const DEFAULT_REQUEST_TIMEOUT_MS = 8000; // 8-second network timeout

class MangaDexApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = 'MangaDexApiError';
  }
}

/**
 * Internal fetch wrapper enforcing timeout and User-Agent standards.
 */
async function fetchMangaDex<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${MANGADEX_API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'User-Agent': 'MalayaWebtoonReader/1.0 (https://github.com/amy9273/malaya)',
      Accept: 'application/json',
      ...options?.headers,
    },
    signal: AbortSignal.timeout(DEFAULT_REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new MangaDexApiError(
      `MangaDex API request failed (${response.status}): ${response.statusText}`,
      response.status,
    );
  }

  return response.json() as Promise<T>;
}

/**
 * Fetches Korean manhwa catalog with cover art, sorted by popularity.
 */
export async function getManhwaCatalog(
  params: CatalogQueryParams = {},
): Promise<{ manhwa: ManhwaSummary[]; total: number; limit: number; offset: number }> {
  const searchParams = new URLSearchParams();

  // Enforce Korean origin for Manhwa/Webtoons
  searchParams.append('originalLanguage[]', 'ko');
  searchParams.append('includes[]', 'cover_art');

  const limit = params.limit ?? 20;
  const offset = params.offset ?? 0;
  searchParams.set('limit', limit.toString());
  searchParams.set('offset', offset.toString());

  // Default to Safe/Suggestive content
  const ratings = params.contentRating ?? ['safe', 'suggestive'];
  for (const rating of ratings) {
    searchParams.append('contentRating[]', rating);
  }

  // Ordering
  if (params.order) {
    for (const [key, value] of Object.entries(params.order)) {
      if (value) {
        searchParams.set(`order[${key}]`, value);
      }
    }
  } else {
    searchParams.set('order[followedCount]', 'desc');
  }

  // Genre / Tag Filters
  if (params.includedTags && params.includedTags.length > 0) {
    for (const tag of params.includedTags) {
      searchParams.append('includedTags[]', tag);
    }
  }

  const endpoint = `/manga?${searchParams.toString()}`;
  const data = await fetchMangaDex<MangaDexCollection<MangaDexManga>>(endpoint);

  return {
    manhwa: data.data.map(normalizeManhwaSummary),
    total: data.total,
    limit: data.limit,
    offset: data.offset,
  };
}

/**
 * Searches the manhwa catalog by title with optional genre/tag filters.
 */
export async function searchManhwa(
  query: string,
  params: CatalogQueryParams = {},
): Promise<{ manhwa: ManhwaSummary[]; total: number }> {
  const searchParams = new URLSearchParams();

  if (query.trim()) {
    searchParams.set('title', query.trim());
  }

  searchParams.append('originalLanguage[]', 'ko');
  searchParams.append('includes[]', 'cover_art');
  searchParams.set('limit', (params.limit ?? 20).toString());
  searchParams.set('offset', (params.offset ?? 0).toString());
  searchParams.set('order[relevance]', 'desc');

  const ratings = params.contentRating ?? ['safe', 'suggestive'];
  for (const rating of ratings) {
    searchParams.append('contentRating[]', rating);
  }

  const endpoint = `/manga?${searchParams.toString()}`;
  const data = await fetchMangaDex<MangaDexCollection<MangaDexManga>>(endpoint);

  return {
    manhwa: data.data.map(normalizeManhwaSummary),
    total: data.total,
  };
}

/**
 * Fetches detailed series metadata including author, artist, and cover art.
 */
export async function getMangaDetails(mangaId: string): Promise<ManhwaDetail> {
  const endpoint = `/manga/${mangaId}?includes[]=cover_art&includes[]=author&includes[]=artist`;
  const data = await fetchMangaDex<MangaDexResponse<MangaDexManga>>(endpoint);

  return normalizeManhwaDetail(data.data);
}

/**
 * Fetches chapter feed for a series filtered by language (default: English).
 */
export async function getMangaFeed(
  mangaId: string,
  params: FeedQueryParams = {},
): Promise<{ chapters: ChapterItem[]; total: number }> {
  const searchParams = new URLSearchParams();

  const languages = params.translatedLanguage ?? ['en'];
  for (const lang of languages) {
    searchParams.append('translatedLanguage[]', lang);
  }

  const limit = params.limit ?? 100;
  const offset = params.offset ?? 0;
  searchParams.set('limit', limit.toString());
  searchParams.set('offset', offset.toString());

  const chapterOrder = params.order?.chapter ?? 'asc';
  searchParams.set('order[chapter]', chapterOrder);

  const endpoint = `/manga/${mangaId}/feed?${searchParams.toString()}`;
  const data = await fetchMangaDex<MangaDexCollection<MangaDexChapter>>(endpoint);

  const normalized = data.data.map(normalizeChapter);
  const sorted = sortChapters(normalized, chapterOrder);

  return {
    chapters: sorted,
    total: data.total,
  };
}

/**
 * Fetches chapter panel images from MangaDex@Home distributed node
 * and constructs proxy-wrapped secure URLs for the reader.
 */
export async function getChapterPages(chapterId: string): Promise<ChapterPagesPayload> {
  // 1. Fetch distributed node URL and image hashes
  const atHomeEndpoint = `/at-home/server/${chapterId}`;
  const atHomeData = await fetchMangaDex<MangaDexAtHomeResponse>(atHomeEndpoint);

  // 2. Fetch chapter metadata (chapter number & title)
  const chapterEndpoint = `/chapter/${chapterId}`;
  const chapterData =
    await fetchMangaDex<MangaDexResponse<MangaDexChapter>>(chapterEndpoint);

  const baseUrl = atHomeData.baseUrl;
  const hash = atHomeData.chapter.hash;
  const files = atHomeData.chapter.data;
  const fallbackFiles = atHomeData.chapter.dataSaver;

  const pages = files.map((fileName, idx) => {
    const rawUrl = `${baseUrl}/data/${hash}/${fileName}`;
    const fallbackRawUrl = fallbackFiles[idx]
      ? `${baseUrl}/data-saver/${hash}/${fallbackFiles[idx]}`
      : rawUrl;

    return {
      pageNumber: idx + 1,
      url: `/api/proxy-image?url=${encodeURIComponent(rawUrl)}`,
      fallbackUrl: `/api/proxy-image?url=${encodeURIComponent(fallbackRawUrl)}`,
    };
  });

  return {
    chapterId,
    chapterNumber: chapterData.data.attributes.chapter || '0',
    title: chapterData.data.attributes.title || null,
    pages,
  };
}
