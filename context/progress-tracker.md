# Progress Tracker — Malaya

## Current Status: Unit 03 Complete (MangaDex API Client & Type Definitions)

---

### Implementation Phases

| Phase                                                 | Description                                                                                      | Status      |
| :---------------------------------------------------- | :----------------------------------------------------------------------------------------------- | :---------- |
| **Unit 00: Specs, Security & Architecture Blueprint** | Context documentation, security best practices, hardened gitignore, initial repo push            | ✅ Complete |
| **Unit 01: Next.js 15 PWA Scaffold & Theme**          | Next.js 15 App Router, Tailwind CSS, OLED theme tokens, PWA manifest, CI scripts                 | ✅ Complete |
| **Unit 02: Hardened Image Proxy & SSRF Defense**      | Secure `/api/proxy-image` route handler with private IP blocking and domain whitelisting         | ✅ Complete |
| **Unit 03: MangaDex API Client & Type Definitions**   | Typed REST client for 8,800+ Korean manhwa catalog, search, and chapter streaming                | ✅ Complete |
| **Unit 04: Catalog & Discovery UI**                   | Trending carousel, paginated manhwa cards, genre chips, 4-state UI loading skeletons             | ⏳ Pending  |
| **Unit 05: Series Detail & Chapter Index**            | Series banner, synopsis, tags, author/artist credits, sortable chapter list with asc/desc toggle | ⏳ Pending  |
| **Unit 06: Mobile Webtoon Reader Engine**             | Zero-gap vertical continuous strip, 3-tier mobile tap zones, width controls, fullscreen mode     | ⏳ Pending  |
| **Unit 07: Database Models & Supabase Auth**          | Prisma schema, Supabase Auth integration, RLS policies, connection pooling                       | ⏳ Pending  |
| **Unit 08: Reading Progress & Auto-Resume**           | Debounced scroll position tracker (1,500ms), auto-resume modal prompt                            | ⏳ Pending  |
| **Unit 09: Personal Library Dashboard**               | Reading, Completed, Plan to Read, On Hold tabs, user rating, and favorites                       | ⏳ Pending  |
| **Unit 10: Search & Autocomplete**                    | Header search modal with debounced query autocomplete, search history                            | ⏳ Pending  |
| **Unit 11: Next Chapter Prefetch & PWA Offline**      | Smart background panel prefetching, PWA Service Worker caching                                   | ⏳ Pending  |
| **Unit 12: CI/CD & Production Hardening**             | GitHub Actions pipeline (`ci.yml`), automated testing quality gate, Vercel verification          | ⏳ Pending  |

---

### Recent Changes

- **Unit 03: MangaDex API Client & Type Definitions**:
  - Implemented unit spec `context/specs/03-mangadex-api-client.md`.
  - Built comprehensive TypeScript types (`src/lib/mangadex/types.ts`):
    - Raw MangaDex API contracts (`MangaDexManga`, `MangaDexChapter`, `MangaDexAtHomeResponse`, query parameters).
    - Normalized DTOs (`ManhwaSummary`, `ManhwaDetail`, `ChapterItem`, `ChapterPagesPayload`).
  - Built domain normalization layer (`src/lib/mangadex/normalizer.ts`):
    - Multilingual title resolution prioritizing English $\to$ Romanized Korean (`ko-ro`) $\to$ Romanized Japanese (`ja-ro`) $\to$ native Korean.
    - Cover art extraction and proxy URL generation with dimension suffix.
    - Author and artist extraction from relationship collections.
    - Numerical chapter parser and decimal sorter (`0.5`, `1`, `12.5`, `100`).
  - Built typed API client (`src/lib/mangadex/client.ts`):
    - `getManhwaCatalog()`: Queries Korean manhwa (`originalLanguage: ['ko']`) with cover art and tags.
    - `searchManhwa()`: Real-time search with relevance sorting and genre filtering.
    - `getMangaDetails()`: Fetches full series detail with author/artist credits.
    - `getMangaFeed()`: Retrieves chapters filtered to English and sorted numerically.
    - `getChapterPages()`: Resolves MangaDex@Home distributed node URLs and maps chapter panels to secure proxy endpoints.
    - Enforced 8-second request timeout (`AbortSignal.timeout(8000)`) with custom error classes.
  - Authored automated test suite (`src/lib/mangadex/__tests__/mangadex.test.ts`):
    - Added 16 tests covering title fallback, cover generation, creator parsing, fractional chapter sorting, and DTO mapping.
    - Monorepo test count: **30/30 tests passing across 10 test suites (100% pass rate)**.
  - Executed and passed the complete verification loop:
    - `npm run format:check`: 100% Prettier compliant.
    - `npm run typecheck`: 0 TypeScript compiler errors.
    - `npm run lint`: 0 ESLint warnings or errors.
    - `npm test`: 30 tests passing in 187ms.
    - `npm run build`: Production Next.js build compiled cleanly.

---

### Next Step

- Await user approval to merge `feat/unit-03-mangadex-api-client` and proceed to **Unit 04: Catalog & Discovery UI**.
