# Code Standards & Quality Gates — Malaya

This document governs the coding conventions, TypeScript strictness, and automated verification requirements for the Malaya platform.

---

## 1. Technology Stack Standards

- **Framework**: Next.js 15 (App Router, React Server Components).
- **Language**: TypeScript 5.7+ running under strict mode.
- **Styling**: Tailwind CSS with shadcn/ui primitives.
- **Icons**: Lucide React (`lucide-react`).
- **Database & Auth**: PostgreSQL via Prisma ORM + Supabase Auth (`@supabase/ssr`).
- **Data Fetching & State**: TanStack Query (React Query) for client-side caching; native RSC for server-side queries.

---

## 2. TypeScript Strictness & Type Safety Rules

1. **Zero `any` Policy**:
   * Never use `any`. Use `unknown` with runtime type narrowing (Zod, `typeof`, `instanceof`) or define concrete TypeScript interfaces.
2. **Mandatory Non-Null Guards**:
   * Never use non-null assertions (`!`).
   * When fetching from arrays or nullable database queries, place an explicit guard immediately after the fetch:
     ```typescript
     const entry = await prisma.libraryEntry.findUnique({ where: { id } });
     if (!entry) {
       throw new NotFoundError(`Library entry not found: ${id}`);
     }
     ```
3. **Explicit Callback Typing (TS7006 Prevention)**:
   * Always provide explicit parameter types for lambda functions inside `.map()`, `.filter()`, and `.reduce()` to ensure zero inference errors regardless of IDE language server state.
4. **Prisma Type Isolation**:
   * Use `Prisma.<Model>GetPayload<{ include: { ... } }>` to generate explicit types for complex query results.

---

## 3. Server vs. Client Component Boundaries

1. **Default to Server Components**:
   * Every page, layout, and catalog listing must be a React Server Component by default.
2. **Isolate `"use client"` to Leaves**:
   * Only mark interactive leaf components with `"use client"` (e.g. Reader viewport, Theme toggle, Library status dropdown, Search input).
   * Never place `"use client"` at the top of a page route unless strictly required.
3. **No Secret Props Passing**:
   * Never pass server environment variables or raw database connection objects into Client Component props.

---

## 4. Automated Verification Quality Gate

Every feature branch and pull request must execute and cleanly pass the automated 4-stage quality gate:

```bash
# 1. Code Formatting
npm run format:check   # Prettier verification across all files

# 2. Strict Typecheck
npm run typecheck      # tsc --noEmit with zero compiler errors

# 3. Linter Verification
npm run lint           # ESLint with zero warnings or errors

# 4. Automated Test Suite
npm test               # All unit and integration tests passing
```
