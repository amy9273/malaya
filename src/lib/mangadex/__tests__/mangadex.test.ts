import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveTitle,
  resolveDescription,
  extractCoverFileName,
  buildCoverUrl,
  extractAuthorAndArtist,
  parseChapterNumber,
  sortChapters,
  normalizeManhwaSummary,
  normalizeManhwaDetail,
  normalizeChapter,
} from '../normalizer';
import type { MangaDexManga, MangaDexChapter } from '../types';

describe('MangaDex Normalizer — Title Resolution', () => {
  it('prioritizes English title when present', () => {
    const title = resolveTitle({ en: 'Solo Leveling', 'ko-ro': 'Na Honjaman' });
    assert.equal(title, 'Solo Leveling');
  });

  it('falls back to Romanized Korean (ko-ro) when English is absent', () => {
    const title = resolveTitle({
      'ko-ro': 'Na Honjaman Lebel-eob',
      ko: '나 혼자만 레벨업',
    });
    assert.equal(title, 'Na Honjaman Lebel-eob');
  });

  it('falls back to altTitles if title map lacks English or Romanized title', () => {
    const title = resolveTitle({ ko: '나 혼자만 레벨업' }, [
      { 'ja-ro': 'Ore Dake' },
      { en: 'Only I Level Up' },
    ]);
    assert.equal(title, 'Only I Level Up');
  });

  it('returns "Untitled Manhwa" when title map is empty or undefined', () => {
    assert.equal(resolveTitle(undefined), 'Untitled Manhwa');
    assert.equal(resolveTitle({}), 'Untitled Manhwa');
  });
});

describe('MangaDex Normalizer — Description Resolution', () => {
  it('extracts English description', () => {
    const desc = resolveDescription({ en: 'A hunter story.', ko: '사냥꾼 이야기' });
    assert.equal(desc, 'A hunter story.');
  });

  it('returns empty string if description is undefined or empty', () => {
    assert.equal(resolveDescription(undefined), '');
    assert.equal(resolveDescription({}), '');
  });
});

describe('MangaDex Normalizer — Cover Art & URLs', () => {
  it('extracts cover art filename from relationships', () => {
    const relationships = [
      { id: '1', type: 'author', attributes: { name: 'Chugong' } },
      { id: '2', type: 'cover_art', attributes: { fileName: 'cover-1234.png' } },
    ];
    const fileName = extractCoverFileName(relationships);
    assert.equal(fileName, 'cover-1234.png');
  });

  it('formats secure proxy cover URLs with dimension suffix', () => {
    const url = buildCoverUrl('manga-123', 'cover-1234.png', '512');
    assert.ok(url.startsWith('/api/proxy-image?url='));
    assert.ok(
      url.includes('uploads.mangadex.org%2Fcovers%2Fmanga-123%2Fcover-1234.png.512.jpg'),
    );
  });

  it('returns fallback placeholder if filename is undefined', () => {
    const url = buildCoverUrl('manga-123', undefined);
    assert.equal(url, '/images/cover-placeholder.png');
  });
});

describe('MangaDex Normalizer — Creator Credits', () => {
  it('extracts author and artist correctly', () => {
    const relationships = [
      { id: 'a1', type: 'author', attributes: { name: 'Chugong' } },
      { id: 'a2', type: 'artist', attributes: { name: 'DUBU' } },
    ];
    const { author, artist } = extractAuthorAndArtist(relationships);
    assert.equal(author, 'Chugong');
    assert.equal(artist, 'DUBU');
  });

  it('handles missing author or artist gracefully', () => {
    const { author, artist } = extractAuthorAndArtist([]);
    assert.equal(author, null);
    assert.equal(artist, null);
  });
});

describe('MangaDex Normalizer — Chapter Parsing & Sorting', () => {
  it('parses integers and fractional chapter strings', () => {
    assert.equal(parseChapterNumber('1'), 1);
    assert.equal(parseChapterNumber('12.5'), 12.5);
    assert.equal(parseChapterNumber('100.1'), 100.1);
    assert.equal(parseChapterNumber(null), 0);
    assert.equal(parseChapterNumber('invalid'), 0);
  });

  it('sorts chapters ascending correctly (avoiding string alphabetical bug)', () => {
    const rawChapters = [
      {
        id: '3',
        chapterNumber: '100',
        numericChapter: 100,
        title: null,
        publishAt: '',
        pagesCount: 10,
        externalUrl: null,
      },
      {
        id: '1',
        chapterNumber: '2',
        numericChapter: 2,
        title: null,
        publishAt: '',
        pagesCount: 10,
        externalUrl: null,
      },
      {
        id: '2',
        chapterNumber: '12.5',
        numericChapter: 12.5,
        title: null,
        publishAt: '',
        pagesCount: 10,
        externalUrl: null,
      },
      {
        id: '0',
        chapterNumber: '0.5',
        numericChapter: 0.5,
        title: null,
        publishAt: '',
        pagesCount: 10,
        externalUrl: null,
      },
    ];

    const sortedAsc = sortChapters(rawChapters, 'asc');
    assert.deepEqual(
      sortedAsc.map((c) => c.chapterNumber),
      ['0.5', '2', '12.5', '100'],
    );

    const sortedDesc = sortChapters(rawChapters, 'desc');
    assert.deepEqual(
      sortedDesc.map((c) => c.chapterNumber),
      ['100', '12.5', '2', '0.5'],
    );
  });
});

describe('MangaDex Normalizer — Full DTO Mapping', () => {
  const mockManga: MangaDexManga = {
    id: 'solo-uuid',
    type: 'manga',
    attributes: {
      title: { en: 'Solo Leveling' },
      altTitles: [{ ko: '나 혼자만 레벨업' }],
      description: { en: 'Sung Jin-Woo awakens.' },
      originalLanguage: 'ko',
      status: 'completed',
      year: 2018,
      contentRating: 'safe',
      tags: [
        {
          id: 'tag-1',
          type: 'tag',
          attributes: { name: { en: 'Action' }, group: 'genre', version: 1 },
        },
        {
          id: 'tag-2',
          type: 'tag',
          attributes: { name: { en: 'Long Strip' }, group: 'format', version: 1 },
        },
      ],
      state: 'published',
      createdAt: '2019-01-01',
      updatedAt: '2024-01-01',
      lastChapter: '179',
    },
    relationships: [
      { id: 'rel-1', type: 'cover_art', attributes: { fileName: 'cover.jpg' } },
      { id: 'rel-2', type: 'author', attributes: { name: 'Chugong' } },
    ],
  };

  it('normalizes MangaDexManga to ManhwaSummary', () => {
    const summary = normalizeManhwaSummary(mockManga);
    assert.equal(summary.id, 'solo-uuid');
    assert.equal(summary.title, 'Solo Leveling');
    assert.equal(summary.status, 'completed');
    assert.equal(summary.year, 2018);
    assert.deepEqual(summary.tags, ['Action', 'Long Strip']);
    assert.equal(summary.latestChapter, '179');
  });

  it('normalizes MangaDexManga to ManhwaDetail with creators', () => {
    const detail = normalizeManhwaDetail(mockManga);
    assert.equal(detail.author, 'Chugong');
    assert.equal(detail.artist, null);
    assert.ok(detail.altTitles.includes('나 혼자만 레벨업'));
  });

  it('normalizes MangaDexChapter to ChapterItem', () => {
    const mockChapter: MangaDexChapter = {
      id: 'ch-1',
      type: 'chapter',
      attributes: {
        chapter: '12.5',
        title: 'Side Story: The Shadow Monarch',
        translatedLanguage: 'en',
        pages: 45,
        publishAt: '2023-01-01T00:00:00Z',
        readableAt: '2023-01-01T00:00:00Z',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        version: 1,
      },
      relationships: [],
    };

    const item = normalizeChapter(mockChapter);
    assert.equal(item.id, 'ch-1');
    assert.equal(item.chapterNumber, '12.5');
    assert.equal(item.numericChapter, 12.5);
    assert.equal(item.title, 'Side Story: The Shadow Monarch');
    assert.equal(item.pagesCount, 45);
  });
});
