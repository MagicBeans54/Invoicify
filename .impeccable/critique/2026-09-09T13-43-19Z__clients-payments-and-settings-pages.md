---
target: clients, payments and settings pages
total_score: 21
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:C:\\Users\\Andrew\\Desktop\\Invoicify\\clients, payments and settings pages"
timestamp: 2026-09-09T13-43-19Z
slug: clients-payments-and-settings-pages
---
Method: dual-agent (A: source-read · B: cli-detect) — see header note

## Design Health Score (Operate mode — Clients, Payments, Settings)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | DataTable counts + LoadingButton + StatusBadge role=status good; no save confirmation context, no review progress |
| 2 | Match System / Real World | 3 | Peso, Invoice/Ref/Method language fluent; generic empty-state phrasing |
| 3 | User Control and Freedom | 2 | Cancel on create/reject good; no reset/discard on Settings, no clear-filter, client cannot edit |
| 4 | Consistency and Standards | 2 | shadcn system coherent but Admin DataTable vs Client plain Table diverges; SpecularButton breaks system |
| 5 | Error Prevention | 2 | Selects/accepts/min/required help; one-click Approve irreversible, no overpayment guard |
| 6 | Recognition Rather Than Recall | 2 | Breadcrumbs + labels good; invoice-total vs payment-amount memory bridge, bank-type free text |
| 7 | Flexibility and Efficiency | 1 | No bulk, no filters, no shortcuts, no saved views; client tables no sort/search |
| 8 | Aesthetic and Minimalist Design | 2 | Mostly clean cards; contact card chrome for 3 lines, 11-row label wall, Specular noise |
| 9 | Error Recovery | 2 | Inline errors near source, preserves work; no draft/autosave, refresh loses create/settings |
| 10 | Help and Documentation | 2 | Settings CardDescriptions + receipt format hint are best in app; no method/tax/bank-type help, dead-end empties |
| **Total** | | **21/40** | **Acceptable** |

## Design Specificity Verdict

**LLM assessment**: Coherent shadcn Operate UI, but category-interchangeable. Structural sameness: Index = DataTable/plain Table + dashed empty, Show = 2 Cards with flex justify-between rows + action Card, Settings = 3 stacked Cards. Could be any SaaS admin with tables. Missed product character: no client-ness (no lifetime value, no outstanding per client, no contact depth), no money-at-risk story on payments (no remaining balance, no due vs paid link, no urgency), no Techstacks voice. Only Peso formatting, invoice_number–total pairing, and From/BankDescriptions signal this product.

**Deterministic scan**: `impeccable detect --json resources/js/Pages/Clients resources/js/Pages/AdminPayments resources/js/Pages/ClientPayments resources/js/Pages/Settings` returned `[]` — 0 findings, exit clean. Detector caught nothing the manual review missed; no false positives. This is a styling-clean codebase, not a design-correct one — hierarchy, memory-bridge, buried-save, and Specular divergence are out of detector scope.

**Visual overlays**: No reliable user-visible overlay available. No browser automation tool is exposed in this session, so live-server injection was not attempted. Fallback signal is source + detector only.

## Overall Impression

Solid engineering, timid Operate design. What works is correctness: tables sort/filter, forms validate inline, badges read consistently. What does not is pace and trust at money moments: Settings buries Save inside Bank Details, Approve is one glowing click with no total-vs-balance check, Client must recall invoice total while typing amount, and Specular Approve/Reject shouts against an otherwise quiet system. Single biggest opportunity: make payment review feel safe — balance math visible, primary/secondary/danger hierarchy, plain system buttons.

## What's Working

1. **Settings explains itself** (`Settings/Index.jsx:55-59,119-122,186-188`): "These details appear in the From section", "Applied to new invoices automatically", "Bank information shown on invoices". Best contextual help in the app; tells the user where data lands.
2. **DataTable wayfinding on admin** (`DataTable.jsx:50-64,154-178` + `Clients/Index.jsx:58-62`, `AdminPayments/Index.jsx:88-92`): search with icon + `pl-8`, live "N rows", sort affordance, 10-row pagination. Admin with 50 clients/payments can find things.
3. **Reject requires a reason with escape** (`AdminPayments/Show.jsx:229-284`): progressive disclosure for reject, `required` textarea, Cancel resets state + clears notes. Appropriately harder than approve — correct friction direction, just styled wrong.

## Priority Issues

### [P1] Specular Approve/Reject breaks the system at the highest-stakes moment
**What**: `AdminPayments/Show.jsx:173-228` — two `SpecularButton size=lg w-full` with custom tint/line/base/shine/followMouse/proximity props for Approve (green-on-cyan glow) and Reject (red glow), while every other action in Clients/Payments/Settings uses `Button` / `LoadingButton`.
**Why it matters**: At the money-trust moment the UI changes visual language entirely — glow, motion, full-bleed size imply marketing, not fiduciary care. Sam gets animated shine with no reduced-motion guard visible here; Casey gets two thumb-massive targets with no hierarchy (approve and reject scream equally). One-click Approve with no confirm (`handleApprove:24-29` posts immediately) + glowing treatment = misclick risk on irreversible money.
**Fix**: Replace both with system buttons: Approve = `LoadingButton` solid primary, Reject = `Button variant=outline` danger-ghost that expands the reason form. Put danger with `ml-auto`/separator, add `confirm` copy "Approving marks ₱X against INV-Y. This updates balances." Show remaining balance in the confirm.
**Suggested command**: /impeccable quieter

### [P1] Settings Save is buried inside Bank Details
**What**: `Settings/Index.jsx:242-246` — sole `Save Settings LoadingButton size=sm` sits `justify-end` inside the third Card's `CardContent grid`, after 14 inputs in `max-w-3xl`. Edit Company Name at top → scroll past Invoice Defaults + 5 bank fields to save.
**Why it matters**: Longest form in the app has no sticky action, no section nav, no dirty-state hint. Users edit one field, never see Save, assume autosave, leave and lose work. Mobile is 4+ screens with Save off-viewport.
**Fix**: Lift Save to `AppLayout actions` (sticky header-adjacent) + sticky footer bar on mobile with dirty indicator (`isDirty` from useForm). Add section jump (Company / Defaults / Bank) or accordion Bank collapsed by default. Keep a single Save, not one per card.
**Suggested command**: /impeccable layout

### [P1] Payment amount has no balance context — over/underpayment slips through
**What**: `ClientPayments/Create.jsx:73-87` amount is free `type=number min=0.01` defaulting to `invoice.total`, with invoice `Select:53-67` showing only `number – ₱total` (no due/status/balance). Admin review (`AdminPayments/Show.jsx:68-79`) lists Invoice Total and Payment Amount as two adjacent `flex justify-between` rows with no computed remaining/overage, no link to invoice.
**Why it matters**: Core job is "pay the right amount against the right balance". User must hold total in working memory while typing, with no guard for partial/overpayment, no "Amount due: ₱X" hint, no warning when amount ≠ balance. Admin must mentally subtract to validate — high-stakes arithmetic done in heads.
**Fix**: In Create, when invoice selected show balance card (Total / Already paid / Due) + quick chips [Full balance] [50%] + inline warning when amount > due ("₱500 over — will be recorded as overpayment") or < due ("Partial — ₱X remains"). In Admin Show, add computed row: Remaining after this payment + link View Invoice. Add server + client max validation against due.
**Suggested command**: /impeccable harden

### [P2] Clients dead-end — count badge is not clickable, empty has no next step
**What**: `Clients/Index.jsx:50-56` empty says "Clients will appear here when they register" with no Invite/Share action; row badge (`27-29` "{n} invoices") is static `Badge outline`, not a link; `Clients/Show.jsx:79-82` "No invoices yet" has no New Invoice CTA (header has one, but empty body does not repeat it); no client edit affordance anywhere.
**Why it matters**: Jordan (first admin) stalls at empty with no path forward. Everyday job "see this client's invoices" costs scroll-to-header + find small ghost View instead of clicking the count they already see. No edit means stale contact data persists.
**Fix**: Make count badge `asChild` link to filtered invoices or anchor to Invoices card; add empty-state CTAs (Copy invite link / View Invoices / New Invoice); add Edit Client (or state "Managed by registration — contact to update" if intentional).
**Suggested command**: /impeccable onboard

### [P2] Admin DataTable vs Client plain Table divergence
**What**: Admin Clients/Payments use `DataTable.jsx` (search, sort, pagination) while `ClientPayments/Index.jsx:39-85` hand-rolls `Table` with no search/sort/pagination, plus `mb-4 flex justify-end` New Payment above it. Same data, two learnings.
**Why it matters**: Clients with 20+ payments get no wayfinding; Alex cannot sort by Amount/Date; inconsistency prevents transfer (admin learns search, client finds none). Duplicated Show layouts (admin/client 90% identical `grid md:grid-cols-2` detail walls) will drift.
**Fix**: Reuse DataTable on client (hide admin-only columns via prop), `searchPlaceholder="Search my payments…"`, `pageSize 8`. Extract shared `PaymentDetailCards` used by both Shows with `variant=admin|client` for notes/actions.
**Suggested command**: /impeccable adapt

## Persona Red Flags

**Alex (Power admin, 40 clients / 60 payments to clear)**: No status filter (pending/approved/rejected), no bulk approve, no sort-by-amount shortcut on client side, must open each `admin.payments.show` to act. DataTable sort helps on admin but 10-row pages + no saved "Pending only" view turns 60s triage into 5min open-back-open. No keyboard path (no Enter-to-approve, no j/k). Will revert to spreadsheet.

**Jordan (First-timer, setting up company + submitting first payment)**: Settings shows 14 inputs across 3 cards at once — Company, Tax, Bank Account Type with no format hints (what is "Account Type"? Savings/Checking? Free text `Settings/Index.jsx:220-230`). Payment Method select (`Create.jsx:111-117` bank_transfer/check/cash/credit_card/other) has no explainer of what happens next (manual verification? how long?). Invoice select shows number-total but not due date/status — afraid to pick wrong invoice. Will stall, afraid to Submit.

**Sam (Keyboard / Screen-reader, tab-linear)**: DataTable sort buttons are `<button>` without `aria-sort`/`aria-label` state (`DataTable.jsx:81-103` icon-only ArrowUpDown conveys sort visually only). Ghost "View/Review" `-mr-2 size=sm` targets are small and edge-bleed. Specular buttons add shine animation with no `motion-reduce` guard in this file (unlike status-badge spin which has it). Settings `Field` associates `Label htmlFor` correctly (good) but error `<p>` has no `aria-describedby`/`role=alert`, so SR may miss it. Status color+icon+label is good; amount-vs-balance math has no text alternative.

## Minor Observations

- Contact card wastes full Card chrome for 2-3 lines (`Clients/Show.jsx:43-68`); label-colon-value wall (`Email: x`, `Phone: y`) reads like debug — use definition list with muted labels above values, add copy-email button.
- Admin Show detail wall is 11 `flex justify-between` rows with no grouping — chunk into Parties (client/email), Money (invoice total/amount/remaining), Meta (date/method/ref/status/reviewed). Right column "Additional Information" is often "No additional information available" — collapse when empty.
- Currency uses `'₱'+parseFloat().toFixed(2)` in 4 files vs cards elsewhere use locale grouping — `₱10000.00` vs `₱10,000.00` drift; centralize `formatPHP`.
- Dates use bare `toLocaleDateString()` (locale drift) with no relative hint; review queue needs "Submitted 3d ago" + due urgency.
- Receipt link hardcodes `/storage/${receipt_file}` (`AdminPayments/Show.jsx:131`, `ClientPayments/Show.jsx:93`) — verify signed/gated; same pattern flagged on invoice PDF share.
- `ClientPayments/Create.jsx:30-37` appends every key including empty strings to FormData — sends `receipt_file: "null"`-ish noise; only append file when File instance.
- New Payment button `mb-4 flex justify-end` sits above table with no summary (no Outstanding/ Pending count) — client lands with no money headline, unlike admin bell count.

## Questions to Consider

- What if Remaining Balance was the headline on every payment surface, not Amount alone?
- Does Settings need to feel like one 14-field tax form, or three savable sections with visible dirty state?
- What would a calm, fiduciary Approve look like from 3 meters away — still glowing?
- Could Clients Index earn its keep with Outstanding-per-client instead of just invoice count?
