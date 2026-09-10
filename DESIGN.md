---
name: Invoicify
description: Simple self-hosted invoicing for a small IT company.
colors:
  mint-ledger: "#24D6AE"
  ledger-ink: "#0D1515"
  paper: "oklch(1 0 0)"
  ink: "oklch(0.141 0.005 285.823)"
  muted-mist: "oklch(0.967 0.001 286.375)"
  muted-ink: "oklch(0.552 0.016 285.938)"
  deep-current: "oklch(0.52 0.105 223.128)"
  signal-red: "oklch(0.577 0.245 27.325)"
  hairline: "oklch(0.92 0.004 286.32)"
typography:
  display:
    fontFamily: "Manrope Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Manrope Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Manrope Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.mint-ledger}"
    textColor: "{colors.ledger-ink}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "32px"
  button-primary-hover:
    backgroundColor: "{colors.mint-ledger}"
    textColor: "{colors.ledger-ink}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "32px"
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "32px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "20px"
---

# Design System: Invoicify

## Overview

**Creative North Star: "The Ledger Atelier"**

Invoicify is a dense, efficient operations surface for sending invoices and getting paid. The aesthetic is strictly utilitarian: flat paper surfaces, hairline borders, compact controls, and tabular numerals. Craft shows in alignment, spacing rhythm, and correct money math — never in decoration.

The mint ledger accent marks action and active state only. Everything else stays neutral so status (sent, overdue, paid, draft) reads instantly. Motion is minimal and respectful of reduced-motion: short fades, small rises, animated totals.

**Key Characteristics:**
- Dense and efficient: compact 32px controls, tight gaps, data-first tables.
- Flat by default: borders separate, shadows respond to hover/focus only.
- One accent voice: Mint Ledger carries primary action and active nav.

## Colors

Utilitarian neutrals with a single mint accent and a deep teal support tone.

### Primary
- **Mint Ledger** (#24D6AE): Primary actions, active nav text and dot, focus accents. Used at ≤10% of any screen. Foreground pairing is Ledger Ink (#0D1515).

### Secondary
- **Deep Current** (oklch(0.52 0.105 223.128)): Charts, secondary emphasis, deep support tone. Never competes with Mint Ledger for primary action.

### Tertiary
- **Signal Red** (oklch(0.577 0.245 27.325)): Destructive and error only, usually as tinted backgrounds (10–20% opacity) with matching text.

### Neutral
- **Paper** (oklch(1 0 0)): App background, card and popover fill.
- **Ink** (oklch(0.141 0.005 285.823)): Primary text, card foreground.
- **Muted Mist** (oklch(0.967 0.001 286.375)): Secondary fills, sidebar accent, draft tone wash.
- **Muted Ink** (oklch(0.552 0.016 285.938)): Secondary text, descriptions, table subtext.
- **Hairline** (oklch(0.92 0.004 286.32)): Borders, inputs, dividers.

### Named Rules
**The One Voice Rule.** Mint Ledger appears on primary buttons, active nav, and status highlights only. Its rarity is the point.

## Typography

**Display Font:** Manrope Variable (with ui-sans-serif, system-ui fallback)
**Body Font:** Manrope Variable (with ui-sans-serif, system-ui fallback)

**Character:** Strictly utilitarian grotesque. Semibold headings with tight tracking, regular body, tabular numerals for all money.

### Hierarchy
- **Display** (600, 1.5rem / 24px, 1.2): Page titles only (e.g. `text-xl font-semibold tracking-tight`).
- **Headline** (600, 1.25rem, 1.3): Section heads inside long forms.
- **Title** (500, 0.875rem, 1.4): Card labels, sidebar group labels.
- **Body** (400, 0.875rem, 1.5): Default UI text, table cells, 65–75ch max in reading areas.
- **Label** (500, 0.75rem, 1.4): Captions, subtext, muted descriptions (`text-xs text-muted-foreground`).

### Named Rules
**The Tabular Numerals Rule.** All currency and counts use `tabular-nums`; animated totals ease over 0.7s and freeze under reduced-motion.

## Layout

Sidebar-led ops shell: 13.5rem icon-collapsible sidebar, sticky 56px top bar with breadcrumb, centered `max-w-5xl` content at `px-4 py-6` (sm: `px-6 py-8`). Page header is title + muted subtitle left, actions right, wrapping on narrow screens.

Density is comfortable-dense: summary cards in `grid gap-4 sm:grid-cols-2 xl:grid-cols-4`, tables with compact rows, forms in single-column stacks with 16–24px rhythm. Desktop-first; sidebar collapses to icons, grids collapse to 1–2 columns on mobile.

## Elevation & Depth

Flat by default. Depth is conveyed by hairline borders and tonal layering, not shadows.

### Shadow Vocabulary
- **Hover lift** (`box-shadow: 0 4px 12px rgba(0,0,0,0.08)`): Summary cards on hover with -2px rise, 200ms duration.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, elevation, focus).

## Shapes

Gently rounded efficiency: 10px base radius. Buttons at 8–10px (`rounded-lg`), cards at 12px (`rounded-xl`), avatars and icon washes at 8px. Status dots are full-round 6px dots. Borders are 1px hairlines; no clipping or angled geometry.

## Components

### Buttons
- **Shape:** Gently rounded rectangles (8–10px radius).
- **Primary:** Mint Ledger fill, Ledger Ink text, 32px height, 10px horizontal padding, semibold 14px.
- **Hover / Focus:** Primary darkens to 80% opacity; focus shows 1px ring at 40% opacity. Active press translates 1px down.
- **Secondary / Ghost / Tertiary:** Secondary uses muted mist fill; outline uses paper fill with hairline border; ghost uses transparent fill with muted hover wash; destructive uses 10% red wash with red text.

### Chips
- **Style:** Compact status badges with tinted wash (mint, amber, emerald, muted) and matching 12px medium text.
- **State:** Selected state deepens wash; no outline-only variants for status.

### Cards / Containers
- **Corner Style:** Rounded 12px.
- **Background:** Paper white, ink text.
- **Shadow Strategy:** Flat at rest; hover lift only (see Elevation).
- **Border:** 1px hairline via base layer.
- **Internal Padding:** 20px (`p-5`).

### Inputs / Fields
- **Style:** Transparent or paper fill, 1px hairline border, 8px radius, 14px text.
- **Focus:** Border shifts to ring color with 1px ring at 40% opacity.
- **Error / Disabled:** Error uses red border with 20% red ring; disabled drops opacity to 50% with no pointer events.

### Navigation
- Sidebar menu buttons: 36px height, 12px radius, medium 14px type. Active item uses 10% mint wash with mint text and semibold weight plus a 6px mint dot at the trailing edge. Icons inherit mint in the workspace group. Top bar holds breadcrumb left, mode toggle and notification bell right.

## Do's and Don'ts

### Do:
- **Do** keep money in tabular numerals with ₱ formatting and two decimals.
- **Do** reserve Mint Ledger for primary action and active state (≤10% coverage).
- **Do** use hairline borders for separation before reaching for shadows.
- **Do** honor reduced-motion: fade only, no rise or count-up.

### Don't:
- **Don't** introduce a second accent hue for primary actions.
- **Don't** add marketing gradients, hero imagery, or decorative illustration to ops screens.
- **Don't** use shadows at rest on cards, inputs, or sidebar.
- **Don't** break admin/client separation or per-client invoice scoping for visual convenience.
