# Progress Tracker — Malaya

## Current Status: Unit 07 Complete (Database Models & Supabase Auth)

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
| **Unit 07: Database Models & Supabase Auth**          | Prisma schema, Supabase Auth integration, RLS policies, connection pooling                       | ✅ Complete |
| **Unit 08: Reading Progress & Auto-Resume**           | Debounced scroll position tracker (1,500ms), auto-resume modal prompt                            | ⏳ Pending  |
| **Unit 09: Personal Library Dashboard**               | Reading, Completed, Plan to Read, On Hold tabs, user rating, and favorites                       | ⏳ Pending  |
| **Unit 10: Search & Autocomplete**                    | Header search modal with debounced query autocomplete, search history                            | ⏳ Pending  |
| **Unit 11: Next Chapter Prefetch & PWA Offline**      | Smart background panel prefetching, PWA Service Worker caching                                   | ⏳ Pending  |
| **Unit 12: CI/CD & Production Hardening**             | GitHub Actions pipeline (`ci.yml`), automated testing quality gate, Vercel verification          | ⏳ Pending  |

---

### Recent Changes

- **Unit 07: Database Models & Supabase Auth**:
  - Implemented unit spec `context/specs/07-database-models-supabase-auth.md`.
  - Configured Prisma ORM schema (`prisma/schema.prisma`):
    - `User` model with unique `supabaseId` linking external Supabase auth identity.
    - `ReadingStatus` enum: `READING`, `COMPLETED`, `PLAN_TO_READ`, `ON_HOLD`, `DROPPED`.
    - `LibraryEntry` model with composite unique constraint `@@unique([userId, seriesId])`.
    - `ReadingHistory` model for atomic progress persistence with `@@unique([userId, seriesId])`.
    - Generated typed Prisma client via `prisma generate`.
  - Authored PostgreSQL Row-Level Security policies (`prisma/rls-policies.sql`):
    - Enabled RLS on `User`, `LibraryEntry`, and `ReadingHistory`.
    - Multi-tenant tenant isolation ensuring users can only read, insert, update, or delete records where `supabaseId = auth.uid()` or `user_id` matches the authenticated user.
  - Implemented database singleton and Supabase SSR clients:
    - `prisma` singleton (`src/lib/db/prisma.ts`) preventing connection exhaustion in development.
    - `createBrowserClient` (`src/lib/supabase/client.ts`) for client components.
    - `createServerClient` (`src/lib/supabase/server.ts`) with async `cookies()` for Server Components and Server Actions.
    - Session refresh middleware (`src/lib/supabase/middleware.ts`, `src/middleware.ts`).
  - Built authentication flows & UI:
    - Input validation schema with Zod (`src/lib/auth/validation.ts`).
    - Server Actions for `signInAction`, `signUpAction`, and `signOutAction` (`src/app/auth/actions.ts`).
    - Mobile-optimized tabbed auth page (`src/app/auth/page.tsx`, `src/components/auth/auth-form.tsx`).
    - Live auth status indicator and sign-out controls in `AppHeader` (`src/components/layout/app-header.tsx`).
  - Authored automated test suite (`src/lib/auth/__tests__/auth-validation.test.ts`):
    - 7 unit tests covering credential validation, email checks, password length constraints, Prisma schema models, and RLS policies SQL.
    - Monorepo test count: **69/69 tests passing across 20 test suites (100% pass rate)**.
  - Executed and passed the complete verification loop:
    - `npm run format:check`: 100% Prettier compliant.
    - `npm run typecheck`: 0 TypeScript compiler errors.
    - `npm run lint`: 0 ESLint warnings or errors.
    - `npm test`: 69 tests passing in 438ms.
    - `npm run build`: Production Next.js build compiled cleanly with dynamic server-rendered `/auth` route and middleware.

---

### Next Step

- Await user approval to merge `feat/unit-07-database-models-supabase-auth` and proceed to **Unit 08: Reading Progress Persistence & Auto-Resume (`1,500ms Debounced Scroll`, `Auto-Resume Modal`)**.
