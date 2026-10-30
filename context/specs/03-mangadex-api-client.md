# Unit 03: MangaDex API Client & Type Definitions — Malaya

This specification details the architecture, TypeScript DTO schemas, normalization engine, API client implementation, and test suite for interacting with the MangaDex REST API.

---

## 1. Scope & Objectives

1. **MangaDex Type Definitions (`src/lib/mangadex/types.ts`)**:
   - Raw MangaDex API response structures:
     - `MangaDexResponse<T>`, `MangaDexCollection<T>`.
     - `MangaDexManga` (attributes: `title`, `altTitles`, `description`, `originalLanguage`, `status`, `year`, `contentRating`, `tags`).
     - `MangaDexRelationship` (`author`, `artist`, `cover_art`, `scanlation_group`).
     - `MangaDexChapter` (attributes: `volume`, `chapter`, `title`, `translatedLanguage`, `pages`, `publishAt`, `externalUrl`).
     - `MangaDexAtHomeResponse` (`baseUrl`, `chapter.hash`, `chapter.data`, `chapter.dataSaver`).
   - Clean Normalized Domain Models for Frontend/UI:
     - `ManhwaSummary`: Simplified card DTO (`id`, `title`, `slug`, `description`, `coverUrl`, `status`, `year`, `tags`, `latestChapter`).
     - `ManhwaDetail`: Rich series DTO (`author`, `artist`, `altTitles`, `chaptersCount`).
     - `ChapterItem`: Individual chapter DTO (`id`, `chapterNumber`, `title`, `publishAt`, `pagesCount`, `externalUrl`).
     - `ChapterPagesPayload`: Reader-ready page array (`chapterId`, `chapterNumber`, `pages: { pageNumber: number, url: string }[]`).

2. **Domain Normalization Engine (`src/lib/mangadex/normalizer.ts`)**:
   - **Multilingual Title Resolution**: Smart fallback resolving English (`en`) $\to$ Romanized Korean (`ko-ro`) $\to$ Romanized Japanese (`ja-ro`) $\to$ first available title key.
   - **Cover Art Resolution**: Extracts the `cover_art` relationship filename and formats high-performance thumbnail URLs (`https://uploads.mangadex.org/covers/${id}/${fileName}.512.jpg`) wrapped in the secure `/api/proxy-image` helper.
   - **Tag Extraction**: Maps raw UUID tags into clean string labels (e.g. `Action`, `Regression`, `Long Strip`).
   - **Chapter Decimal Sorting**: Robust numeric sorting that orders chapters correctly (`1`, `2`, `12.5`, `100` rather than alphabetical `"100" < "12"`).

3. **Typed MangaDex Client (`src/lib/mangadex/client.ts`)**:
   - `getManhwaCatalog(params)`: Queries Korean manhwa (`originalLanguage: ['ko']`, `includes: ['cover_art']`, order by `followedCount` or `latestUploadedChapter`).
   - `searchManhwa(query, params)`: Debounced text search supporting title and tag filtering.
   - `getMangaDetails(mangaId)`: Fetches series metadata with authors, artists, and cover art.
   - `getMangaFeed(mangaId, params)`: Fetches chapters filtered to English translations (`translatedLanguage: ['en']`) sorted by chapter number.
   - `getChapterPages(chapterId)`: Resolves MangaDex@Home distributed node URL, hashes, and constructs the secure proxy URL list for the webtoon reader.

4. **Automated Unit Tests (`src/lib/mangadex/__tests__/mangadex.test.ts`)**:
   - Verify multilingual title fallback logic.
   - Verify cover URL generation with dimension suffix.
   - Verify chapter sorting with fractional chapters (`0.5`, `1`, `10.5`, `100`).
   - Verify normalizer safely handles null/empty descriptions and missing relationships.

---

## 2. Invariants & Guardrails

1. **Strict Type Safety Invariant (`context/code-standards.md`)**:
   - Zero `any`. All MangaDex payload responses must be strictly typed through interfaces and validated with non-null guards.
2. **SSRF Compliance Invariant (`context/security-best-practices.md`)**:
   - All external image URLs returned for client consumption must be formatted to use the secure `/api/proxy-image?url=...` route handler.
3. **Resilience & Timeout Invariant**:
   - All external network calls to `api.mangadex.org` must enforce an 8-second timeout (`AbortSignal.timeout(8000)`) with clear error messaging.

---

## 3. Verification & Acceptance Criteria

- `npm run format:check` runs cleanly with 0 formatting warnings.
- `npm run typecheck` passes with 0 TypeScript compiler errors.
- `npm run lint` passes with 0 ESLint warnings or errors.
- Automated tests pass 100% (`npm test`).
- `npm run build` succeeds cleanly.
