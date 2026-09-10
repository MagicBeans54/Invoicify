---
target_identity: "file:C:\\Users\\Andrew\\Desktop\\Invoicify\\resources\\css\\app.css"
target_fingerprint: "sha256:e4f7d259895125995d419311bd02a7166af3638cc721a7a2dfbfd855314e679f"
target_path: "C:\\Users\\Andrew\\Desktop\\Invoicify\\resources\\css\\app.css"
timestamp: 2026-09-10T04-07-48Z
slug: resources-css-app-css
---
Method: dual-agent (A: single-context-fallback · B: single-context-fallback)
⚠️ DEGRADED: single-context (no sub-agent tool exposed)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | No status tokens (paid/sent/overdue/draft) in theme; statuses improvised downstream |
| 2 | Match System / Real World | 3 | Ledger metaphor (mint-ledger, paper, ink, hairline) fits invoicing; mostly natural |
| 3 | User Control and Freedom | 2 | No `prefers-reduced-motion` escape; smooth-scroll + theme-anim forced |
| 4 | Consistency and Standards | 2 | Duplicate `--font-sans` (Instrument Sans vs Manrope); ring gray not mint spec |
| 5 | Error Prevention | 2 | Destructive hue exists but error ring / constraints not codified as tokens |
| 6 | Recognition Rather Than Recall | 2 | Raw oklch values, no semantic `--color-success/warning` aliases; devs must recall |
| 7 | Flexibility and Efficiency | 3 | Tailwind v4 `@theme` + dark variant + radius calc scaling is flexible |
| 8 | Aesthetic and Minimalist Design | 3 | Flat-by-default intent holds; gray ring + teal-only charts add noise |
| 9 | Error Recovery | 2 | Dark destructive shift (0.577→0.704) with no pairing guidance |
| 10 | Help and Documentation | 1 | Zero comments in CSS for One Voice / Tabular Numerals / Flat-By-Default rules |
| **Total** | | **22/40** | **Acceptable** |

## Design Specificity Verdict

**Start here.** Authored for Invoicify, but incompletely wired.

**LLM assessment**: Coherence is good at the value level — `resources/css/app.css:61-93` faithfully encodes DESIGN.md oklch values for paper, ink, muted-mist, muted-ink, hairline, mint `#24D6AE` / `#0D1515`, and radius `0.625rem` scales correctly to 6/8/10/14px. Structural sameness risk is low: the ledger-atelier flat + hairline + 32px-density intent survives. But the theme stops short of product character: `@theme inline` maps only generic shadcn tokens (`--color-primary`, `--color-accent`, `--color-ring`, etc.) and never exposes `--color-mint-ledger`, `--color-ledger-ink`, `--color-deep-current` as utilities, so the One Voice Rule (≤10% mint) is unenforceable in markup. Phantom `Instrument Sans` in `@theme:14` vs `Manrope Variable` in `@theme inline:20` plus `@import "@fontsource-variable/manrope":4` leaves a dead font in the cascade. Focus ring `--ring: oklch(0.705 0.015 286.067)` is neutral gray, contradicting DESIGN.md focus 1px mint at 40%. Tabular-numerals, hover-lift shadow, 0.7s totals easing, and status washes (mint/amber/emerald/muted) live only in docs, not in CSS. Dark mode (`.dark:96-128`) is fully specified yet unowned by DESIGN.md — charts 1-5 identical in light/dark, borders drop to 10% white.

**Deterministic scan**: `detect --json resources/css/app.css` → `[]`, exit 0 (clean, expected — CSS-only target has no markup antipatterns). Reused consumer scan `detect --json resources/js` → 14 findings: 12× `design-system-font-size` advisory (e.g. `AuthLayout.jsx:150-151` 32px/15px, `SpecularButton.jsx:8-9` 1rem/1.15rem, `button.tsx:27` 0.8rem, `kbd-key.tsx:96,349` 10px, `password-strength.tsx:298` 13px, `status-badge.tsx:93` 13px, `undo-pill.tsx:275` 9px) + 2× `gray-on-color` warning (`swipe-to-delete.tsx:231` `text-neutral-500/400 on bg-rose-50`). Agreement: detector confirms theme drift — type ramp unenforced and ad-hoc status colors (rose/gray) substituting for missing theme status tokens. No false positives judged; font-size advisories are real ramp violations, gray-on-rose is real washed-out contrast.

**Visual overlays**: No browser automation exposed in this session, so no live tab, no `detect.js` injection, no `[Human]` overlay. Fallback signal is CLI JSON above + static code reading. No user-visible overlay exists for this run.

## Overall Impression

Calm, flat, ledger-like foundation with correct light values and radius math — but the theme does not yet enforce its own design system. Biggest opportunity: make `app.css` the source of truth for One Voice, tabular money, and reduced-motion instead of leaving them as prose in DESIGN.md.

## What's Working

1. **Radius math is exact.** `--radius: 0.625rem` with `*0.6/*0.8/*1.4` yields 6/8/10/14px, matching DESIGN.md `rounded sm/md/lg/xl` precisely. Buttons `rounded-lg` → 10px, cards `rounded-xl` → ~14px without drift.
2. **Shadcn wiring is complete.** `@theme inline:21-51` maps sidebar, chart 1-5, ring, input, border, destructive, accent, muted, secondary, primary, popover, card, foreground/background — so existing components resolve without fallback gaps.
3. **Light values are faithful.** `:root:61-93` copies DESIGN.md oklch for paper `1 0 0`, ink `0.141 0.005 285.823`, muted-mist, muted-ink, hairline `0.92 0.004 286.32`, primary `#24D6AE` / `#0D1515`. Tonal layering will read correctly.

## Priority Issues

- **[P1] What**: Phantom font + duplicate `--font-sans` definition
  **Why it matters**: `@theme:14` declares `Instrument Sans` (never imported) then `@theme inline:20` overrides to `Manrope Variable`. Ambiguity risks FOUT/fallback to wrong grotesque, breaks Display/Body/Label hierarchy (all Manrope per DESIGN.md).
  **Fix**: Delete the `Instrument Sans` line; keep single `--font-sans: 'Manrope Variable', ui-sans-serif, system-ui, sans-serif`. Move `@import "@fontsource-variable/manrope"` above tailwind imports.
  **Suggested command**: `/impeccable typeset`

- **[P1] What**: Product colors + focus ring not exposed as theme tokens
  **Why it matters**: No `--color-mint-ledger`, `--color-ledger-ink`, `--color-deep-current`, `--color-signal-red`, `--color-hairline` utilities means devs hardcode hex/oklch, violating One Voice (≤10% mint). `--ring` gray contradicts 1px mint 40% focus spec; `* { @apply outline-ring/50 }` (`app.css:131-133`) bakes gray focus everywhere, hurting keyboard visibility.
  **Fix**: In `@theme` add `--color-mint-ledger: #24D6AE; --color-ledger-ink: #0D1515;` etc.; set `--ring: color-mix(in oklch, #24D6AE 40%, transparent)` or mint-derived; scope outline to `:focus-visible`.
  **Suggested command**: `/impeccable colorize`

- **[P1] What**: Tabular numerals unenforced + motion without reduced-motion guard
  **Why it matters**: Money without `tabular-nums` jitters during 0.7s animated totals, undermining Accuracy-first trust. `html { scroll-behavior: smooth }` (`app.css:137-140`), `a { transition }`, and `body.theme-anim` transitions have no `@media (prefers-reduced-motion: reduce)` guard, violating DESIGN.md Do (honor reduced-motion: fade only).
  **Fix**: Add `@layer base { body { font-feature-settings: "tnum" 1; } @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto } body.theme-anim *, a { transition: none !important } } }`.
  **Suggested command**: `/impeccable audit`

- **[P2] What**: Teal-only chart ramp + unowned dark mode + missing status tokens
  **Why it matters**: `--chart-1..5` are 5 steps of same teal hue (207°→224°), indistinguishable for invoice states; no amber/emerald/rose semantic tokens forces ad-hoc `bg-rose-50 + text-neutral-500` (detector warning). Dark `--chart-*` identical to light, `--border: 10% white` weakens hairline separation; status washes undocumented for dark.
  **Fix**: Keep teal ramp for charts, add `--color-status-paid/sent/overdue/draft` washes per Chips spec; differentiate dark charts or document light-only; verify accent-foreground contrast.
  **Suggested command**: `/impeccable harden`

## Persona Red Flags

**Alex (Power User — ops/admin sending 20 invoices before lunch)**: Scans tables for totals; needs tabular alignment + instant focus feedback. Red flags: totals jitter (no `tnum` token); gray `outline-ring/50` on `*` dulls focus location during tab-through invoice form; `theme-anim` 0.3s background transitions slow bulk review with no skip; no semantic status utilities means Alex learns 4 different ad-hoc badge styles instead of one pattern.

**Sam (Accessibility-Dependent — keyboard + zoom to 200%, VoiceOver)**: Tabs invoice CRUD linearly, relies on focus ring + contrast. Red flags: `--ring oklch(0.705…)` on white ≈ 3:1 (below 4.5:1 for UI affordance, and gray-on-mint focus invisible); `scroll-behavior: smooth` + transitions with no `prefers-reduced-motion` fallback causes vestibular load; status conveyed by mint dot/color wash only (no shape/text token in theme); `text-neutral-400/500 on bg-rose-50` in swipe-to-delete fails contrast for error confirmation.

## Minor Observations

- `@import` order puts `tw-animate-css` + `shadcn/tailwind.css` before font import — move font first to reduce FOUT.
- Hover-lift `0 4px 12px rgba(0,0,0,0.08)` and 0.7s totals easing live only in DESIGN.md; codify as `--shadow-lift` / `--animate-total`.
- `cursor: pointer` allowlist (`app.css:159-170`) correctly uses `:not(:disabled)` — preserve.
- `--accent: oklch(0.52 0.105 223.128)` vs `--accent-foreground: oklch(0.984…)` — spot-check contrast before using accent as button fill; reserve mint for primary per One Voice.
- `@source` coverage (vendor pagination, storage views, blade, js) is good; no action.

## Questions to Consider

- What if mint existed as a real Tailwind color (`bg-mint-ledger`) so rarity could be linted instead of remembered?
- Does dark mode need to exist for an ops ledger, or would a documented light-only stance remove half the token debt?
- What would fully confident money look like — tabular, pinned decimal, animated once — if the theme guaranteed it?
