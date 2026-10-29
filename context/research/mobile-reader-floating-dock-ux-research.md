# Mobile Webtoon Reader: Floating Menu & Usability Research

**Target:** Mobile Webtoon & Manhwa Continuous Vertical Reader  
**Focus:** Dual Floating HUD (Top Header & Bottom Dock), Tap-to-Toggle Mechanics, Thumb-Zone Ergonomics, and Touch Interaction Guardrails.

---

## 1. Executive Summary & Problem Context

In mobile webtoon reading, user immersion is paramount. Unlike manga (which consists of discrete horizontal pages), Korean manhwa is composed of a continuous, infinite vertical strip designed to be scrolled with a single thumb.

### The Core Tension

- **The Immersion Requirement**: Persistent top and bottom bars eat up 15–22% of mobile screen real estate and obscure speech bubbles, artwork, and climactic action spreads.
- **The Utility Requirement**: Readers frequently need to check progress, jump chapters, change reading width, or exit back to the series catalog without navigating away from the canvas.

**Conclusion**: The industry gold standard (used by Mihon/Tachiyomi, Kakao Webtoon, Naver Webtoon, and MangaDex) is a **Transient Dual-HUD (Heads-Up Display)**:

- A **Top Navigation Bar** (Information & Exit)
- An **Elevated Floating Bottom Dock** (Primary Navigation & Progress in the Natural Thumb Zone)
- Both elements are hidden by default, toggled on a single intentional tap, and automatically dismissed when scrolling resumes.

---

## 2. Thumb-Zone Ergonomics (Steven Hoober & Josh Clark Model)

Over 75% of mobile reading occurs with **one-handed thumb operation**. Mobile screen real estate is divided into three biomechanical zones:

```
┌─────────────────────────────────────────────────────────┐
│ [ < Back ]       Solo Leveling • Ch. 12        [ ⚙️ ]   │ ── TOP BAR (Hard-to-Reach Zone)
├─────────────────────────────────────────────────────────┤
│                                                         │
│                                                         │
│                    STRETCH ZONE                         │
│             (Active Webtoon Art Canvas)                 │
│                                                         │
│                 ┌─────────────────────┐                 │
│                 │   CENTER TAP ZONE   │                 │
│                 │  (Toggle Dual HUD)  │                 │
│                 └─────────────────────┘                 │
│                                                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│   ┌─────────────────────────────────────────────────┐   │ ── FLOATING BOTTOM DOCK
│   │ [ < Prev ]   [ 📋 Ch. 12 ]   48%   [ Next > ]   │   │    (Natural Thumb Zone)
│   └─────────────────────────────────────────────────┘   │
│                   ═══════════════════                   │ ── iOS Home Indicator (Safe Area)
└─────────────────────────────────────────────────────────┘
```

### Zone Distribution:

1. **Hard-to-Reach Zone (Top 15% of screen)**:
   - **Role**: Passive Information & Safe Exit.
   - **Controls**: Back arrow (`<`), Series Title, Current Chapter number, overflow settings (`...`).
   - **Why**: Placing destructive or frequent navigation controls here forces painful hand gymnastics.
2. **Stretch / Canvas Zone (Middle 70% of screen)**:
   - **Role**: Pure Art Canvas + Interaction Trigger.
   - **Controls**: The center 35% bounding box serves as the **Single-Tap Toggle Zone**.
3. **Natural Thumb Zone (Bottom 15% of screen)**:
   - **Role**: High-Frequency Actions.
   - **Controls**: Elevated Floating Dock containing **Previous Chapter**, **Chapter Drawer Trigger**, **Live Progress Percentage**, and **Next Chapter Button**.

---

## 3. The 3 Usability Pitfalls & Defensive Engineering Rules

Generic web readers often feel clunky and frustrating on mobile. To deliver a native app feel, Malaya must resolve these three critical touch pitfalls:

### Pitfall 1: Tap vs. Drag Collision (The "Flicker" Bug)

- **The Bug**: While rapidly flicking or dragging through a manhwa battle scene, the user lifts their thumb. A naive browser `onClick` registers this touch-up as a click, causing the menu to flash open and closed violently while scrolling.
- **The Solution (Touch Delta Threshold)**:
  Track `touchstart` and `touchend` coordinates. Only register a tap if the total Euclidean distance traveled is less than 8 pixels:
  $$\Delta = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2} < 8\text{px}$$
  If $\Delta \ge 8\text{px}$, it was an intentional scroll gesture—ignore the menu toggle.

### Pitfall 2: The Aggressive Inactivity Timer

- **The Bug**: The app sets a blind `setTimeout` to hide the menu after 3 seconds. The user taps to open the menu, tries to inspect the chapter slider or select a setting, and the menu abruptly disappears mid-interaction.
- **The Solution (Scroll-Triggered Dismissal)**:
  - Do **NOT** use an aggressive auto-hiding timer while the user is stationary.
  - **Auto-Dismiss Trigger**: The menu dismisses automatically when the user scrolls vertically by more than **40 pixels** in either direction.
  - **Explicit Dismiss Trigger**: Tapping anywhere on the canvas dismisses the menu immediately.

### Pitfall 3: System Gesture Collisions (iOS Home Indicator & Android Back Bar)

- **The Bug**: Docking a bottom toolbar flush with the bottom edge causes taps on "Next Chapter" to trigger the iOS swipe-home gesture or Android navigation pill.
- **The Solution (Floating Island Elevation)**:
  - Render the bottom dock as an **elevated floating island pill** (`rounded-2xl` or `rounded-full`).
  - Anchor with `bottom-4` + `pb-safe` (`env(safe-area-inset-bottom, 16px)`).
  - This physically detaches the dock from the system gesture zone, preventing mis-swipes.

---

## 4. Visual & Motion Design Specifications

### 4.1 Aesthetic Tokens (Matching `context/ui-context.md`)

- **Surfaces**: `bg-surface-canvas/85` with `backdrop-blur-md` and `border border-surface-border`.
- **Dock Shadow**: Deep ambient elevation shadow (`shadow-2xl shadow-black/80`).
- **Text & Icons**: Crisp high-contrast foreground (`#F1F3F9`) with active accents in `brand-primary` (`#6366F1`).

### 4.2 Smooth Micro-Animations (GPU-Accelerated)

- **Top Header Entrance**: `transition-transform duration-200 ease-out` sliding from `-translate-y-full` to `translate-y-0`.
- **Bottom Dock Entrance**: `transition-transform duration-200 ease-out` sliding from `translate-y-full` to `translate-y-0`.
- **Exit**: Slide out with `duration-150 ease-in`.

---

## 5. Proposed Interaction Specification for Unit 06

When we implement **Unit 06: Mobile Webtoon Reader Engine**, the floating HUD will consist of:

1. **Top Bar**:
   - `[ < Back ]` (Returns to `/manga/[id]`)
   - Title text truncated with chapter pill: `Omniscient Reader • Ch. 180`
   - `[ ⚙️ Settings ]` (Toggles reading width / fit modal)
2. **Bottom Floating Dock**:
   - `[ ◀ Prev ]` (Icon button, disabled if Chapter 1)
   - `[ 📑 Chapter List ]` (Pill button showing current chapter number; opens bottom sheet drawer)
   - `[ 48% ]` (Live debounced scroll percentage pill)
   - `[ Next ▶ ]` (Primary high-contrast button for effortless binge reading)
3. **Gesture Engine**:
   - Center 35% bounding box single-tap toggles HUD state.
   - Scrolling $> 40\text{px}$ smoothly slides HUD off-screen.
   - `touch-action: pan-y` active to lock pinch/double-tap accidental browser zoom.
