# Progress Tracker — Malaya

## Current Status: Unit 06 Complete (Mobile Webtoon Vertical Reader Engine)

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
| **Unit 06: Mobile Webtoon Reader Engine**             | Zero-gap vertical continuous strip, 3-tier mobile tap zones, width controls, fullscreen mode     | ✅ Complete |
| **Unit 07: Database Models & Supabase Auth**          | Prisma schema, Supabase Auth integration, RLS policies, connection pooling                       | ⏳ Pending  |
| **Unit 08: Reading Progress & Auto-Resume**           | Debounced scroll position tracker (1,500ms), auto-resume modal prompt                            | ⏳ Pending  |
| **Unit 09: Personal Library Dashboard**               | Reading, Completed, Plan to Read, On Hold tabs, user rating, and favorites                       | ⏳ Pending  |
| **Unit 10: Search & Autocomplete**                    | Header search modal with debounced query autocomplete, search history                            | ⏳ Pending  |
| **Unit 11: Next Chapter Prefetch & PWA Offline**      | Smart background panel prefetching, PWA Service Worker caching                                   | ⏳ Pending  |
| **Unit 12: CI/CD & Production Hardening**             | GitHub Actions pipeline (`ci.yml`), automated testing quality gate, Vercel verification          | ⏳ Pending  |

---

### Recent Changes

- **Unit 06: Mobile Webtoon Vertical Reader Engine**:
  - Implemented unit spec `context/specs/06-webtoon-vertical-reader-engine.md` based on usability research (`mobile-reader-floating-dock-ux-research.md`).
  - Built pure reader utilities (`src/lib/reader/reader-utils.ts`):
    - `calculateScrollProgress()`: Calculates live scroll progress percentage (0–100%) with bounds clamping and divide-by-zero protection.
    - `isIntentionalTap()`: Touch delta Euclidean distance check ($\Delta < 8\text{px}$) eliminating tap vs drag collisions.
    - `isScrollDismissTrigger()`: Auto-dismissal detection triggered when vertical scroll exceeds 40px.
    - `getReaderWidthClass()`: Responsive canvas width modes (`full`, `standard` 768px, `compact` 576px).
  - Built reader navigation components:
    - `ReaderTopBar` (`src/components/reader/reader-top-bar.tsx`): Passive HUD header with back navigation to `/manga/[mangaId]`, series title, chapter pill, width mode cycler, and native Fullscreen toggle (`requestFullscreen`).
    - `ReaderBottomDock` (`src/components/reader/reader-bottom-dock.tsx`): Floating island dock anchored in natural thumb zone (`bottom-4` + `pb-safe`), Previous Chapter button, live scroll progress pill, chapter drawer toggle, and high-contrast Next Chapter button.
    - `ChapterDrawer` (`src/components/reader/chapter-drawer.tsx`): Slide-up sheet allowing readers to jump to any chapter without leaving the canvas.
    - `WebtoonStrip` (`src/components/reader/webtoon-strip.tsx`): Continuous zero-gap vertical image stream using `.webtoon-strip` and `.webtoon-panel` layout rules, per-panel error fallback, and end-of-chapter completion card.
    - `ReaderContainer` (`src/components/reader/reader-container.tsx`): Coordinates tap vs drag touch gestures, scroll auto-dismissal, width modes, and fullscreen toggling.
  - Implemented client API and dynamic route integration (`src/app/read/[chapterId]/page.tsx`, `loading.tsx`):
    - Added `getChapterContext()` in `src/lib/mangadex/client.ts` resolving panel image URLs, adjacent chapter navigation, and series context in parallel.
    - Streaming loading shell (`src/app/read/[chapterId]/loading.tsx`) rendering `ReaderSkeleton`.
    - 4-state error and empty handling for missing chapters or failed network requests.
  - Authored automated test suite (`src/components/reader/__tests__/reader.test.ts`):
    - 15 unit tests covering scroll progress computation, touch delta tap detection, scroll auto-dismissal triggers, and width class mappings.
    - Monorepo test count: **62/62 tests passing across 18 test suites (100% pass rate)**.
  - Executed and passed the complete verification loop:
    - `npm run format:check`: 100% Prettier compliant.
    - `npm run typecheck`: 0 TypeScript compiler errors.
    - `npm run lint`: 0 ESLint warnings or errors.
    - `npm test`: 62 tests passing in 244ms.
    - `npm run build`: Production Next.js build compiled cleanly with dynamic server-rendered `/read/[chapterId]` route.

---

### Next Step

- Await user approval to merge `feat/unit-06-webtoon-vertical-reader-engine` and proceed to **Unit 07: Database Models & Supabase Auth (`Prisma`, `Auth`, `RLS`)**.
