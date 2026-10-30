# Progress Tracker — Malaya

## Current Status: Unit 05 Complete (Series Detail & Chapter Index)

---

### Implementation Phases

| Phase                                                 | Description                                                                                      | Status      |
| :---------------------------------------------------- | :----------------------------------------------------------------------------------------------- | :---------- |
| **Unit 00: Specs, Security & Architecture Blueprint** | Context documentation, security best practices, hardened gitignore, initial repo push            | ✅ Complete |
| **Unit 01: Next.js 15 PWA Scaffold & Theme**          | Next.js 15 App Router, Tailwind CSS, OLED theme tokens, PWA manifest, CI scripts                 | ✅ Complete |
| **Unit 02: Hardened Image Proxy & SSRF Defense**      | Secure `/api/proxy-image` route handler with private IP blocking and domain whitelisting         | ✅ Complete |
| **Unit 03: MangaDex API Client & Type Definitions**   | Typed REST client for 8,800+ Korean manhwa catalog, search, and chapter streaming                | ✅ Complete |
| **Unit 04: Catalog & Discovery UI**                   | Trending carousel, paginated manhwa cards, genre chips, 4-state UI loading skeletons             | ✅ Complete |
| **Unit 05: Series Detail & Chapter Index**            | Series banner, synopsis, tags, author/artist credits, sortable chapter list with asc/desc toggle | ✅ Complete |
| **Unit 06: Mobile Webtoon Reader Engine**             | Zero-gap vertical continuous strip, 3-tier mobile tap zones, width controls, fullscreen mode     | ⏳ Pending  |
| **Unit 07: Database Models & Supabase Auth**          | Prisma schema, Supabase Auth integration, RLS policies, connection pooling                       | ⏳ Pending  |
| **Unit 08: Reading Progress & Auto-Resume**           | Debounced scroll position tracker (1,500ms), auto-resume modal prompt                            | ⏳ Pending  |
| **Unit 09: Personal Library Dashboard**               | Reading, Completed, Plan to Read, On Hold tabs, user rating, and favorites                       | ⏳ Pending  |
| **Unit 10: Search & Autocomplete**                    | Header search modal with debounced query autocomplete, search history                            | ⏳ Pending  |
| **Unit 11: Next Chapter Prefetch & PWA Offline**      | Smart background panel prefetching, PWA Service Worker caching                                   | ⏳ Pending  |
| **Unit 12: CI/CD & Production Hardening**             | GitHub Actions pipeline (`ci.yml`), automated testing quality gate, Vercel verification          | ⏳ Pending  |

---

### Recent Changes

- **Unit 05: Series Detail & Chapter Index**:
  - Implemented unit spec `context/specs/05-title-detail-and-chapters.md`.
  - Built pure date and chapter sorting utilities (`src/lib/detail/formatters.ts`):
    - `formatPublishDate()`: Robust human-readable date formatter with fallback handling.
    - `filterAndSortChapters()`: Decimal numerical sorting (`asc` / `desc`) and case-insensitive chapter/title filtering.
  - Built Series Header component (`src/components/detail/series-header.tsx`):
    - Ambient blurred cover art backdrop fading smoothly into OLED canvas.
    - Standardized 3:4 aspect-ratio cover art container.
    - Breadcrumb navigation back to discovery catalog.
    - Status badge (`Ongoing`, `Completed`, `On Hiatus`), publication year, and creator credits (Author & Artist).
    - Responsive "Start Reading" call-to-action button linking directly to Chapter 1.
  - Built Synopsis & metadata showcase (`src/components/detail/series-info.tsx`):
    - Expandable description with smooth "Read more / Show less" toggle for long text.
    - Interactive tag cloud chips and alternative titles list.
  - Built Interactive Chapter Index (`src/components/detail/chapter-list.tsx`):
    - Instant client-side ascending (`1 → N`) and descending (`N → 1`) numerical sort toggle.
    - Quick chapter search/filter input for rapid navigation across 100+ chapter series.
    - High-contrast list items meeting 52px touch target standards with chapter pills, release dates, and page count indicators.
    - Automatic external URL badge for off-site licensed chapters (MangaPlus).
  - Built 4-state UI loading skeletons & route integration (`src/app/manga/[id]/page.tsx`, `loading.tsx`):
    - Next.js 15 App Router Server Component with dynamic route params resolution (`await props.params`).
    - Dynamic OpenGraph metadata generation (`generateMetadata`).
    - Next.js 15 streaming loading shell (`src/app/manga/[id]/loading.tsx`) rendering `DetailSkeleton`.
    - Graceful `ErrorState` fallback when a title is unavailable or upstream encounters network errors.
    - Meaningful `EmptyState` when a series has zero English translated chapters available.
  - Authored automated test suite (`src/components/detail/__tests__/detail.test.ts`):
    - 9 unit tests covering ISO date formatting, ascending/descending numerical chapter ordering, fractional chapter sorting, and title query matching.
    - Monorepo test count: **47/47 tests passing across 14 test suites (100% pass rate)**.
  - Executed and passed the complete verification loop:
    - `npm run format:check`: 100% Prettier compliant.
    - `npm run typecheck`: 0 TypeScript compiler errors.
    - `npm run lint`: 0 ESLint warnings or errors.
    - `npm test`: 47 tests passing in 244ms.
    - `npm run build`: Production Next.js build compiled cleanly with dynamic server-rendered `/manga/[id]` route.

---

### Next Step

- Await user approval to merge `feat/unit-05-series-detail-and-chapter-index` and proceed to **Unit 06: Mobile Webtoon Vertical Reader Engine (`/read/[chapterId]`)**.
  - `npm test`: 38 tests passing in 167ms.
  - `npm run build`: Production Next.js build compiled cleanly with dynamic server-rendered homepage.

---

### Next Step

- Await user approval to merge `feat/unit-04-catalog-and-discovery-ui` and proceed to **Unit 05: Series Detail & Chapter Index (`/manga/[id]`)**.
