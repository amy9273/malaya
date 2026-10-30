# Unit 06: Mobile Webtoon Vertical Reader Engine — Malaya

This specification details the continuous vertical webtoon reading engine (`/read/[chapterId]`), zero-gap image rendering, transient dual-HUD (top bar and floating bottom dock), thumb-zone ergonomics, touch-delta tap detection, chapter jumping drawer, and reading width settings.

---

## 1. Scope & Objectives

1. **Continuous Vertical Strip (`src/components/reader/webtoon-strip.tsx`)**:
   - Continuous zero-gap image panels rendered with `.webtoon-strip` and `.webtoon-panel` layout utilities.
   - `touch-action: pan-y` preventing accidental double-tap and pinch-to-zoom collisions while scrolling.
   - Graceful per-panel error handling with automatic fallback to data-saver URLs or retry buttons.
   - End-of-chapter completion card: "You finished Chapter N" with direct Next Chapter and Series Detail CTAs.

2. **Transient Dual-HUD Navigation (`src/components/reader/reader-top-bar.tsx`, `reader-bottom-dock.tsx`)**:
   - **Top Bar (Passive / Safe Exit)**:
     - Back navigation arrow linking directly to `/manga/[mangaId]`.
     - Series title and chapter number pill.
     - Reader width mode selector (`Full`, `Webtoon 720px`, `Compact 600px`).
     - Native Fullscreen toggle button (`requestFullscreen` API).
   - **Floating Bottom Dock (High-Frequency Thumb Zone)**:
     - Detached floating island pill elevated with `bottom-4` + `pb-safe` to avoid iOS/Android gesture collisions.
     - Previous chapter button (`< Prev`).
     - Quick chapter drawer trigger pill (`Ch. N`).
     - Live debounced scroll progress badge (`X%`).
     - High-contrast Next Chapter button (`Next >`).

3. **Touch & Gesture Engine (`src/components/reader/reader-container.tsx`, `src/lib/reader/use-hud-controller.ts`)**:
   - **Touch Delta Threshold**: Track `touchstart` and `touchend`. Only toggle HUD if $\Delta < 8\text{px}$, completely eliminating tap vs scroll drag collisions.
   - **Scroll Auto-Dismiss**: When user scrolls vertically by $> 40\text{px}$, HUD automatically slides out of view.
   - **Center Tap Zone**: Single tap in center 60% of viewport toggles HUD.

4. **Chapter Quick-Jump Drawer (`src/components/reader/chapter-drawer.tsx`)**:
   - Slide-up modal sheet listing all chapters in the series.
   - Highlights current active chapter.
   - Instant navigation to any chapter without returning to the detail page.

5. **Route Integration & 4-State UI (`src/app/read/[chapterId]/page.tsx`, `loading.tsx`)**:
   - Next.js 15 Server Component accepting `params: Promise<{ chapterId: string }>`.
   - Parallel resolution of chapter pages and feed context.
   - Loading shimmer skeleton (`reader-skeleton.tsx`).
   - Meaningful `ErrorState` fallback if chapter panels fail to load or chapter is unavailable.

---

## 2. Invariants & Guardrails

1. **Zero-Gap Layout Invariant**:
   - Webtoon panels must use `display: block`, `margin: 0`, and `padding: 0` inside a zero-line-height container to eliminate the 3px inline baseline whitespace bug.
2. **Anti-Slop Guardrail (`context/ui-context.md`)**:
   - Strict adherence to OLED tokens (`surface-canvas`, `surface-card`, `surface-elevated`, `surface-border`, `brand-primary`). Zero arbitrary inline styles.
3. **Safe Area Elevation Invariant**:
   - Bottom dock must use `pb-safe` and floating detachment to guarantee zero conflict with the iOS Home Indicator and Android system gestures.

---

## 3. Verification & Acceptance Criteria

- `npm run format:check` runs cleanly with 0 formatting warnings.
- `npm run typecheck` passes with 0 TypeScript compiler errors.
- `npm run lint` passes with 0 ESLint warnings or errors.
- `npm test` passes 100% of automated tests including new reader gesture and calculation tests.
- `npm run build` succeeds cleanly producing valid static and dynamic `/read/[chapterId]` routes.
