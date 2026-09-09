---
target: redundancy of elements, components, ui
total_score: 22
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:C:\\Users\\Andrew\\Desktop\\Invoicify\\resources\\js\\components"
timestamp: 2026-09-09T14-25-59Z
slug: resources-js-components
---
# Critique — resources/js/components (redundancy pass)

## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Dual filter sources (cards + pills) disagree on active state; bell aggregates two counts into one dot |
| 2 | Match System / Real World | 3 | Invoicing language is plain; hold-for-1.2s / swipe / 5s-undo are system idioms, not user language |
| 3 | User Control and Freedom | 2 | Undo exists only in InvoiceForm; hold-to-confirm and swipe flows have no undo or Esc path |
| 4 | Consistency and Standards | 1 | 5 button languages, 2 badges, 2 filter bars, 3 delete patterns, 2 password-visibility implementations |
| 5 | Error Prevention | 2 | Good where present (hold, stepper clamp, password rules) but coverage is single-screen only |
| 6 | Recognition Rather Than Recall | 2 | Swipe affordance hidden; stepper/bell/share are icon-only; must recall which filter bar owns state |
| 7 | Flexibility and Efficiency | 2 | No shortcuts, no bulk actions; DataTable sort/paginate is the only accelerator |
| 8 | Aesthetic and Minimalist Design | 1 | Dead SpecularButton (252 lines, 0 uses), near-dead Badge, triple delete stack, double filter bar |
| 9 | Error Recovery | 3 | Sonner + FlashToaster + UndoPill preserve work where wired; messages are plain-language |
| 10 | Help and Documentation | 2 | Password checklist is good; empty states ("No results.") teach nothing |
| **Total** | | **22/40** | **Acceptable** |

## Design Specificity Verdict
**LLM assessment**: The composition is category-interchangeable shadcn + bespoke motion widgets, not an authored Invoicify world. Structural sameness: every destructive action got its own bespoke physics (hold ring, swipe spring, undo countdown) instead of one Invoicify destructive language. Missed opportunity: money-story surfaces (StatCards, payment Rows) could carry a single ink/ledger voice; instead Outstanding double-counts Overdue and paid/approved share identical badge classes.
**Deterministic scan**: `impeccable detect --json resources/js/components` returned 2 findings, both `gray-on-color` warnings in `ui/swipe-to-delete.tsx:231` (`text-neutral-600/300 on bg-rose-50`). No other structural flags — expected, since the detector does not model cross-file API duplication. Browser visualization skipped: no browser automation exposed in this session, no overlay injected.

## Overall Impression
What works is the domain core (StatusBadge text labels, DataTable, payment Rows). What doesn't is the component API surface: at least 7 near-duplicate families coexist, one 252-line WebGL button ships zero usages, and two layouts are a 90% copy-paste. Biggest opportunity: collapse to one Button, one Badge, one ShellLayout, one destructive flow.

## What's Working
1. **StatusBadge text + icon pairing** (`ui/status-badge.tsx:80-108`) — label carries meaning, never color alone; shared by admin + client Show pages via `PaymentDetailCards`.
2. **DataTable as single table language** (`DataTable.jsx`) — TanStack sort/filter/paginate with shadcn primitives, reused by invoice indexes instead of N bespoke tables.
3. **PaymentDetailsCard shared money wall** (`PaymentDetailCards.jsx:24-88`) — comment states intent explicitly; admin + client read the same pesos/dates story.

## Priority Issues
### [P1] Five button dialects, no single Button API
**What**: `button.tsx` (cva, 6 variants) vs `loading-button.tsx` (spinner wrap) vs `SpecularButton.jsx` (252-line OGL shader, default 'Get Started', 0 usages) vs `share-button.tsx` (443 lines, own neutral-round base) vs `hold-to-confirm.tsx` (396 lines, pill-rose, own SIZES).
**Why it matters**: Authors guess which button to reach for; users meet 3 visual languages (shadcn rounded-lg, pill rounded-full, WebGL specular). Sizing scales are incompatible (shadcn xs/sm/lg vs Specular sm/md/lg px values vs Hold SIZES).
**Fix**: Delete `SpecularButton.jsx`. Fold loading into `Button` (`loading` prop). Demote Share/Hold to `Button` variants, not parallel systems.
**Suggested command**: /impeccable distill

### [P1] AppLayout vs ClientLayout is a 90% fork
**What**: `AppLayout.jsx` (281 lines) vs `ClientLayout.jsx` (261 lines) — identical SidebarProvider/FlashToaster/Sidebar/Breadcrumb/ModeToggle/NotificationBell/PageTransition/title block; diff is navConfig (4 vs 2), badge (Admin vs Client), bellCount math, one dropdown item.
**Why it matters**: Every shell change ships twice or drifts. Bell destination logic already diverged (pendingPayments>0 ternary vs static dashboard).
**Fix**: One `ShellLayout({nav, badge, bellCount, bellHref, accountMenu})`; App/Client become configs.
**Suggested command**: /impeccable distill

### [P1] Three destructive-action languages on one form
**What**: `InvoiceForm.jsx` imports `SwipeToDelete` + `UndoPill`; `Invoices/Show.jsx` adds `HoldToConfirmButton`. Swipe (drag physics, 253 lines) vs hold-1.2s ring vs 5s undo countdown (rAF, 324 lines) — mutually unlearnable.
**Why it matters**: Deleting a line item vs deleting an invoice teaches opposite gestures; only one path offers undo. Detector's only hits (gray-on-rose swipe row) sit on this path.
**Fix**: Pick one destructive contract (e.g. immediate + UndoPill everywhere), delete or gate the other two to touch-only.
**Suggested command**: /impeccable harden

### [P2] Badge duality + filter-bar duality
**What**: `badge.tsx` (generic, ~1 live use in Clients/Show) vs `status-badge.tsx` (8 statuses, 5+ uses; paid/approved identical classes; draft/expired identical). `InvoiceSummaryCards` (clickable stat cards, ring-2 active) stacked over `InvoiceStatusFilter` (segmented pills, sidebar-accent active) on both invoice indexes — 4 cards + 5-6 pills + search = 10+ visible filter options driving one list; Outstanding sums sent+overdue so two cards overlap numerically.
**Why it matters**: Cognitive load checklist fails 5/8 (single focus, hierarchy, one-thing-at-a-time, minimal choices, progressive disclosure). Users must recall which bar owns state.
**Fix**: Keep one filter owner (pills), make cards display-only; retire `badge.tsx` or rebase `StatusBadge` on it.
**Suggested command**: /impeccable layout

### [P2] Input/password/notification sprawl + single-use complexes
**What**: `PasswordVisibilityToggle.jsx` (standalone eye) duplicated inside `password-strength.tsx` (own eye + 356-line meter/checklist; Register imports both). `AutosizeTextarea` (110-line hook, rounded-md) diverges from `Textarea` (rounded-lg, field-sizing-content). `BUTTON_BASE_CLASSES` neutral-round string copy-pasted between `share-button.tsx:63` and `notification-bell.tsx`. `QuantityStepper` (369 lines, hold-repeat/shake/roll, 1 use) + `DateTimePicker` (827 lines, 2 uses) are single-screen complexes.
**Why it matters**: Password authors wire two eyes; textarea radius/padding drift; bell/share drift together because the base is duplicated, not shared.
**Fix**: Single password field (strength includes visibility, delete standalone toggle). Single textarea. Extract shared `icon-button` base. Keep stepper/datetime but document single-use status.
**Suggested command**: /impeccable extract

## Persona Red Flags
**Alex (Power User)**: No shortcuts or bulk actions anywhere; DataTable is the only accelerator. Invoice line-item edits are one-at-a-time stepper taps (hold-repeat exists but undiscoverable). Forced 1200ms hold on invoice delete with no keyboard shortcut path. Will bypass or churn.
**Jordan (First-Timer)**: Faces two filter bars + search on first index screen — 10+ choices before any invoice is understood. Swipe-to-delete affordance invisible; hold-to-delete label ("Hold to delete") reads as system instruction, not intent ("Delete invoice?"). Password screen shows eye toggle + strength eye + 4 rules + meter simultaneously. Abandons at step 2.
**Sam (Keyboard/SR)**: Swipe row is pointer-first (hover/focus fallback exists but undiscoverable); hold button requires sustained press (pointer/keyboard hold, no Esc-to-cancel announced); bell/share odometer rolls announce via live regions but stepper spinbutton + separate announcement risk double-announce; gray-on-rose swipe text (`swipe-to-delete.tsx:231`) fails contrast intent per detector.

## Minor Observations
- `AuthLayout` ships ~110 lines of imperative three.js (CDN r128 + GLTFLoader + OrbitControls) for a decorative logo whose `InvoicifyMark` fallback already renders; defer/idle helps but auth still pays the CDN + model cost on desktop.
- `spinner.tsx` (3 sizes) vs `LoadingButton` inline `Loader2 size-4` vs `DataTable` loading row — three spinner dialects; no shared `EmptyState` (`No results.` vs `No additional information available.`).
- `InvoiceSummaryCards` animated numbers + staggered entrance + hover lift run on every index visit; tasteful but applied to filter controls, so motion competes with decision-making.

## Questions to Consider
- What if there were exactly one Button, one Badge, and one destructive flow — which of the three delete gestures would survive?
- Does the index page need cards *and* pills to filter, or should cards report and pills decide?
- What would a confident, single-shell Invoicify look like if Admin/Client were configs, not forks?
