# Engineering Best Practices — Malaya

This document sets the engineering excellence guidelines across architecture, performance, database management, testing, and defensive programming for Malaya.

---

## 1. Code Readability & Architecture Hygiene

1. **Domain-Driven Directory Layout**:
   * Group code by feature and domain responsibility (`features/catalog`, `features/reader`, `features/library`) rather than sprawling generic directories.
2. **Zero Circular Dependencies**:
   * Leaf utilities, clients, and types live in dedicated root modules (`src/lib/prisma.ts`, `src/lib/mangadex.ts`, `src/types/`).
3. **Explicit Typing Over Inferred Ambiguity**:
   * Define explicit DTO interfaces for external API payloads. Never accept untyped `any` from MangaDex or Supabase.
4. **Clean Component Boundaries**:
   * Separate pure presentation components from data-fetching Server Components and mutation-driven Client Components.

---

## 2. High-Performance Webtoon Reader Engineering

1. **GPU-Accelerated Zero-Gap Layout**:
   * Webtoon panel containers must use `flex flex-col items-center w-full` with `line-height: 0` and images set to `display: block`.
   * Apply CSS `will-change: transform` or `contain: content` on panel wrappers to keep memory footprint bounded during continuous high-speed vertical scrolling.
2. **Debounced Viewport Progress Calculation**:
   * Calculate scroll position percentage using `window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100`.
   * Throttle recalculations via `requestAnimationFrame` and debounce persistent server writes to 1.5 seconds.
3. **Smart Next-Chapter Prefetching**:
   * When a reader reaches **75% vertical depth** of the active chapter, trigger a low-priority background prefetch for the first 3 panels of the *next* chapter using `new Image().src = ...`.
   * This guarantees seamless transition without waiting for network fetches when clicking "Next Chapter".

---

## 3. Database & Query Hygiene (PostgreSQL + Prisma)

1. **Composite Indexes for Frequent Lookups**:
   * Add composite indexes on `[userId, status]` for library tab filtering and `[userId, seriesId]` for bookmark lookups.
2. **Atomic Upserts for Reading Progress**:
   * Never execute sequential `findUnique` followed by `create` or `update` for reading progress (prone to race conditions). Use Prisma `upsert`:
     ```typescript
     await prisma.readingHistory.upsert({
       where: { userId_seriesId: { userId, seriesId } },
       create: { userId, seriesId, chapterId, chapterNumber, scrollPercent },
       update: { chapterId, chapterNumber, scrollPercent, lastReadAt: new Date() },
     });
     ```
3. **Connection Pool Management**:
   * Export the Prisma client as a global singleton (`src/lib/prisma.ts`) to avoid socket exhaustion in development and serverless edge invocations.

---

## 4. Defensive Resilience & Third-Party Fallbacks

1. **MangaDex Node Failover**:
   * MangaDex serves images via distributed MangaDex@Home nodes. If an image node returns a 5xx error or times out (>8s), the proxy client should fail over to the fallback endpoint (`data-saver` or alternative node).
2. **Network Offline Grace**:
   * The PWA Service Worker must cache basic application shell assets, reader navigation controls, and recently fetched chapter panels so transient subway/elevator disconnects do not crash the reader.
3. **Graceful Error Boundaries**:
   * Wrap reader panels in React Error Boundaries that provide single-panel "Tap to Reload" buttons rather than crashing the entire chapter view.

---

## 5. Automated Testing Discipline

1. **Unit Tests**:
   * Test MangaDex response parsers, chapter sorters (handling decimal chapters like `12.5`), and progress calculation utilities.
2. **Integration Tests**:
   * Test `/api/proxy-image` with valid external CDN URLs and verify that malicious local/metadata URLs are strictly rejected with HTTP 400/403.
3. **Typecheck & Linter Quality Gate**:
   * Every commit must pass `npm run typecheck` (`tsc --noEmit`) and `npm run lint` without warnings or suppressions.
