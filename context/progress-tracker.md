# Progress Tracker — Malaya

## Current Status: Unit 02 Complete (Hardened Image Proxy & SSRF Defense)

---

### Implementation Phases

| Phase                                                 | Description                                                                                      | Status      |
| :---------------------------------------------------- | :----------------------------------------------------------------------------------------------- | :---------- |
| **Unit 00: Specs, Security & Architecture Blueprint** | Context documentation, security best practices, hardened gitignore, initial repo push            | ✅ Complete |
| **Unit 01: Next.js 15 PWA Scaffold & Theme**          | Next.js 15 App Router, Tailwind CSS, OLED theme tokens, PWA manifest, CI scripts                 | ✅ Complete |
| **Unit 02: Hardened Image Proxy & SSRF Defense**      | Secure `/api/proxy-image` route handler with private IP blocking and domain whitelisting         | ✅ Complete |
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

- **Unit 02: Hardened Image Proxy & SSRF Defense (`/api/proxy-image`)**:
  - Implemented unit spec `context/specs/02-security-image-proxy.md`.
  - Built SSRF defense validator in `src/lib/security/ssrf-validator.ts`:
    - Protocol enforcement: strictly `https:`.
    - Hostname blocklist: `localhost`, `127.0.0.1`, `0.0.0.0`, `::1`, `169.254.169.254` (cloud instance metadata).
    - Numeric IP blocking: rejects direct IPv4 and IPv6 hostnames.
    - Whitelist validation: `uploads.mangadex.org`, `*.mangadex.org`, `*.mangadex.network`.
    - MIME-type validation: allows `image/jpeg`, `image/png`, `image/webp`, `image/avif`; strictly blocks `image/svg+xml` (preventing Stored XSS) and non-images.
    - Non-standard port rejection (only standard HTTPS port 443 permitted).
  - Built Route Handler in `src/app/api/proxy-image/route.ts`:
    - Strict SSRF input validation.
    - 10-second timeout with `AbortSignal.timeout(10000)`.
    - Upstream `Referer` and `User-Agent` headers.
    - 15MB payload size protection.
    - Caching headers: `public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400`.
    - Security header: `X-Content-Type-Options: nosniff`.
  - Authored automated security test suite in `src/lib/security/__tests__/ssrf-validator.test.ts`:
    - 14/14 security and protocol tests passing (100% pass rate).
  - Executed and passed the complete verification loop:
    - `npm run format:check`: 100% Prettier compliant.
    - `npm run typecheck`: 0 TypeScript compiler errors.
    - `npm run lint`: 0 ESLint warnings or errors.
    - `npm test`: 14 tests passing across 4 test suites.
    - `npm run build`: Next.js production build compiled cleanly in 4.0s.

---

### Next Step

- Await user approval to merge `feat/unit-02-hardened-image-proxy` and proceed to **Unit 03: MangaDex API Client & Type Definitions**.
