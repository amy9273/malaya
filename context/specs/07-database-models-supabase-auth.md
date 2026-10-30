# Unit 07: Database Models & Supabase Auth — Malaya

This specification details the database schema (Prisma ORM), Supabase Authentication integration (`@supabase/ssr`), Row-Level Security (RLS) policies, database singleton client, session middleware, and mobile auth UI.

---

## 1. Scope & Objectives

1. **Prisma ORM Database Schema (`prisma/schema.prisma`)**:
   - PostgreSQL datasource configured with connection pooling (`DATABASE_URL`) and direct connection (`DIRECT_URL`).
   - **`User` Model**:
     - `id`: UUID primary key.
     - `supabaseId`: Unique external identity link to `auth.users(id)`.
     - `email`: User email address.
     - `displayName`, `avatarUrl`: Optional profile fields.
     - Relations: `LibraryEntry[]`, `ReadingHistory[]`.
   - **`ReadingStatus` Enum**:
     - `READING`, `COMPLETED`, `PLAN_TO_READ`, `ON_HOLD`, `DROPPED`.
   - **`LibraryEntry` Model**:
     - User-curated manga library entries with external MangaDex `seriesId`.
     - Fields: `title`, `slug`, `coverUrl`, `status`, `score` (1–10), `lastReadChapter`.
     - Constraints: Composite unique constraint `@@unique([userId, seriesId])`.
   - **`ReadingHistory` Model**:
     - Atomic reading progress persistence per series.
     - Fields: `chapterId`, `chapterNumber`, `chapterTitle`, `scrollPercent` (0.0 to 100.0), `lastReadAt`.
     - Constraints: Composite unique constraint `@@unique([userId, seriesId])`.

2. **Row-Level Security (RLS) SQL Script (`prisma/rls-policies.sql`)**:
   - Enables RLS on `User`, `LibraryEntry`, and `ReadingHistory`.
   - Enforces strict user isolation: `USING (auth.uid() = supabase_id)` or `USING (user_id IN (SELECT id FROM "User" WHERE supabase_id = auth.uid()))`.

3. **Database Client Singleton (`src/lib/db/prisma.ts`)**:
   - Global singleton pattern preventing connection exhaustion during Next.js hot module reloading.

4. **Supabase Auth Integration (`src/lib/supabase/...`)**:
   - Browser Client (`src/lib/supabase/client.ts`): Uses `createBrowserClient` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - Server Client (`src/lib/supabase/server.ts`): Uses `createServerClient` with Next.js `cookies()` for Server Components, Server Actions, and Route Handlers.
   - Middleware Session Updater (`src/lib/supabase/middleware.ts`): Refreshes expired auth tokens and updates response cookies.
   - Root Middleware (`src/middleware.ts`): Executes session refresh on requests while excluding static assets and images.

5. **Authentication Flows & UI (`src/app/auth/...`, `src/components/auth/...`)**:
   - Auth Page (`src/app/auth/page.tsx`): OLED styled tabbed form (`Sign In` / `Sign Up`) with email & password.
   - Auth Server Actions (`src/app/auth/actions.ts`): Type-safe server actions with Zod validation for `signIn`, `signUp`, and `signOut`.
   - Header Integration (`src/components/layout/app-header.tsx`): Displays user avatar/initials or Sign In CTA based on live auth state.

---

## 2. Invariants & Guardrails

1. **Secret Isolation Boundary (`context/security-best-practices.md` 1.2)**:
   - `SUPABASE_SERVICE_ROLE_KEY` and `DATABASE_URL` must never be exposed to the client bundle or prefixed with `NEXT_PUBLIC_`.
2. **Cookie Security**:
   - Session tokens are stored in `HttpOnly`, `Secure`, `SameSite=Lax` cookies managed by `@supabase/ssr`. No JWTs in `localStorage`.
3. **Anti-Slop UI Rule (`context/ui-context.md`)**:
   - Auth forms, buttons, inputs, and error states must strictly use design tokens (`surface-canvas`, `surface-card`, `surface-elevated`, `surface-border`, `brand-primary`).

---

## 3. Verification & Acceptance Criteria

- `npm run format:check` runs cleanly with 0 formatting warnings.
- `npm run typecheck` passes with 0 TypeScript compiler errors.
- `npm run lint` passes with 0 ESLint warnings or errors.
- `npm test` passes 100% of automated tests including new auth validation and database helper tests.
- `npm run build` succeeds cleanly producing valid static and dynamic routes.
