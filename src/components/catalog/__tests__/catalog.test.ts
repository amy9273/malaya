import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildCatalogPageUrl } from '@/lib/catalog/pagination';
import { POPULAR_GENRES } from '@/lib/catalog/genres';

describe('Catalog Navigation & Pagination Utilities', () => {
  it('builds root path for page 1 without filters', () => {
    const url = buildCatalogPageUrl(1);
    assert.equal(url, '/');
  });

  it('builds page query for page > 1', () => {
    const url = buildCatalogPageUrl(2);
    assert.equal(url, '/?page=2');
  });

  it('preserves tag and genre parameters in page query', () => {
    const url = buildCatalogPageUrl(3, 'action-uuid', 'action');
    assert.equal(url, '/?tag=action-uuid&genre=action&page=3');
  });

  it('omits page parameter when on page 1 with active genre', () => {
    const url = buildCatalogPageUrl(1, 'fantasy-uuid', 'fantasy');
    assert.equal(url, '/?tag=fantasy-uuid&genre=fantasy');
  });

  it('handles zero or negative page values safely by treating them as root', () => {
    const url = buildCatalogPageUrl(0);
    assert.equal(url, '/');
  });
});

describe('Popular Genres Configuration', () => {
  it('contains "all" as the first category option', () => {
    const firstGenre = POPULAR_GENRES[0];
    assert.ok(firstGenre, 'First genre option should be defined');
    assert.equal(firstGenre.id, 'all');
    assert.equal(firstGenre.name, 'All Manhwa');
    assert.equal(firstGenre.tagUuid, undefined);
  });

  it('has unique IDs across all genre options', () => {
    const ids = POPULAR_GENRES.map((g) => g.id);
    const uniqueIds = new Set(ids);
    assert.equal(ids.length, uniqueIds.size);
  });

  it('specifies valid 36-character UUIDs for all non-all genres', () => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    for (const genre of POPULAR_GENRES) {
      if (genre.id !== 'all') {
        assert.ok(
          genre.tagUuid && uuidRegex.test(genre.tagUuid),
          `Invalid or missing tagUuid for genre: ${genre.name}`,
        );
      }
    }
  });
});
