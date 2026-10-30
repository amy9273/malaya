# Progress Tracker — Malaya

## Current Status: Unit 04 Complete (Catalog & Discovery UI)

---

### Implementation Phases

| Phase                                                 | Description                                                                                      | Status      |
| :---------------------------------------------------- | :----------------------------------------------------------------------------------------------- | :---------- |
| **Unit 00: Specs, Security & Architecture Blueprint** | Context documentation, security best practices, hardened gitignore, initial repo push            | ✅ Complete |
| **Unit 01: Next.js 15 PWA Scaffold & Theme**          | Next.js 15 App Router, Tailwind CSS, OLED theme tokens, PWA manifest, CI scripts                 | ✅ Complete |
| **Unit 02: Hardened Image Proxy & SSRF Defense**      | Secure `/api/proxy-image` route handler with private IP blocking and domain whitelisting         | ✅ Complete |
| **Unit 03: MangaDex API Client & Type Definitions**   | Typed REST client for 8,800+ Korean manhwa catalog, search, and chapter streaming                | ✅ Complete |
| **Unit 04: Catalog & Discovery UI**                   | Trending carousel, paginated manhwa cards, genre chips, 4-state UI loading skeletons             | ✅ Complete |
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

- **Unit 04: Catalog & Discovery UI**:
  - Implemented unit spec `context/specs/04-catalog-and-discovery-ui.md`.
  - Built Manhwa card component (`src/components/catalog/manhwa-card.tsx`):
    - Strict 3:4 aspect-ratio cover container with `aspect-[3/4]` to eliminate Cumulative Layout Shift (CLS).
    - Status indicator badge (`Ongoing` emerald / `Completed` sky blue) with blur backdrop.
    - Title typography with `line-clamp-2` preventing overflow.
    - Latest chapter pill (`Ch. 120`).
    - Next.js Image with `unoptimized` and responsive sizes.
  - Built Genre & category filter bar (`src/components/catalog/genre-filter-bar.tsx`):
    - Horizontally scrollable chip bar with popular manhwa tags (_All_, _Action_, _Fantasy_, _Regression_, _Martial Arts_, _Adventure_, _Romance_, _Sci-Fi_, _Comedy_).
    - Extracted pure data configuration to `src/lib/catalog/genres.ts` for instant test execution.
    - Reactive URL query sync (`?tag=...&genre=...`) maintaining shareable filters and resetting pagination.
  - Built Trending Hero component (`src/components/catalog/trending-hero.tsx`):
    - Showcases top #1 ranked title on the homepage catalog with OLED background ambience.
    - Direct "Start Reading" and "View Details" call-to-actions.
  - Built 4-state UI skeletons & grid (`src/components/catalog/catalog-skeleton.tsx`, `catalog-grid.tsx`):
    - Responsive grid (`grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`).
    - Shimmer skeletons matching exact 3:4 aspect ratio, title, and badge geometry.
    - Meaningful `EmptyState` when filters yield 0 results with "Reset Filters" action.
    - Accessible pagination navigation with 44px+ touch targets and URL query preservation (`src/lib/catalog/pagination.ts`).
  - Integrated homepage Server Component (`src/app/page.tsx`):
    - Server-side data fetching via `getManhwaCatalog()`.
    - Next.js 15 async `searchParams` parsing (`tag`, `genre`, `page`).
    - Granular `Suspense` boundaries for genre navigation and catalog content with `CatalogSkeleton` fallback.
    - Graceful `ErrorState` handling if upstream MangaDex encounters errors.
  - Authored automated test suite (`src/components/catalog/__tests__/catalog.test.ts`):
    - 8 unit tests covering URL construction, pagination query handling, genre UUID validation, and ID uniqueness.
    - Monorepo test count: **38/38 tests passing across 12 test suites (100% pass rate)**.
  - Executed and passed the complete verification loop:
    - `npm run format:check`: 100% Prettier compliant.
    - `npm run typecheck`: 0 TypeScript compiler errors.
    - `npm run lint`: 0 ESLint warnings or errors.
    - `npm test`: 38 tests passing in 167ms.
    - `npm run build`: Production Next.js build compiled cleanly with dynamic server-rendered homepage.

---

### Next Step

- Await user approval to merge `feat/unit-04-catalog-and-discovery-ui` and proceed to **Unit 05: Series Detail & Chapter Index (`/manga/[id]`)**.
