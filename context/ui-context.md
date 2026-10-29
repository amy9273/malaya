# UI Context & Design System — Malaya

This document defines the visual identity, design tokens, mobile touch ergonomics, and anti-slop consistency rules for Malaya.

---

## 1. Visual Identity & Color Palette

Malaya is designed with an **OLED Obsidian** theme optimized for high-contrast mobile reading, minimal eye strain during night binges, and battery conservation on OLED phone screens.

### 1.1 Core Surface Tokens

| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| `surface-canvas` | `#08090C` | Deepest background; reader viewport canvas |
| `surface-card` | `#111318` | Content cards, series detail cards, drawer panels |
| `surface-elevated`| `#181B22` | Modal dialogs, floating reader action dock, dropdowns |
| `surface-border` | `#262A34` | Subtle dividers, card borders, reader frame bounds |

### 1.2 Brand & Semantic Tokens

| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| `brand-primary` | `#6366F1` | Malaya Indigo; primary call-to-actions, active tab pills |
| `brand-glow` | `#4F46E5` | Focus rings, active button elevations |
| `status-reading` | `#10B981` | Emerald Green; active reading badge |
| `status-complete`| `#3B82F6` | Sky Blue; completed series status |
| `status-plan` | `#F59E0B` | Amber; plan-to-read badge |
| `status-dropped` | `#EF4444` | Crimson; dropped status |

---

## 2. Anti-Slop Guardrail (Strict UI Discipline)

1. **Zero Arbitrary Values**:
   * Never write inline styles (`style={{ ... }}`), raw hex codes (`bg-[#08090C]`), or ad-hoc padding.
   * All colors, typography, margins, and borders must reference Tailwind theme utility classes mapped to tokens.
2. **Mandatory 4-State UI Rule**:
   Every view that fetches or mutates data must explicitly implement all 4 states:
   1. **Skeleton Loading**: Pre-shaped card skeletons with shimmer animation matching the final layout. Never use a solitary spinner.
   2. **Empty State**: Clear icon, helpful message, and an immediate call-to-action button (e.g. *"Your library is empty. Browse Trending Manhwa"*).
   3. **Error State**: User-friendly explanation with a prominent *"Retry"* button.
   4. **Populated Data View**: The clean, polished content presentation.

---

## 3. Mobile Touch Ergonomics & Webtoon Layout

1. **Zero-Gap Vertical Strip**:
   * Panels must flow seamlessly with 0px vertical gaps:
     ```tsx
     <div className="flex flex-col items-center w-full bg-surface-canvas">
       <div className="w-full max-w-2xl leading-none">
         {pages.map((page, idx) => (
           <img
             key={idx}
             src={page.url}
             alt={`Panel ${idx + 1}`}
             className="w-full block select-none pointer-events-none"
             loading="lazy"
           />
         ))}
       </div>
     </div>
     ```
2. **Three-Tier Mobile Tap Zones**:
   * **Top 35%**: Tap scrolls smoothly up 1/2 screen.
   * **Center 30% (Between 35% and 65%)**: Tap toggles header bar and bottom reader floating dock.
   * **Bottom 35%**: Tap scrolls smoothly down 1/2 screen.
3. **Pinch & Double-Tap Zoom Lock**:
   * Apply `touch-action: pan-y` on the reader container to allow rapid vertical scrolling while preventing accidental browser zoom distortions.
4. **Standalone PWA Fullscreen**:
   * Configure viewport `viewport-fit=cover` and safe area insets (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`) so the reader content flows behind notch and home indicators seamlessly.
