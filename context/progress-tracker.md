# Progress Tracker — Malaya

## Current Status: Unit 01 Complete (Next.js 15 PWA Scaffold & Theme Configuration)

---

### Implementation Phases

| Phase                                                 | Description                                                                                      | Status      |
| :---------------------------------------------------- | :----------------------------------------------------------------------------------------------- | :---------- |
| **Unit 00: Specs, Security & Architecture Blueprint** | Context documentation, security best practices, hardened gitignore, initial repo push            | ✅ Complete |
| **Unit 01: Next.js 15 PWA Scaffold & Theme**          | Next.js 15 App Router, Tailwind CSS, OLED theme tokens, PWA manifest, CI scripts                 | ✅ Complete |
| **Unit 02: Hardened Image Proxy & SSRF Defense**      | Secure `/api/proxy-image` route handler with private IP blocking and domain whitelisting         | ⏳ Pending  |
| **Unit 03: MangaDex API Client & Type Definitions**   | Typed REST client for 8,800+ Korean manhwa catalog, search, and chapter streaming                | ⏳ Pending  |
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

- **Unit 01: Next.js 15 PWA Scaffold & Theme Configuration**:
  - Implemented unit spec `context/specs/01-nextjs-pwa-scaffold.md`.
  - Configured Next.js 15 (App Router, React 19, TypeScript 5.7+) with strict typecheck rules.
  - Setup Tailwind CSS 3.4+ with OLED Obsidian theme tokens from `context/ui-context.md` (`surface-canvas`, `surface-card`, `surface-elevated`, `surface-border`, `brand-primary`, and semantic status badges).
  - Configured standalone PWA manifest (`src/app/manifest.ts`) and mobile viewport metadata (`viewport-fit=cover`, theme color `#08090C`).
  - Added CSS utilities for zero-gap webtoon strip rendering (`.webtoon-strip`, `touch-action: pan-y`) and mobile safe area insets.
  - Built core 4-State UI primitives:
    - `Skeleton` (`src/components/ui/skeleton.tsx`) with pulse shimmer.
    - `EmptyState` (`src/components/ui/empty-state.tsx`) with customizable icon, description, and primary CTA.
    - `ErrorState` (`src/components/ui/error-state.tsx`) with alert badge and retry action.
  - Built mobile app shell components:
    - `AppHeader` (`src/components/layout/app-header.tsx`) with backdrop blur and search/library actions.
    - `BottomNav` (`src/components/layout/bottom-nav.tsx`) with 4-tab mobile dock (Discover, Search, Library, Settings), automatically hidden in reader mode.
  - Hardened security headers in `next.config.mjs` (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, HSTS, Referrer-Policy).
  - Executed and passed the complete verification loop:
    - `npm run format:check`: 100% Prettier compliant.
    - `npm run typecheck`: 0 TypeScript compiler errors.
    - `npm run lint`: 0 ESLint warnings or errors.
    - `npm run build`: Production Next.js build compiled successfully in 3.9s.

---

### Next Step

- Await user approval to merge `feat/unit-01-nextjs-pwa-scaffold` and proceed to **Unit 02: Hardened Image Proxy & SSRF Defense (`/api/proxy-image`)**.
