/**
 * MangaDex API v5 Type Definitions and Normalized DTOs — Malaya
 */

// ==========================================
// 1. Raw MangaDex API Response Structures
// ==========================================

export interface MangaDexError {
  id: string;
  status: number;
  title: string;
  detail: string;
}

export interface MangaDexResponse<T> {
  result: 'ok' | 'error';
  response: 'entity';
  data: T;
  errors?: MangaDexError[];
}

export interface MangaDexCollection<T> {
  result: 'ok' | 'error';
  response: 'collection';
  data: T[];
  limit: number;
  offset: number;
  total: number;
  errors?: MangaDexError[];
}

export interface MangaDexRelationship {
  id: string;
  type: string;
  related?: string;
  attributes?: Record<string, unknown>;
}

export interface MangaDexTag {
  id: string;
  type: 'tag';
  attributes: {
    name: Record<string, string>;
    group: string;
    version: number;
  };
}

export interface MangaDexMangaAttributes {
  title: Record<string, string>;
  altTitles: Record<string, string>[];
  description: Record<string, string>;
  originalLanguage: string;
  lastVolume?: string | null;
  lastChapter?: string | null;
  status: 'ongoing' | 'completed' | 'hiatus' | 'cancelled';
  year?: number | null;
  contentRating: 'safe' | 'suggestive' | 'erotica' | 'pornographic';
  tags: MangaDexTag[];
  state: string;
  createdAt: string;
  updatedAt: string;
  latestUploadedChapter?: string | null;
}

export interface MangaDexManga {
  id: string;
  type: 'manga';
  attributes: MangaDexMangaAttributes;
  relationships: MangaDexRelationship[];
}

export interface MangaDexChapterAttributes {
  volume?: string | null;
  chapter?: string | null;
  title?: string | null;
  translatedLanguage: string;
  externalUrl?: string | null;
  publishAt: string;
  readableAt: string;
  createdAt: string;
  updatedAt: string;
  pages: number;
  version: number;
}

export interface MangaDexChapter {
  id: string;
  type: 'chapter';
  attributes: MangaDexChapterAttributes;
  relationships: MangaDexRelationship[];
}

export interface MangaDexAtHomeResponse {
  result: 'ok' | 'error';
  baseUrl: string;
  chapter: {
    hash: string;
    data: string[];
    dataSaver: string[];
  };
}

// ==========================================
// 2. Query Parameters
// ==========================================

export interface CatalogQueryParams {
  limit?: number;
  offset?: number;
  title?: string;
  includedTags?: string[];
  excludedTags?: string[];
  order?: {
    followedCount?: 'asc' | 'desc';
    relevance?: 'asc' | 'desc';
    latestUploadedChapter?: 'asc' | 'desc';
    createdAt?: 'asc' | 'desc';
    updatedAt?: 'asc' | 'desc';
    title?: 'asc' | 'desc';
  };
  contentRating?: ('safe' | 'suggestive' | 'erotica')[];
}

export interface FeedQueryParams {
  limit?: number;
  offset?: number;
  translatedLanguage?: string[];
  order?: {
    chapter?: 'asc' | 'desc';
  };
}

// ==========================================
// 3. Clean Normalized Domain Models
// ==========================================

export interface ManhwaSummary {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  status: 'ongoing' | 'completed' | 'hiatus' | 'cancelled';
  year: number | null;
  tags: string[];
  latestChapter: string | null;
}

export interface ManhwaDetail extends ManhwaSummary {
  altTitles: string[];
  author: string | null;
  artist: string | null;
}

export interface ChapterItem {
  id: string;
  chapterNumber: string;
  numericChapter: number;
  title: string | null;
  publishAt: string;
  pagesCount: number;
  externalUrl: string | null;
}

export interface ChapterPage {
  pageNumber: number;
  url: string;
  fallbackUrl: string;
}

export interface ChapterPagesPayload {
  chapterId: string;
  chapterNumber: string;
  title: string | null;
  pages: ChapterPage[];
}

export interface ChapterNavRef {
  id: string;
  chapterNumber: string;
  title: string | null;
}

export interface ChapterReaderContext {
  chapter: ChapterPagesPayload;
  mangaId: string;
  mangaTitle: string;
  prevChapter: ChapterNavRef | null;
  nextChapter: ChapterNavRef | null;
  allChapters: ChapterNavRef[];
}
