---
target_identity: "file:C:\\Users\\Andrew\\Desktop\\Invoicify\\resources\\css\\app.css"
target_fingerprint: "sha256:e4f7d259895125995d419311bd02a7166af3638cc721a7a2dfbfd855314e679f"
target_path: "C:\\Users\\Andrew\\Desktop\\Invoicify\\resources\\css\\app.css"
timestamp: 2026-09-09T12-56-13Z
slug: resources-css-app-css
---
Method: dual-agent (A: design-review · B: detector) — degraded to single-context: no sub-agent tool exposed, ran A then B sequentially

Design Health Score (theme colors, contrast, identity — target: resources/css/app.css)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Active nav relies on 1.86:1 mint text + 6px dot; status visible but active state recedes in light mode |
| 2 | Match System / Real World | 2 | Mint+zinc+blue charts speak generic SaaS, not invoicing/money/trust |
| 3 | User Control and Freedom | 3 | Light/dark toggle works with animation; no high-contrast or density option |
| 4 | Consistency and Standards | 1 | 3+ greens, orphaned accent token, status rainbow and blue charts disconnected from theme |
| 5 | Error Prevention | 3 | Destructive 4.76:1 passes; tinted destructive pattern is sound |
| 6 | Recognition Rather Than Recall | 2 | Low-contrast active/visited states force recall; focus ring diluted with /40 opacity |
| 7 | Flexibility and Efficiency | 2 | One mint accent, no customization path for power users |
| 8 | Aesthetic and Minimalist Design | 2 | Clean but interchangeable; charts 5x sequential blues, heading==body |
| 9 | Error Recovery | 3 | Inline errors use text-destructive with icon-adjacent placement; preserved on submit |
| 10 | Help and Documentation | 1 | No PRODUCT.md/DESIGN.md, no token usage guidance for contributors |
| **Total** | | **21/40** | **Acceptable** |

Design Specificity Verdict

LLM assessment: Category-interchangeable. Primary #24D6AE + neutral zinc + Manrope could be any productivity SaaS. Invoicify wordmark, sidebar active state, Outstanding card, spinner, and TechstackMark all inherit text-primary with no invoicing character — no ledger, stamp, money, or trust cue. Heading font == body font (Instrument Sans loaded then overridden by Manrope Variable in @theme inline). Missed opportunity: own the mint as financial-confidence signal with a paired ink + display cut.

Deterministic scan: Ran impeccable detect --json over resources/js + resources/views. 3 findings: 2x gray-on-color in swipe-to-delete.tsx (text-neutral-500/400 on bg-rose-50 — real washout, fix with rose-700), 1x overused-font Arial in pdf.blade.php (false positive — PDF system fallback, not web slop). Detector MISSED the load-bearing failure: text-primary #24D6AE on white 1.86:1. Do not treat detector-clean as contrast-clean.

Measured contrasts (WCAG): bg-primary #24D6AE on primary-fg #0D1515 9.96:1 PASS (filled buttons/badges good); text-primary on white 1.86:1 FAIL (needs 4.5/3.0); text-primary on dark bg 10.71:1 PASS (dark-only brand); muted-fg on white 4.83:1 PASS borderline; accent on accent-fg 5.07:1 PASS but orphaned; white on auth gradient bottom #00896a 4.39:1 FAIL for 12-15px copy; white/75 + white/90 even lower.

Visual overlays: No browser automation exposed in this session, so no live injection or [Human] overlay. No localhost server started. Fallback signal is CLI + code measurement above.

Overall Impression

Filled mint buttons punch; mint text disappears. Light mode — where most invoicing work happens — has no confident brand ink. Dark mode saves the palette (10.71:1). Identity fractures across 3 greens (#24D6AE brand, #00896a/#0a2018 auth gradient, emerald-500 status) plus blue accent + blue charts. Single biggest opportunity: lock a light-mode ink that keeps mint energy at 4.5:1, then re-anchor status/charts to it.

What's Working

- Filled primary pattern is correct: #24D6AE on #0D1515 at 9.96:1, used consistently in Button default, Badge default, Avatar presence. Keep this pair untouched.
- Dark-mode brand story works: mint on zinc-900 ~10.71:1, sidebar #24D6AE accents legible, muted-fg on dark card 6.74:1. Proof the hue can carry identity when given depth.
- StatusBadge includes icon + text label + role=status, not color-alone. Good Operate foundation — just needs palette alignment.

Priority Issues

- [P0] Mint text on light fails everywhere it matters. What: text-primary, bg-primary/10+text-primary, [&_svg]:text-primary, spinner text-primary all render ~1.6-1.86:1 on white/sidebar #FAFAFA. Sidebar active item, Invoicify wordmark (AppLayout:106, ClientLayout:93, Login:36), Create account link, Outstanding tone, all dropdown icons. Why it matters: nav/CTA/brand literally recede; low-vision users lose location and action. Fix: introduce --color-primary-ink for light mode (e.g. #006B54 / oklch ~0.52 0.11 173) for text/icons/active states; reserve #24D6AE for fills, dots, dark-mode text. Gate: no mint text on light <4.5:1. Suggested command: /impeccable audit
- [P1] Identity fracture: 4 greens + blue accent + rainbow statuses. What: brand #24D6AE vs auth #00896a→#0a2018 vs emerald statuses vs accent oklch 223deg blue vs charts 207-224deg blues. StatusBadge uses emerald/indigo/sky/amber/rose disconnected from tokens. Why it matters: product feels stitched, trust erodes at money moments (Paid/Overdue). Fix: define semantic tokens --color-success/warning/danger anchored to brand hue family; map StatusBadge + InvoiceSummaryCards tones to them; either promote accent to real secondary or delete it. Suggested command: /impeccable colorize
- [P1] Charts are 5 sequential blues, indistinguishable + off-brand. What: chart-1..5 all 207-224deg, same family as accent, ~30deg away from mint 173deg. Why it matters: categorical invoice data unreadable, looks like different product. Fix: categorical palette: mint/ink + teal + amber + slate + rose, test adjacent pairs for 3:1+ on card. Suggested command: /impeccable colorize
- [P1] Type has no voice, dead code ships. What: @theme sets --font-sans Instrument Sans then @theme inline overrides to Manrope Variable; --font-heading == --font-sans. No display cut for numbers/brand. Why it matters: numbers ($ totals) + Invoicify wordmark need confidence; current stack reads generic. Fix: pick one: Manrope for UI + tabular-nums already good, add condensed/display for H1/wordmark or commit to Instrument; remove unused import. Suggested command: /impeccable typeset
- [P2] Auth panel small copy fails on gradient. What: white/75 eyebrow Techstacks + white/90 15px description on #00896a end 4.39:1 → ~2-3:1 with opacity. Why it matters: first impression + value prop washed for low-vision. Fix: deepen bottom stop to #006B54+, strengthen scrim to 0.5, or lock small copy to solid white. Suggested command: /impeccable polish

Persona Red Flags

Alex (Power User): Scans sidebar 20x/day — active mint 1.86:1 forces hunt; 6px dot too small at glance. No density/high-contrast path. Status rainbow (6 hues + mint + blue) forces color decode instead of instant Paid vs Overdue. Wants keyboard + bulk invoice actions; theme gives no focus-strong ring (ring/40).
Sam (Accessibility): Keyboard-only + 200% zoom: 1.86:1 fails AA/AAA for body, links, icons. Focus-visible ring uses ring/40 opacity — diluted below 3:1 UI contrast. Sidebar active dot is color-only cue. Auth white/75 on teal fails. Paid vs Draft relies on hue + tiny icon at 14px. Needs 4.5:1 text, 3:1 UI, visible focus, non-color status weight.
Jordan (First-Timer): Mobile login: mint Invoicify 1.86:1 recedes, tagline muted 4.83:1 small. Forgot password? is muted span, not link — reads disabled, no path. Create account mint link low-salience. Auth dark-green premium → app light-gray generic tonal whiplash; trust dips before first invoice.

Minor Observations

- Muted 4.83:1 barely passes — don't place 12px muted on primary/10 chips.
- Destructive 4.76:1 + /10 tint pattern is correct; keep.
- TechstackMark aria-label says Techstacks while adjacent wordmark says Invoicify — align to Invoicify.
- SpecularButton defaults (#525252 base, white line) disconnected from theme; gate its use or tokenize.
- PDF blade Arial is correct for print — keep, ignore detector there.
- Swipe-to-delete neutral on rose-50 is real — shift to rose-700/rose-900.
- Border/input identical oklch 0.92 — inputs vanish on card white; add 1-step depth.

Questions to Consider

- What if Outstanding/Paid owned a deep mint ink instead of borrowing emerald?
- Does auth need its own green, or should the app earn the same premium teal?
- What would a confident invoice total look like — tabular Manrope or a display face that says money?
