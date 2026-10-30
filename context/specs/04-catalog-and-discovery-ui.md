# Unit 04: Catalog & Discovery UI — Malaya

This specification details the discovery engine, trending hero banner, genre filter system, manhwa card components, 4-state UI loading skeletons, and homepage integration.

---

## 1. Scope & Objectives

1. **Manhwa Card Component (`src/components/catalog/manhwa-card.tsx`)**:
   - Standardized 3:4 aspect-ratio cover presentation.
   - Subtle gradient overlay ensuring high legibility for badges over diverse artwork.
   - Status indicator badge (`Ongoing` emerald / `Completed` sky blue).
   - Title typography with `line-clamp-2` preventing layout shifts.
   - Latest chapter pill (`Ch. 120`).
   - Touch-friendly mobile ergonomics (`active:scale-[0.98]`, 48px touch targets).

2. **Genre & Tag Filter Bar (`src/components/catalog/genre-filter-bar.tsx`)**:
   - Horizontally scrollable chip bar optimized for one-thumb mobile swiping.
   - Popular manhwa themes: _All_, _Action_, _Fantasy_, _Regression_, _Martial Arts_, _Adventure_, _Romance_, _Sci-Fi_, _Comedy_.
   - URL query parameter sync (`?tag=Action`) preserving shareable and bookmarkable catalog states.

3. **Trending Hero Showcase (`src/components/catalog/trending-hero.tsx`)**:
   - Prominent highlight of the top-ranked manhwa from the catalog.
   - Rich background art with OLED canvas gradient fade.
   - Direct "Start Reading" and "Series Details" quick actions.

4. **4-State UI Catalog Grid & Skeletons (`src/components/catalog/catalog-grid.tsx`, `catalog-skeleton.tsx`)**:
   - Responsive layout: 2 columns on mobile (`grid-cols-2`), 3 on tablet (`sm:grid-cols-3`), 4 on desktop (`md:grid-cols-4`, `lg:grid-cols-5`).
   - **Skeleton State**: Shimmer cards matching exact 3:4 aspect ratio, title, and chapter pill geometry.
   - **Empty State**: Friendly messaging when a tag has no matching entries with a "Reset Filter" CTA.
   - **Error State**: Graceful fallback UI with a retry action if upstream MangaDex encounters rate limits or network latency.

5. **Server Component Homepage Integration (`src/app/page.tsx`)**:
   - Server-side data fetching via `getManhwaCatalog()` from `src/lib/mangadex/client.ts`.
   - Reactive to searchParams (`tag`, `page`).
   - Zero client-side initial fetch waterfalls.

---

## 2. Invariants & Guardrails

1. **Anti-Slop Guardrail (`context/ui-context.md`)**:
   - All surfaces and typography must use tokens from `ui-context.md` (`surface-canvas`, `surface-card`, `surface-elevated`, `surface-border`, `brand-primary`). Zero arbitrary inline styles or hex codes permitted.
2. **Cumulative Layout Shift (CLS) Guardrail**:
   - Every card image container must enforce fixed aspect ratio (`aspect-[3/4]`) with a dark background placeholder to eliminate layout popping while images load.
3. **4-State UI Rule (`context/architecture.md` Invariant 6)**:
   - The catalog view must explicitly support Skeleton, Empty, Error, and Populated states.

---

## 3. Verification & Acceptance Criteria

- `npm run format:check` runs cleanly with 0 formatting warnings.
- `npm run typecheck` passes with 0 TypeScript compiler errors.
- `npm run lint` passes with 0 ESLint warnings or errors.
- `npm test` passes 100% of automated tests.
- `npm run build` succeeds cleanly producing valid static and dynamic routes.
