---
target_identity: "file:C:\\Users\\Andrew\\Desktop\\Invoicify\\resources\\js\\Pages\\Auth\\Login.jsx"
target_fingerprint: "sha256:45df7978579ef00603fadd1b99859ebb6d4cf683e9969cc88f66edc2bfc85421"
target_path: "C:\\Users\\Andrew\\Desktop\\Invoicify\\resources\\js\\Pages\\Auth\\Login.jsx"
timestamp: 2026-09-09T12-45-49Z
slug: resources-js-pages-auth-login-jsx
---
Method: ⚠️ DEGRADED: single-context (no sub-agent tool exposed)

## Design Health Score — Login + Register (Operate mode)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | LoadingButton helps, but no form-level status region; login errors have no role=alert/aria-live |
| 2 | Match System / Real World | 3 | Plain language mostly; "Registration" noun vs "Register" verb, missing Forgot password breaks mental model |
| 3 | User Control and Freedom | 2 | No back/cancel, no forgot-password exit; password toggle removed from tab order on Login |
| 4 | Consistency and Standards | 2 | Two different show/hide implementations; "Login" vs "Registration" titles; Techstacks vs Invoicify branding |
| 5 | Error Prevention | 2 | Strength meter helps on Register, but missing autocomplete/input types, no required markers, confirm-match not checked client-side |
| 6 | Recognition Rather Than Recall | 3 | Labels visible; no contextual help for optional fields, no hints for password managers |
| 7 | Flexibility and Efficiency | 2 | No password-manager/autofill support (missing autocomplete), no SSO/remember-me, no keyboard parity on toggles |
| 8 | Aesthetic and Minimalist Design | 2 | Login is clean; Register gives 6 field groups + meter + checklist equal weight, no grouping |
| 9 | Error Recovery | 2 | Inline field errors good, but confirm-password error is never rendered; errors not linked via aria-describedby |
| 10 | Help and Documentation | 1 | No forgot password, no help link, no terms/privacy on Register |
| **Total** | | **21/40** | **Acceptable** |

## Design Specificity Verdict

**LLM assessment:** Generic-auth with one expensive brand gesture. The right-side card (shadcn Card + Input + LoadingButton, centered max-w-md) could belong to any SaaS product unchanged — swap "Invoicify" text and nothing else signals invoicing. The only authored moment is the left panel (dark-green gradient, "Professional invoicing — create, send, and track invoices," rotating 3D Techstacks logo), and it is `hidden lg:block`, so the entire mobile experience is a small logo + generic card with zero product character. Missed opportunity: invoicing-specific reassurance (live totals, PDF delivery, client trust) at the highest-anxiety moment (account creation).

**Deterministic scan:** `impeccable detect --json` over `Auth/Login.jsx`, `Auth/Register.jsx`, `components/AuthLayout.jsx` returned `[]` — clean, exit 0. No counts to report. The detector missed everything below (expected: it does regex/static analysis on JSX, not copy, flow, or a11y semantics). No false positives to flag; treat the clean scan as absence of mechanical anti-patterns, not as design approval.

**Visual overlays:** No browser visualization was performed — no browser automation is exposed in this session, so no `[Human]` tab, no `detect.js` injection, no console findings. No overlay is claimed.

## Overall Impression

Solid shadcn foundation with good motion hygiene (reduced-motion respected on entrances) and a genuinely good password-strength component — undermined by Register overload, missing auth affordances (autocomplete, forgot-password, confirm error), and a heavyweight 3D brand panel that mobile users never see. Biggest opportunity: make Register a two-group, progressively-disclosed form and make Login password-manager-friendly; that alone lifts three heuristics.

## What's Working

1. **Consistent card system.** Both pages share `Card + CardHeader (centered) + CardContent + LoadingButton w-full`, same `space-y-4 / space-y-2` rhythm, same placeholders. Predictable and easy to scan on Login.
2. **PasswordStrengthInput on Register.** Meter + animated checklist + `role="status" aria-live="polite"` + sr-only strength text + per-rule sr-only "satisfied" is the best-crafted piece on either page. Keep this pattern and extend its toggle discipline to Login.
3. **Motion + loading hygiene.** `useReducedMotion` gates entrance animations, `LoadingButton loading={processing}` prevents double-submit, server errors render adjacent to fields without wiping input (Inertia preserves state).

## Priority Issues

- **[P1] Register is one undifferentiated wall of 6 fields.** What: Name, Email, Password (+meter+checklist), Confirm, Phone (optional), Address (optional) all share identical weight with no fieldset grouping and no progressive disclosure. Why it matters: account creation is the highest-abandonment moment; optional fields compete with required ones and mobile becomes a long scroll. Fix: group into "Account" (name/email) and "Security" (password/confirm), collapse Phone/Address under an "Optional — add later" disclosure, mark required explicitly. Suggested command: `/impeccable layout`
- **[P1] Core auth affordances are missing or unwired.** What: (a) Login email/password lack `autoComplete="email" / "current-password"`, Register lacks `name/email/tel` autocomplete and uses `type="text"` for phone; (b) no "Forgot password?" link on Login; (c) `errors.password_confirmation` is validated server-side (`confirmed` rule) but never rendered — mismatch failures appear only as a password error. Why it matters: breaks password managers and mobile keyboards, strands locked-out users, makes the most common Register error undiagnosable. Fix: add correct autocomplete + `type="tel"` + `autoComplete="tel"`, add forgot-password link (even if placeholder route), render confirm error under the confirm field with `aria-describedby`. Suggested command: `/impeccable harden`
- **[P1] Show/hide password is inconsistent and under-accessible.** What: Login and Register-confirm use a bare `<button>` with a 16px icon, no size, no focus-visible ring, no `aria-pressed`, and Login sets `tabIndex={-1}` (keyboard users can't reach it); PasswordStrengthInput uses a 32px button with hover/active states, focus ring, and `aria-pressed`. Why it matters: Sam (keyboard/SR) gets two different behaviors for the same action; small targets hurt Casey (touch). Fix: extract one `PasswordVisibilityToggle` (min 32–44px target, focus ring, `aria-pressed`, keyboard-focusable) and reuse all three places. Suggested command: `/impeccable audit`
- **[P2] Copy and naming drift.** What: CardTitle "Login" vs "Registration", descriptions "Welcome back to Invoicify" vs "Create your account", links "Register"/"Login", brand "Techstacks" eyebrow vs "Invoicify" title vs `TechstackMark`. Why it matters: small drift reads as unpolished at the trust moment. Fix: pick verb forms ("Log in" / "Create your account"), make descriptions value-led on both, reconcile Techstacks-vs-Invoicify hierarchy. Suggested command: `/impeccable clarify`
- **[P2] Brand panel costs more than it gives.** What: `AuthLayout` loads three.js r128 + GLTFLoader + OrbitControls from two CDNs plus `/3d/techstacks-logo.gltf`, runs a perpetual `requestAnimationFrame` rotation (not gated on reduced-motion), and is `hidden` below `lg`. Why it matters: heavyweight decorative asset with CDN/SPOF risk and battery cost, invisible to all mobile users, interactive cursor (`cursor-grab`) on decoration. Fix: replace with static SVG/mark + CSS gradient (keep 3D only if brand insists, then lazy-load, gate rotation on reduced-motion, and give mobile a compact brand header with the value line). Suggested command: `/impeccable optimize`

## Persona Red Flags

**Jordan (First-Timer):** No "Forgot password?" recovery path — hesitates, then abandons at Login on any typo. Register shows Phone/Address as "Optional" in the label only, with no explanation of why invoicing needs them — Jordan stalls wondering if skipping breaks invoices. No help link or reassurance anywhere on either card.
**Sam (Accessibility-Dependent):** Login password toggle unreachable via keyboard (`tabIndex={-1}`); neither Login input links errors via `aria-describedby`/`aria-invalid`, and errors lack `role="alert"`. Toggle buttons on Login/Confirm expose no `aria-pressed` and have sub-32px targets with no focus ring. Strength checklist's 13px color-coded items are the only pre-submit guidance and rely partly on color.
**Casey (Distracted Mobile):** Register is ~6 fields + meter + checklist in one scroll with no `type="tel"`, no autocomplete, single-line address input — maximum typing, no smart keyboard. Brand panel (the only value proposition) is hidden on mobile; the `three.js` payload still risks slow-3G load for zero benefit. Footer account-switch links are small, low-contrast, centered tap targets.

## Minor Observations

- `post(route('register.store'), {...data, role:'client'})` passes data as Inertia options — dead code; server hardcodes `role='client'` (AuthController.php:28), so harmless but misleading. Drop the second arg.
- Login/Register duplicate the mobile brand header + motion wrappers verbatim — extract an `AuthCard` shell when touching layout.
- Footer switch link lives in a second `CardContent pt-0` with no divider; consider `CardFooter` with a top border for hierarchy.
- `Input` is `h-8` (32px) while the strength component's native input is `h-10` — heights differ between password and confirm on Register.
- No `required`/`aria-required` or "all fields required unless marked optional" note; requiredness is inferred.
- No terms/privacy consent line on Register (legal/product gap for invoicing PII).

## Questions to Consider

- What if Register asked only for name/email/password first, and deferred phone/address to first-invoice setup where they're actually needed?
- What would a password-manager-first Login look like (autocomplete, current-password, passkey-ready)?
- Does the 3D logo earn its kilobytes, or would a static mark + one invoicing-specific proof line convert better — especially on mobile?
