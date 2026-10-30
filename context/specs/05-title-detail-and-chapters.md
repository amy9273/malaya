# Unit 05: Series Detail & Chapter Index — Malaya

This specification details the series detail page (`/manga/[id]`), cover banner, creator credits, synopsis expander, genre chips, sortable chapter index, reading jump actions, and 4-state UI loading skeletons.

---

## 1. Scope & Objectives

1. **Series Header & Backdrop (`src/components/detail/series-header.tsx`)**:
   - Ambient blurred cover art backdrop blending into OLED canvas (`from-surface-canvas via-surface-canvas/90 to-transparent`).
   - High-contrast 3:4 cover thumbnail with fixed aspect container (`aspect-[3/4]`) to prevent layout shifts.
   - Series title, status badge (`Ongoing` / `Completed` / `Hiatus`), publication year, and creator credits (author & artist).
   - Direct "Start Reading" button pointing to the first chapter (`/read/[firstChapterId]`).

2. **Synopsis & Metadata Showcase (`src/components/detail/series-info.tsx`)**:
   - Clean description typography with an accessible "Read more / Read less" toggle for long text.
   - Interactive tag cloud with genre chips styled using tokens from `ui-context.md`.
   - Alternative titles list.

3. **Interactive Chapter Index (`src/components/detail/chapter-list.tsx`)**:
   - Ascending (`1 → N`) and Descending (`N → 1`) chapter sorting toggle with instant client-side state.
   - Quick filter search input for jumping to specific chapters in long series (e.g. 150+ chapters).
   - Touch-friendly list items (minimum 48px height) displaying chapter number, chapter title, release date, and pages count.
   - Link routing to reader: `/read/[chapterId]`.

4. **4-State UI & Loading Skeletons (`src/components/detail/detail-skeleton.tsx`)**:
   - **Skeleton State**: Shimmer backdrop, cover art, metadata badges, synopsis lines, and chapter rows.
   - **Empty State**: Friendly messaging if a series has 0 English chapters available on MangaDex.
   - **Error State**: Graceful fallback UI with "Back to Catalog" if the series ID is invalid or upstream fails.
   - **Populated State**: Full interactive view.

5. **Page Entrypoint (`src/app/manga/[id]/page.tsx`)**:
   - Next.js 15 App Router Server Component with `params: Promise<{ id: string }>`.
   - Parallel server fetching via `Promise.all([getMangaDetails(id), getMangaFeed(id)])`.
   - Dynamic page metadata (`generateMetadata`) generating SEO title, description, and OpenGraph cover image.

---

## 2. Invariants & Guardrails

1. **Anti-Slop Guardrail (`context/ui-context.md`)**:
   - All colors, borders, and surfaces must strictly use tokens (`surface-canvas`, `surface-card`, `surface-elevated`, `surface-border`, `brand-primary`, `brand-light`, `status-*`). Zero raw inline styles or arbitrary hex codes.
2. **Next.js 15 Route Params Invariant**:
   - `params` must be asynchronously resolved (`await props.params`).
3. **Touch Ergonomics (`context/engineering-best-practices.md`)**:
   - All chapter rows, sorting pills, and buttons must meet minimum 44–48px touch targets for 1-hand thumb interactions.
4. **Zero Layout Shift (CLS Invariant)**:
   - Fixed aspect ratio on cover thumbnails (`aspect-[3/4]`) and skeleton geometries matching live components.

---

## 3. Verification & Acceptance Criteria

- `npm run format:check` runs cleanly with 0 formatting warnings.
- `npm run typecheck` passes with 0 TypeScript compiler errors.
- `npm run lint` passes with 0 ESLint warnings or errors.
- `npm test` passes 100% of automated tests including new chapter list & detail tests.
- `npm run build` succeeds cleanly producing valid static and dynamic `/manga/[id]` routes.
