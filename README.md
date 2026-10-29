<div align="center">

# 📖 Malaya

**Mobile-First Webtoon & Manhwa Reading Operating System (PWA)**  
_An open-source, high-performance webtoon reader with continuous vertical streaming, MangaDex API integration, and cloud progress sync._

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_DB-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Project Overview](./context/project-overview.md) • [Architecture](./context/architecture.md) • [Security Guide](./context/security-best-practices.md) • [UI Tokens](./context/ui-context.md) • [Build Plan](./context/specs/00-build-plan.md)

</div>

---

## 🎯 Executive Summary

**Malaya** (Tagalog for *"Free"* / *"Unbounded"*) is an open-source, mobile-first manhwa reading Progressive Web Application (PWA). Built to eliminate the clunky desktop layouts, intrusive popups, and 3px vertical image gap issues common to generic manga readers, Malaya delivers a seamless, native-grade webtoon experience directly in the mobile browser.

Built strictly adhering to the **Seven-File Context Methodology**, Malaya demonstrates clean architecture, hardened SSRF defense, atomic reading progress synchronization, and zero-gap GPU-accelerated continuous vertical scrolling.

---

## ✨ Key Features

- **📱 Standalone Mobile PWA**: Tap *"Add to Home Screen"* on iOS or Android to launch full-screen with zero browser URL bar or bottom navigation chrome.
- **📜 Zero-Gap Continuous Vertical Reader**: Renders manhwa panels as a single seamless strip with GPU-accelerated CSS and debounced lazy loading.
- **👆 3-Tier Mobile Touch Ergonomics**:
  - Center 30% screen tap toggles floating controls dock.
  - Top and bottom 35% zones for single-hand step scrolling.
  - Double-tap and pinch-zoom lock (`touch-action: pan-y`) preventing layout distortion.
- **🛡️ Hardened Image Proxy**: In-app Next.js proxy route with strict SSRF defense (blocking loopback, private subnets, and cloud metadata IPs) to bypass third-party CDN hotlink restrictions safely.
- **📚 Rich Manhwa Catalog**: Powered by the **MangaDex REST API**, indexing 8,800+ Korean manhwa with genre filters (Action, Regression, Fantasy, Martial Arts) and search.
- **💾 Cloud Reading Synchronization**: Automatically persists chapter progress, unread badges, and exact scroll percentages to a Supabase PostgreSQL backend.

---

## 🛠️ Tech Stack & Architecture

- **Frontend & App Framework**: Next.js 15 (App Router, React Server Components), TypeScript 5.7+, Tailwind CSS.
- **UI Components & Icons**: shadcn/ui primitives, Lucide React icons.
- **Data Source**: MangaDex REST API + Hardened `/api/proxy-image` with SSRF protection.
- **Database & Auth**: PostgreSQL via Prisma ORM + Supabase Auth (`@supabase/ssr`).
- **State & Caching**: TanStack Query (React Query) for client prefetching.
- **Hosting**: Vercel (Edge & Serverless).

---

## 📖 Architecture & Standards Documentation

Before contributing or modifying code, consult the context files:

- [`CLAUDE.md`](./CLAUDE.md) / [`AGENTS.md`](./AGENTS.md) — Operating rules and workflow discipline.
- [`context/project-overview.md`](./context/project-overview.md) — Product definition, personas, and mobile ergonomics.
- [`context/architecture.md`](./context/architecture.md) — System boundaries, data schemas, and invariants.
- [`context/security-best-practices.md`](./context/security-best-practices.md) — Secrets management, SSRF proxy hardening, and repository security.
- [`context/engineering-best-practices.md`](./context/engineering-best-practices.md) — Performance, debounced scroll persistence, and connection hygiene.
- [`context/ui-context.md`](./context/ui-context.md) — OLED Obsidian theme tokens and the mandatory 4-state UI rule.
- [`context/code-standards.md`](./context/code-standards.md) — TypeScript strictness, Server/Client component boundaries, and CI quality gates.
- [`context/ai-workflow-rules.md`](./context/ai-workflow-rules.md) — Spec-driven discipline and verification rules.
- [`context/progress-tracker.md`](./context/progress-tracker.md) — Implementation status and milestones.

---

## 📄 License

MIT © [Amaya](https://github.com/amy9273)
