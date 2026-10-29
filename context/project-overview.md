# Project Overview — Malaya

**Malaya** (derived from the Filipino word for _"Free"_ / _"Unbounded"_) is an open-source, mobile-first webtoon and manhwa reading Progressive Web Application (PWA). It delivers a native-grade reading experience directly in the mobile browser without requiring app store installation or desktop hosting dependencies.

---

## 1. Problem Statement

1. **Mobile Webtoon Experience Gap**: Most web-based manga readers are desktop-oriented, cluttered with intrusive pop-up ads, or suffer from 3px inline image gaps that rupture the continuous vertical panel flow native to Korean manhwa.
2. **API & Scraper Instability**: Unofficial scanlation aggregators frequently go down, change DOM layouts, or suffer from CDN 403 Forbidden hotlink blocks.
3. **Loss of Reading Progress**: Readers switch between devices or close browser tabs, losing their exact vertical scroll position and chapter history.
4. **App Store Restrictions**: Native reading apps face stringent app store licensing barriers and content distribution hurdles.

---

## 2. Core Value Proposition

Malaya solves these friction points through a modern **Next.js 15 PWA** paired with a robust **MangaDex API Client** and **Supabase PostgreSQL synchronization**:

- **Native PWA Standalone Mode**: Tap _"Add to Home Screen"_ on iOS or Android. Launches full-screen with zero browser URL bar or bottom navigation chrome.
- **Continuous Zero-Gap Vertical Strip**: Panels render as a single infinite scroll stream with GPU-accelerated CSS and debounced lazy loading to prevent mobile Out-of-Memory (OOM) crashes.
- **Mobile Touch Ergonomics**:
  - Center 30% screen tap toggles header and bottom navigation dock.
  - Top/Bottom tap zones for step scrolling.
  - Double-tap and pinch zoom lock (`touch-action: pan-y`) preventing accidental screen distortion.
- **Legitimate & Stable Catalog**: Connects to the **MangaDex REST API** (indexing 8,800+ Korean manhwa with official distributed CDN image nodes).
- **Hardened Image Proxy**: In-app Next.js image proxy with strict SSRF filtering, domain whitelisting, and private IP blocking.
- **Cloud Progress Sync**: Automatically records chapter progress, reading status (_Reading_, _Completed_, _Plan to Read_, _On Hold_, _Dropped_), and vertical scroll percentage via Supabase PostgreSQL.

---

## 3. Target User Personas

1. **The Mobile Commuter ("Late Night & Transit Reader")**:
   - Reads 50-panel manhwa chapters during commutes or in bed on a phone with one hand.
   - Demands high contrast dark mode, zero loading stutter, and pre-fetched next chapter panels.
2. **The Manhwa Binge-Reader ("The Progression Fan")**:
   - Tracks dozens of action, regression, and dungeon manhwa titles.
   - Demands accurate chapter update feeds, unread chapter counters, and seamless resume prompts (_"Resume Chapter 45 at 68%?"_).
3. **The Portfolio Reviewer ("The Engineering Evaluator")**:
   - Examines code quality, mobile responsiveness, SSRF protection, database migrations, CI/CD pipelines, and clean architecture.

---

## 4. Key Functional Modules

| Module                     | Core Responsibility                                                                                                                     |
| :------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| **Catalog & Discovery**    | Paginated manhwa exploration, search with debounced autocomplete, genre filtering, and sorting (popular, latest, rating).               |
| **Title Detail**           | Series banner, synopsis, tags, author/artist credits, and asc/desc sortable chapter table with read markers.                            |
| **Webtoon Reader Engine**  | Infinite vertical strip, customizable reading width (600px to 100%, default 100% on mobile), fullscreen mode, next chapter prefetching. |
| **Personal Library**       | Tabbed organization (_Reading_, _Completed_, _Plan to Read_, _On Hold_), personal ratings, and favorites.                               |
| **Progress Persistence**   | Debounced scroll position tracking (saves every 1.5s), auto-resume modal, and unread chapter synchronization.                           |
| **Security & Image Proxy** | Hotlink bypass with strict SSRF defense, DNS private IP resolution blocking, and HTTP security headers.                                 |

---

## 5. Success Criteria & Metrics

1. **Mobile Lighthouse Score**: $\ge 90$ for Performance, Accessibility, Best Practices, and PWA criteria.
2. **Zero Layout Shifts (CLS < 0.05)**: Pre-allocated aspect-ratio placeholders for manhwa panels during image fetch.
3. **Zero Secrets in Repository**: Strict `.gitignore`, pre-commit secret scanning, and automated GitHub Push Protection.
4. **Resilient Image Streaming**: 100% of chapter panels render without 403 Forbidden errors or broken image icons.
