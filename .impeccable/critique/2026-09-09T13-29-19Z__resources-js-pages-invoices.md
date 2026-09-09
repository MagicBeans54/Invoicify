---
target: invoices pages
total_score: 25
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:C:\\Users\\Andrew\\Desktop\\Invoicify\\resources\\js\\Pages\\Invoices"
timestamp: 2026-09-09T13-29-19Z
slug: resources-js-pages-invoices
---
Method: DEGRADED single-context (Assessment A completed via source read, Assessment B via CLI detect; no sub-agent tool exposed)

## Design Health Score (Operate mode - Invoices)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Live totals + LoadingButton good, but Due/Overdue has no urgency treatment |
| 2 | Match System / Real World | 3 | Peso, Issued/Due, From/To fluent; occasional generic SaaS phrasing |
| 3 | User Control and Freedom | 3 | UndoPill 6s + SwipeToDelete + HoldToConfirm good; no draft autosave |
| 4 | Consistency and Standards | 3 | StatusBadge + tabular-nums consistent; Admin DataTable vs Client plain Table diverges |
| 5 | Error Prevention | 3 | Zod mirrors server, DateTimePicker, disabled invoice_number, Send disabled with title |
| 6 | Recognition Rather Than Recall | 3 | Labeled actions, visible headers; Status Select label not associated |
| 7 | Flexibility and Efficiency | 1 | No bulk actions, no status/date filter, no duplicate/clone, no keyboard accelerators |
| 8 | Aesthetic and Minimalist Design | 2 | Show is 1 long Card with 5 separators; Notes/Terms each own Card for 1 textarea |
| 9 | Error Recovery | 3 | Inline errors near source, preserves work; no refresh recovery |
| 10 | Help and Documentation | 1 | Placeholders only; no contextual help for status, payment_terms, tax |
| **Total** | | **25/40** | **Acceptable** |

## Design Specificity Verdict

**LLM assessment**: Category-interchangeable shadcn admin. Coherent and tidy, but could be any SaaS with a table. Structural sameness: Index = SummaryCards + DataTable, Show = Card + separators + action row, Form = stacked Cards - all standard patterns. Missed product character: no invoice-ness (no document preview feel, no money-at-risk hierarchy, no Techstacks/Invoicify voice), no differentiation between draft/sent/overdue/paid beyond badge color. Peso formatting and contract_number/payment_terms fields are the only authored-for-this-product signals.

**Deterministic scan**: `impeccable detect --json resources/js/Pages/Invoices resources/js/Pages/ClientInvoices resources/js/components/InvoiceForm.jsx resources/js/components/InvoiceSummaryCards.jsx` returned `[]` - 0 findings, exit clean. Detector caught nothing the manual review missed; no false positives to triage. This is a styling/a11y-clean codebase, not a design-correct one - structural UX issues (action overload, endless form, missing filters) are out of detector scope.

**Visual overlays**: No reliable user-visible overlay available. No browser automation tool is exposed in this session, so live-server injection was not attempted. Fallback signal is source + detector only.

## Overall Impression

Solid engineering, timid design. What works is correctness: validation, undo, totals math, badges. What doesn't is hierarchy and pace: the money story is flat, the Show page buries Total, the Form shows everything at once, and the Index treats overdue like any other date. Single biggest opportunity: make Outstanding/Overdue actionable - surface at-risk money and give it a one-click path (filter, sort by urgency, remind).

## What's Working

1. **Undoable line-item deletion** (`InvoiceForm.jsx:140-151,525-534`): SwipeToDelete + UndoPill 6s + `insert(lastRemoved.index)` preserves order. Rare to see undo done right in CRUD; respects high-stakes editing.
2. **Live money math with guardrails** (`InvoiceForm.jsx:111-117,450-470`): subtotal/tax/total recompute on watch, QuantityStepper min 1 max 9999, unit_price min 0, Zod mirrors server. Prevents negative/zero-qty slips.
3. **Status language is consistent** (`status-badge.tsx:13-64`): Paid/Sent/Draft/Overdue/Pending with distinct icon+tone+ring, used in Index table, Show header actions, SummaryCards. Good recognition cue across admin/client.

## Priority Issues

### [P1] Show action bar is 5 equal-weight decisions with destructive next to primary
**What**: `Pages/Invoices/Show.jsx:208-262` - Send, Download PDF, Edit, ShareButton, HoldToDelete all `size=sm` in one `justify-end flex-wrap` row. No primary, no grouping.
**Why it matters**: At the money moment users must scan 5 same-size pills; destructive sits 8px from Edit. Working-memory overload + misclick risk. Client Show (`ClientInvoices/Show.jsx:195-224`) has same flat row minus delete but still 3 equal actions.
**Fix**: Establish hierarchy: primary = Send (or Make Payment on client), secondary = Edit/Download, tertiary menu = Share, danger separated left or overflow. E.g. `Send` default solid, `Edit` outline, `Download` ghost, Share in dropdown, delete with `ml-auto` + separator + extra top margin.
**Suggested command**: /impeccable layout

### [P1] Create/Edit is one endless scroll with no progressive disclosure
**What**: `InvoiceForm.jsx:154-514` - Meta Card (6 fields) + From/To 2-col + Items Card + Notes Card + Terms Card + action row, all expanded. Notes/Terms each consume full Card chrome for a single textarea.
**Why it matters**: Intrinsic load is high (invoice has ~18 fields) but extraneous load makes it worse: user sees everything before deciding anything. Mobile is a 4-screen scroll; Tax (%) input `w-20` cramped (`InvoiceForm.jsx:457-463`). Abandonment risk for Jordan/Casey.
**Fix**: Collapse Notes/Terms into disclosure/accordion with character count, collapse From (prefilled from settings) by default with Edit toggle, sticky summary footer with Subtotal/Tax/Total + Create button so total is visible while editing items. Chunk meta into 2 groups: Identity (number/contract/status) + Schedule (dates/terms).
**Suggested command**: /impeccable distill

### [P1] Index hides urgency - overdue looks identical to healthy
**What**: `Pages/Invoices/Index.jsx:27-38` - Issued and Due both `text-muted-foreground` same style, no days-overdue, no row tint, no status filter. SummaryCards (`InvoiceSummaryCards.jsx:82-111`) show Outstanding/Overdue/Collected/Drafts but are non-interactive display only.
**Why it matters**: Core Operate job is "who owes me, who is late". User must mentally subtract dates and cross-ref badge. No filter/sort by status means overdue hunting is manual search.
**Fix**: Make Due column semantic: amber + TriangleAlert + "3d overdue" when past due, make SummaryCards clickable filters that set DataTable globalFilter/status, add status segmented control above table. Make Outstanding card primary with tabular total.
**Suggested command**: /impeccable clarify

### [P2] Admin DataTable vs Client Table divergence
**What**: Admin Index uses `DataTable.jsx` (search, sort, pagination 10) while `ClientInvoices/Index.jsx:32-78` uses hand-rolled plain Table with no search/sort/pagination.
**Why it matters**: Clients with 20+ invoices get no wayfinding; Alex cannot sort by Total/Due; inconsistency prevents learning. Duplicated Show code (admin/client 90% identical) will drift.
**Fix**: Reuse DataTable on client (hide Client column variant), or extract InvoiceDocument component shared by both Shows. Add `pageSize 10` + searchPlaceholder="Search my invoices...".
**Suggested command**: /impeccable adapt

### [P2] Small a11y / microcopy gaps that erode trust
**What**: a) Trash `Button size=icon` has aria-label but 32px target + no visible label (`InvoiceForm.jsx:423-432`). b) Status `Label` without htmlFor (`InvoiceForm.jsx:222`). c) Empty states dead-end: admin says "Create invoices from Clients page" with no link (`Invoices/Index.jsx:72-78`), client says "You don't have any" with no next step. d) Invoice Number disabled with `bg-muted` but no explainer why.
**Why it matters**: Sam tabs linearly - unlabeled stepper + icon-only delete + spin pending badge (`status-badge.tsx:37`) are red flags. Jordan stalls at empty state with no CTA.
**Fix**: Add visible "Remove" text on hover/focus, associate Status label, add CTA buttons in empty states (View Clients / Contact admin), add inline hint "Auto-generated - editable after creation" with tooltip.
**Suggested command**: /impeccable harden

## Persona Red Flags

**Alex (Power User, admin chasing 40 invoices)**: No bulk send/remind/delete, no status filter, no keyboard shortcut for Add Item/Save, must open each Show to Send. DataTable sort helps but 10-row pagination + no saved views = 60s task becomes 5min. Will abandon for spreadsheet.

**Jordan (First-Timer, creating first invoice)**: Meta grid shows 6 fields at once (Number disabled + Contract optional + 2 dates + Status + Terms) with no order cue. Payment Terms placeholder "e.g., Net 30" assumes knowledge. No contextual help for tax_rate, status meanings, invoice_number auto-gen. Will stall at Create, afraid to submit.

**Sam (Keyboard/Screen-reader)**: QuantityStepper custom component - verify focus ring and aria; icon-only Trash is 32px and color-only? Status conveyed by badge color+icon+label (good) but overdue date has no text alternative for urgency (color-only if fixed naively). Pending spin `animate-spin [3s]` respects motion-reduce (good in SummaryCards via useReducedMotion). Missing focus-visible on DataTable sort buttons beyond hover.

## Minor Observations

- Totals block on Show (`Show.jsx:157-177`) is `max-w-xs` right-aligned small text; Total is `font-semibold text-sm` - should be display size. Currency uses `Pxx.toFixed(2)` in table vs `toLocaleString en-PH` in cards - inconsistent grouping (1,000 vs 1000).
- Dates use `toLocaleDateString()` with no locale - en-US vs en-PH drift; no year for near dates, no relative hint.
- From/To cards duplicate AddressBlock in 3 files; extract to shared component to prevent drift.
- `window.location.origin + route(pdf)` for Share copyValue exposes PDF URL without auth note - verify client PDF route is signed or gated.
- Animated numbers (`InvoiceSummaryCards.jsx:14-36`) animate on every filter change; delightful but delays scanning - keep duration 0.7s max, disable on filter.

## Questions to Consider

- What if Outstanding money was the headline, not the table?
- Does Create need to feel like a tax form, or like a document being built?
- What would a confident Overdue row look like from 3 meters away?
- Could Notes/Terms disappear until needed without anyone missing them?
