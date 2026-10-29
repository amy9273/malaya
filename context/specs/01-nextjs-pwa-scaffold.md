# Unit 01: Next.js 15 PWA Scaffold & Theme Configuration — Malaya

This specification details the frontend framework scaffolding, OLED Obsidian design system tokens, PWA manifest, core 4-state UI primitives, and automated verification tooling.

---

## 1. Scope & Objectives

1. **Framework & Package Scaffolding (`package.json`)**:
   - Next.js 15 (App Router, Server Components).
   - React 19 and React DOM.
   - TypeScript 5.7+ with strict mode compiler configuration (`tsconfig.json`).
   - Tailwind CSS 3.4+ and Autoprefixer.
   - Lucide React (`lucide-react`) for unified vector iconography.
   - Class Variance Authority (`class-variance-authority`), `clsx`, and `tailwind-merge` (`cn` utility).
2. **Design Tokens & Theme Setup (`tailwind.config.ts`, `src/app/globals.css`)**:
   - Implement OLED Obsidian theme tokens from `context/ui-context.md`:
     - `surface-canvas`: `#08090C`
     - `surface-card`: `#111318`
     - `surface-elevated`: `#181B22`
     - `surface-border`: `#262A34`
     - `brand-primary`: `#6366F1`
     - `brand-glow`: `#4F46E5`
     - Semantic badges (`status-reading`, `status-complete`, `status-plan`, `status-dropped`).
3. **Mobile PWA & Viewport Ergonomics (`src/app/manifest.ts`, `src/app/layout.tsx`)**:
   - PWA web app manifest with `display: "standalone"`, `theme_color: "#08090C"`, and `background_color: "#08090C"`.
   - Viewport export configuring `width: "device-width"`, `initialScale: 1`, `maximumScale: 1`, and `viewportFit: "cover"`.
4. **Mandatory 4-State UI Primitives**:
   - `Skeleton` (`src/components/ui/skeleton.tsx`) with pulse shimmer animation.
   - `EmptyState` (`src/components/ui/empty-state.tsx`) with icon, title, description, and primary CTA.
   - `ErrorState` (`src/components/ui/error-state.tsx`) with error badge, explanation, and "Retry" callback.
   - App Shell Layout with Mobile Navigation Dock (`src/components/layout/bottom-nav.tsx` and `app-header.tsx`).
5. **Quality Gate Tooling**:
   - Prettier configuration (`.prettierrc`, `.prettierignore`).
   - ESLint configuration with Next.js Core Web Vitals and TypeScript strictness.
   - Quality gate scripts in `package.json`: `format`, `format:check`, `typecheck`, `lint`, and `build`.

---

## 2. Invariants & Guardrails

1. **Anti-Slop Invariant**:
   - All color classes and surface levels must use Tailwind tokens mapped directly to `ui-context.md`. Zero arbitrary hex codes (`bg-[#...]`) or inline CSS styles allowed.
2. **PWA Standalone Compliance**:
   - Manifest and layout metadata must be configured such that adding to home screen on iOS and Android yields a full-screen standalone application without the browser URL bar.
3. **Strict Typecheck Integrity**:
   - `tsc --noEmit` must complete with 0 errors across all files. No `any` casting or `@ts-ignore` suppressions permitted.

---

## 3. Verification & Acceptance Criteria

- `npm run format:check` runs cleanly with 0 formatting warnings.
- `npm run typecheck` passes with 0 TypeScript compiler errors.
- `npm run lint` passes with 0 ESLint warnings or errors.
- `npm run build` succeeds cleanly producing production Next.js standalone artifacts.
