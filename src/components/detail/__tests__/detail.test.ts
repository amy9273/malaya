import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatPublishDate, filterAndSortChapters } from '@/lib/detail/formatters';
import type { ChapterItem } from '@/lib/mangadex/types';

const MOCK_CHAPTERS: ChapterItem[] = [
  {
    id: 'ch-1',
    chapterNumber: '1',
    numericChapter: 1,
    title: 'Prologue: The Awakening',
    publishAt: '2023-01-15T00:00:00Z',
    pagesCount: 20,
    externalUrl: null,
  },
  {
    id: 'ch-1.5',
    chapterNumber: '1.5',
    numericChapter: 1.5,
    title: 'Side Story: The Blacksmith',
    publishAt: '2023-01-20T00:00:00Z',
    pagesCount: 15,
    externalUrl: null,
  },
  {
    id: 'ch-2',
    chapterNumber: '2',
    numericChapter: 2,
    title: 'The Dungeon Raid',
    publishAt: '2023-02-01T00:00:00Z',
    pagesCount: 25,
    externalUrl: null,
  },
  {
    id: 'ch-10',
    chapterNumber: '10',
    numericChapter: 10,
    title: 'Monarch’s Realm',
    publishAt: '2023-05-10T00:00:00Z',
    pagesCount: 30,
    externalUrl: null,
  },
  {
    id: 'ch-100',
    chapterNumber: '100',
    numericChapter: 100,
    title: 'Final Confrontation',
    publishAt: '2024-01-01T00:00:00Z',
    pagesCount: 40,
    externalUrl: 'https://mangaplus.shueisha.co.jp',
  },
];

describe('Detail Module — formatPublishDate', () => {
  it('formats valid ISO date strings to human-readable format', () => {
    const formatted = formatPublishDate('2023-01-15T00:00:00Z');
    assert.ok(
      formatted.includes('2023') &&
        (formatted.includes('Jan') || formatted.includes('15')),
      `Unexpected date format: ${formatted}`,
    );
  });

  it('handles empty or undefined date string gracefully', () => {
    assert.equal(formatPublishDate(''), '-');
  });

  it('handles malformed date string gracefully without throwing', () => {
    assert.equal(formatPublishDate('invalid-date-string'), '-');
  });
});

describe('Detail Module — filterAndSortChapters', () => {
  it('sorts chapters in ascending numerical order', () => {
    const sorted = filterAndSortChapters(MOCK_CHAPTERS, '', 'asc');
    assert.equal(sorted[0]?.chapterNumber, '1');
    assert.equal(sorted[1]?.chapterNumber, '1.5');
    assert.equal(sorted[2]?.chapterNumber, '2');
    assert.equal(sorted[3]?.chapterNumber, '10');
    assert.equal(sorted[4]?.chapterNumber, '100');
  });

  it('sorts chapters in descending numerical order', () => {
    const sorted = filterAndSortChapters(MOCK_CHAPTERS, '', 'desc');
    assert.equal(sorted[0]?.chapterNumber, '100');
    assert.equal(sorted[1]?.chapterNumber, '10');
    assert.equal(sorted[2]?.chapterNumber, '2');
    assert.equal(sorted[3]?.chapterNumber, '1.5');
    assert.equal(sorted[4]?.chapterNumber, '1');
  });

  it('filters chapters by chapter number matching', () => {
    const filtered = filterAndSortChapters(MOCK_CHAPTERS, '10', 'asc');
    // Matches chapter 10 and 100
    assert.equal(filtered.length, 2);
    assert.equal(filtered[0]?.chapterNumber, '10');
    assert.equal(filtered[1]?.chapterNumber, '100');
  });

  it('filters chapters by title matching case-insensitively', () => {
    const filtered = filterAndSortChapters(MOCK_CHAPTERS, 'blacksmith', 'asc');
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0]?.chapterNumber, '1.5');
    assert.equal(filtered[0]?.title, 'Side Story: The Blacksmith');
  });

  it('returns empty array when filter query has no matches', () => {
    const filtered = filterAndSortChapters(MOCK_CHAPTERS, 'non-existent-keyword-999');
    assert.equal(filtered.length, 0);
  });

  it('preserves all items when filter query is empty or whitespace', () => {
    const filtered = filterAndSortChapters(MOCK_CHAPTERS, '   ');
    assert.equal(filtered.length, MOCK_CHAPTERS.length);
  });
});
