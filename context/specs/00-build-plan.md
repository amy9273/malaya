# Build Plan & Implementation Specs — Malaya

This document defines the sequential, unit-by-unit engineering plan for the Malaya platform.

---

## Unit Specifications Breakdown

| Unit        | Title                                         | Scope & Deliverables                                                                                                                           | Status      |
| :---------- | :-------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- | :---------- |
| **Unit 00** | `00-build-plan.md`                            | Context architecture, security baseline, initial Git repository setup.                                                                         | ✅ Complete |
| **Unit 01** | `01-nextjs-pwa-scaffold.md`                   | Next.js 15 App Router scaffolding, Tailwind CSS, OLED theme tokens, PWA manifest, CI scripts.                                                  | ✅ Complete |
| **Unit 02** | `02-security-image-proxy.md`                  | Hardened `/api/proxy-image` with SSRF defense (DNS private IP blocking, domain whitelist, MIME validation) + tests.                            | ⏳ Pending  |
| **Unit 03** | `03-mangadex-api-client.md`                   | Typed MangaDex REST client (Catalog query with `originalLanguage[]=ko`, search, detail, chapter list, at-home server panel resolution).        | ⏳ Pending  |
| **Unit 04** | `04-catalog-and-discovery-ui.md`              | Homepage hero banner, trending manhwa carousel, paginated catalog grid, genre filters, 4-state UI skeletons.                                   | ⏳ Pending  |
| **Unit 05** | `05-title-detail-and-chapters.md`             | Series detail view (banner, synopsis, tags, author/artist credits, sortable chapter list with asc/desc toggle and read badges).                | ⏳ Pending  |
| **Unit 06** | `06-webtoon-vertical-reader-engine.md`        | Mobile-first vertical strip reader, zero-gap layout, 3-tier mobile tap zones, reading width slider, fullscreen toggle, next/prev chapter jump. | ⏳ Pending  |
| **Unit 07** | `07-database-models-supabase-auth.md`         | Prisma schema (User, LibraryEntry, ReadingHistory), Supabase Auth integration, RLS policies, connection singleton.                             | ⏳ Pending  |
| **Unit 08** | `08-reading-progress-and-resume.md`           | Debounced scroll position tracker (1,500ms), automatic progress persistence, "Resume from X%" prompt.                                          | ⏳ Pending  |
| **Unit 09** | `09-personal-library-and-tracker.md`          | User library dashboard (Reading, Completed, Plan to Read, On Hold), status updating, custom ratings.                                           | ⏳ Pending  |
| **Unit 10** | `10-search-and-autocomplete.md`               | Header search modal with debounced query autocomplete, search history, and instant results navigation.                                         | ⏳ Pending  |
| **Unit 11** | `11-next-chapter-prefetch-and-pwa-offline.md` | Background prefetching of next chapter panels, PWA Service Worker caching, offline shell fallback.                                             | ⏳ Pending  |
| **Unit 12** | `12-ci-cd-and-production-hardening.md`        | GitHub Actions CI pipeline (`ci.yml`), automated tests, Vercel deployment verification.                                                        | ⏳ Pending  |
