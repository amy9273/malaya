# Progress Tracker — Malaya

## Current Status: Unit 00 Complete (Context Architecture, Security Blueprint & Repository Setup)

---

### Implementation Phases

| Phase | Description | Status |
| :--- | :--- | :--- |
| **Unit 00: Specs, Security & Architecture Blueprint** | Context documentation, security best practices, hardened gitignore, initial repo push | ✅ Complete |
| **Unit 01: Next.js 15 PWA Scaffold & Theme** | Next.js 15 App Router, Tailwind CSS, OLED theme tokens, PWA manifest, CI scripts | ⏳ Pending |
| **Unit 02: Hardened Image Proxy & SSRF Defense** | Secure `/api/proxy-image` route handler with private IP blocking and domain whitelisting | ⏳ Pending |
| **Unit 03: MangaDex API Client & Type Definitions** | Typed REST client for 8,800+ Korean manhwa catalog, search, and chapter streaming | ⏳ Pending |
| **Unit 04: Catalog & Discovery UI** | Trending carousel, paginated manhwa cards, genre chips, 4-state UI loading skeletons | ⏳ Pending |
| **Unit 05: Series Detail & Chapter Index** | Series banner, synopsis, tags, author/artist credits, sortable chapter list with asc/desc toggle | ⏳ Pending |
| **Unit 06: Mobile Webtoon Reader Engine** | Zero-gap vertical continuous strip, 3-tier mobile tap zones, width controls, fullscreen mode | ⏳ Pending |
| **Unit 07: Database Models & Supabase Auth** | Prisma schema, Supabase Auth integration, RLS policies, connection pooling | ⏳ Pending |
| **Unit 08: Reading Progress & Auto-Resume** | Debounced scroll position tracker (1,500ms), auto-resume modal prompt | ⏳ Pending |
| **Unit 09: Personal Library Dashboard** | Reading, Completed, Plan to Read, On Hold tabs, user rating, and favorites | ⏳ Pending |
| **Unit 10: Search & Autocomplete** | Header search modal with debounced query autocomplete, search history | ⏳ Pending |
| **Unit 11: Next Chapter Prefetch & PWA Offline** | Smart background panel prefetching, PWA Service Worker caching | ⏳ Pending |
| **Unit 12: CI/CD & Production Hardening** | GitHub Actions pipeline (`ci.yml`), automated testing quality gate, Vercel verification | ⏳ Pending |

---

### Recent Changes

- Initialized GitHub repository at `https://github.com/amy9273/malaya.git` on `main`.
- Formulated the complete **7-File Context Architecture**:
  - `CLAUDE.md` and `AGENTS.md`: Operating directives, sequence, and spec-driven rules.
  - `context/project-overview.md`: Product vision, target personas, mobile webtoon ergonomics, success criteria.
  - `context/architecture.md`: System topology, boundaries, architectural invariants, Prisma schema.
  - `context/security-best-practices.md`: Mandatory security guide (zero secrets, `NEXT_PUBLIC_` isolation, SSRF prevention on image proxies, DNS private IP resolution blocking, pre-commit gitleaks, RLS).
  - `context/engineering-best-practices.md`: Performance guidelines, zero-gap layout, debounced scroll sync, connection hygiene.
  - `context/ui-context.md`: OLED Obsidian color tokens, anti-slop rules, mandatory 4-state UI, 3-tier mobile touch zones.
  - `context/code-standards.md`: Next.js 15, TypeScript 5.7+ strictness, non-null guards, quality gates.
  - `context/ai-workflow-rules.md`: Spec-driven discipline, single-unit execution, upstream sync discipline.
  - `context/specs/00-build-plan.md`: Master 13-unit sequential implementation roadmap.
- Formulated hardened `.gitignore` preventing secrets, `.env*`, and build outputs from ever reaching source control.
- Created `.env.example` as a clean environment variables template.

---

### Next Step

- Await user approval to proceed to **Unit 01: Next.js 15 PWA Scaffold & Theme Configuration**.
