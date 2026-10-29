# System Architecture & Invariants — Malaya

This document specifies the architectural topology, service boundaries, data schemas, and invariants governing the Malaya platform.

---

## 1. System Architecture Topology

Malaya is architected as a full-stack, cloud-native Next.js 15 application utilizing the React Server Components (RSC) paradigm, running on Vercel Edge/Serverless infrastructure with Supabase Managed PostgreSQL.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (Mobile PWA)                       │
│  - Standalone PWA Window (Zero browser chrome / URL bar)               │
│  - Webtoon Reader Engine (Continuous vertical strip, Touch zones)     │
│  - Local Reading Cache & Debounced Scroll Observer                     │
└───────────────────▲───────────────────────────────▲────────────────────┘
                    │ HTTPS / JSON                  │ Image Streams
                    ▼                               ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   NEXT.JS 15 APPLICATION SERVER                        │
│                                                                        │
│   [Server Components]        [Route Handlers]      [Server Actions]    │
│   - Catalog / Discovery      - /api/proxy-image    - Add to Library    │
│   - Series Detail SSR        - /api/search         - Update Progress   │
│   - Metadata SEO             - Health Probes       - Score & Review    │
│                                                                        │
│   [Security Layer]                                                     │
│   - SSRF Guard (Private IP / DNS Resolution Blocker)                   │
│   - Upstash Sliding Window Rate Limiter                                │
│   - Security Headers Middleware (CSP, HSTS, X-Frame-Options)           │
└───────────────────▲───────────────────────────────▲────────────────────┘
                    │                               │
        External API│                               │ SQL / RLS
                    ▼                               ▼
┌───────────────────────────────┐       ┌────────────────────────────────┐
│       MANGADEX REST API       │       │    SUPABASE POSTGRESQL + AUTH  │
│  - 8,800+ Manhwa Catalog      │       │  - User Authentication (JWT)   │
│  - Multi-language Chapters    │       │  - User Library & Progress     │
│  - MangaDex@Home Image Nodes  │       │  - Row-Level Security (RLS)    │
└───────────────────────────────┘       └────────────────────────────────┘
```

---

## 2. Architectural Invariants

Every pull request and code modification must satisfy the following 6 invariants:

### Invariant 1: SSRF & Network Isolation

- The `/api/proxy-image` route handler must never fetch from any host that resolves to loopback (`127.0.0.0/8`), private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), link-local metadata (`169.254.169.254`), or IPv6 equivalents.
- All incoming proxy URLs must use `https:` and match whitelisted CDN hostname patterns.

### Invariant 2: Zero Floating Gap Rendering

- Webtoon vertical strips must never suffer from default inline image gaps. All image elements in the reader must be styled with `display: block`, zero padding, zero margin, and container line-height set to 0.

### Invariant 3: Debounced Progress Throttling

- Reading progress updates must be debounced by a minimum of **1,500ms** on the client before dispatching to the database.
- The client must never fire a database mutation on every scroll pixel event.

### Invariant 4: Row-Level Security Isolation

- Users can only read, insert, update, or delete their own `LibraryEntry`, `ReadingHistory`, and `Bookmark` records.
- Every database table must enforce PostgreSQL RLS policies keyed to `auth.uid() = user_id`.

### Invariant 5: Secret Isolation Boundary

- No server secret (e.g. `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`) may be exposed to the browser or prefixed with `NEXT_PUBLIC_`.
- Secret leakage in code or git commits is a catastrophic build failure.

### Invariant 6: 4-State UI Completeness

- Every data-fetching screen or widget must implement all four UI states: **Skeleton Loading**, **Empty State**, **Error with Retry**, and **Populated View**.

---

## 3. Database Schema (PostgreSQL via Prisma ORM)

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id             String           @id @default(uuid())
  supabaseId     String           @unique
  email          String           @unique
  displayName    String?
  avatarUrl      String?
  library        LibraryEntry[]
  readingHistory ReadingHistory[]
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt

  @@index([supabaseId])
}

enum ReadingStatus {
  READING
  COMPLETED
  PLAN_TO_READ
  ON_HOLD
  DROPPED
}

model LibraryEntry {
  id              String        @id @default(uuid())
  userId          String
  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  seriesId        String        // External ID (e.g., MangaDex UUID)
  title           String
  slug            String
  coverUrl        String
  status          ReadingStatus @default(READING)
  score           Int?          // User score 1 to 10
  lastReadChapter String?
  updatedAt       DateTime      @updatedAt
  createdAt       DateTime      @default(now())

  @@unique([userId, seriesId])
  @@index([userId, status])
}

model ReadingHistory {
  id            String   @id @default(uuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  seriesId      String
  chapterId     String
  chapterNumber Float
  chapterTitle  String?
  scrollPercent Float    @default(0) // 0.0 to 100.0%
  lastReadAt    DateTime @default(now())

  @@unique([userId, seriesId])
  @@index([userId, lastReadAt])
}
```

---

## 4. Key Request Flows

### 4.1 Chapter Reading Flow

1. Client requests `/read/[chapterId]`.
2. Server Component fetches chapter panel metadata from MangaDex API:
   - `GET https://api.mangadex.org/at-home/server/{chapterId}`
   - Returns base CDN node URL and page filename hashes.
3. Next.js generates panel image URLs routed through the secure proxy:
   - `/api/proxy-image?url=${encodeURIComponent(pageUrl)}`
4. Client renders vertical continuous strip with lazy loading and intersection observer.
5. Client debounces scroll position and syncs reading progress to Supabase.
