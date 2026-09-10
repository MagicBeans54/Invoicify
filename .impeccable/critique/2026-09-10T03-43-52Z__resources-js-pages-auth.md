---
target_identity: "file:C:\\Users\\Andrew\\Desktop\\Invoicify\\resources\\js\\Pages\\Auth"
timestamp: 2026-09-10T03-43-52Z
slug: resources-js-pages-auth
---
Method: ⚠️ DEGRADED: single-context (no sub-agent tool exposed)

## Design Health Score — Login (`resources/js/Pages/Auth/Login.jsx`) + Register (`resources/js/Pages/Auth/Register.jsx`) + `AuthLayout.jsx`

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | `LoadingButton` spinner + `processing` disable is good; errors render inline but lack `aria-invalid` / `role=alert` wiring |
| 2 | Match System / Real World | 2 | `Techstacks` vs `Invoicify` double-brand; `Registration` noun vs `Register`; Phone/Address optional with no reason given |
| 3 | User Control and Freedom | 2 | Show/hide toggles exist but `tabIndex={-1}` removes them from keyboard flow; only exit is the footer link |
| 4 | Consistency and Standards | 2 | `h-8` standard `Input` vs `h-10` `PasswordStrengthInput`; two different toggle styles; `#10B981` vs Mint Ledger `#24D6AE` |
| 5 | Error Prevention | 2 | Strength checklist helps, but only 3 rules with `(required)` on one line; `password_confirmation` mismatch shows no error; login has no `autocomplete` / `required` / `inputmode` guards |
| 6 | Recognition Rather Than Recall | 2 | No Forgot Password, no Remember me, hardcoded `role: 'client'` invisible to user |
| 7 | Flexibility and Efficiency | 2 | Enter-to-submit works, but no `autocomplete="email/current-password/new-password"`, no paste/autofill optimization |
| 8 | Aesthetic and Minimalist Design | 2 | Card is clean; left `PixelBlast` + Three.js 3D logo violates Flat-By-Default and One Voice Rule; Register is 6-field wall |
| 9 | Error Recovery | 2 | `errors.email/password` shown near field but plain `text-destructive` with no suggestion; confirm mismatch is silent |
| 10 | Help and Documentation | 1 | No contextual help, no password-reset path, no admin-vs-client explanation |
| **Total** | | **20/40** | **Acceptable — significant improvements needed before users are happy** |

## Design Specificity Verdict

**Start here.** This feels category-interchangeable, not authored for Invoicify.

**LLM assessment:** The right side is a generic shadcn `Card` — `CardTitle text-2xl` + `CardDescription` + `space-y-4` stack — that any SaaS could ship unchanged. The left side is the opposite problem: an immersive dark `#09100d` panel with emerald `PixelBlast` (`pixelSize={3}`, `patternDensity={0.5}`) and a CDN-loaded Three.js rotating `techstacks-logo.gltf` with `OrbitControls`. DESIGN.md `Ledger Atelier` demands flat paper, hairline borders, tabular numerals, Mint Ledger ≤10%, `Manrope Variable`, fade-only motion, no marketing gradients/hero/illustration. Auth ships two greens, a 3D hero, `text-[32px]` / `text-[15px]` off-ramp type, and `Techstacks` eyebrow (`tracking-[2px]`) competing with `Invoicify`. The product truth — self-hosted, company-owned, admin vs client separation, accurate money — appears nowhere. Missed opportunity: a quiet ledger-paper form with ownership reassurance and role clarity.

**Deterministic scan:** `impeccable detect --json` on Login + Register + AuthLayout returned 2 findings, both advisory `design-system-font-size` in `AuthLayout.jsx`: `line 150 text-[32px]` and `line 151 text-[15px]` off the DESIGN.md ramp (Display 1.5rem/24px, Body 0.875rem/14px, Label 0.75rem/12px). Exit clean otherwise. The detector missed the load-bearing issues — keyboard-inaccessible toggles, missing autocomplete, dual-brand, input-height mismatch — which the manual review caught. No false positives; both font findings are true positives.

**Visual overlays:** No browser visualization available in this session — no browser automation tool exposed, so no `[Human]` tab, no `detect.js` injection, no console overlay. Fallback signal is source + CLI scan only.

## Overall Impression

Login is close — 2 fields, clear hierarchy, good loading state. Register undoes it: 6 fields in one ungrouped card, silent role assignment, optional contact fields with no why. Single biggest opportunity: bring auth into the Ledger Atelier world and cut Register to essentials, deferring Phone/Address to profile/settings.

## What's Working

1. **Loading + inline errors preserve context:** `LoadingButton loading={processing}` with `Loader2 animate-spin` + disabled, and `errors.email/password` rendered under the field without wiping input. Matches Operate mode.
2. **Password guidance on Register:** `PasswordStrengthInput` with meter (`role="status" aria-live="polite"`), animated segments, and checklist with `sr-only satisfied` text. Better than a bare password field.
3. **Reduced-motion respected:** `useReducedMotion()` gates `framer-motion` `y: 10/14` rise to `0`. Intent is correct, even if rise itself conflicts with DESIGN.md fade-only rule.

## Priority Issues

- **[P1] What:** No Forgot Password / recovery path on Login (`Login.jsx:48-86`).
  **Why it matters:** Auth dead-end; locked-out ops staff and clients contact support. Violates Help (H10) and Recognition (H6).
  **Fix:** Add `Forgot password?` link aligned right of Password label (or under submit), route to reset or Mailtrap-aware placeholder copy. Add `autocomplete="email"` + `current-password`, `required`.
  **Suggested command:** /impeccable clarify

- **[P1] What:** Register demands Phone + Address upfront with no explanation (`Register.jsx:119-140`), mixed with required fields in one `space-y-4` stack.
  **Why it matters:** First-timer abandonment; users guess why an invoicing app needs home address. Increases intrinsic load from 4 to 6 fields.
  **Fix:** Remove Phone/Address from Register; collect in Settings/profile after activation. If must keep, group under `Optional — for invoices` fieldset with `autocomplete="tel street-address"` and `required` markers on Name/Email/Password only.
  **Suggested command:** /impeccable distill

- **[P1] What:** Auth world breaks DESIGN.md — `AuthLayout.jsx:121-156` dark PixelBlast + Three.js CDN (`three.min.js`, `GLTFLoader.js`, `OrbitControls.js`) + `Techstacks` brand + `#10B981` second green.
  **Why it matters:** Two identities, heavy JS on the lowest-trust surface, violates One Voice Rule, Flat-By-Default, Don't add hero/illustration. Slow 3G, CSP/CDN failure risk with only `TechstackMark` fallback.
  **Fix:** Replace left panel with flat paper/muted-mist panel, hairline border, Invoicify mark in Mint Ledger, 24px Display title, tabular reassurance line (`Self-hosted · You own the data`). Drop Three.js/PixelBlast or gate behind `prefers-reduced-motion` + lazy load. Unify to `#24D6AE`.
  **Suggested command:** /impeccable quieter

- **[P2] What:** Toggles keyboard-inaccessible + inconsistent inputs (`Login.jsx:71-76`, `Register.jsx:108-113`, `password-strength.tsx:170-182`).
  **Why it matters:** Sam tabs past Show/Hide entirely (`tabIndex={-1}`); touch target ~16px icon vs 44px; `Input h-8 px-2.5` vs strength `h-10 px-3` breaks rhythm; two hover/focus treatments.
  **Fix:** Remove `tabIndex={-1}`, use 32-36px button with visible `focus-visible:ring-1`, unify all auth inputs to `h-10` (or `h-9`) + same toggle component. Add `aria-pressed`, keep `aria-label`.
  **Suggested command:** /impeccable harden

- **[P2] What:** Copy + role inconsistency (`Login.jsx:44-45` `Login / Welcome back`, `Register.jsx:53-54` `Registration / Create your account`, `Register.jsx:28-32` `role: 'client'`).
  **Why it matters:** Noun `Registration` feels cold; admin registering as client silently is a trust break; no cue which portal this enters.
  **Fix:** Use `Log in` / `Create your account` verbs, one subtitle pattern (`Access your invoices and payments`). Surface role explicitly: `You're creating a client account` + link `Need an admin account? Contact your workspace owner`. Add `aria-describedby` + `aria-invalid` to error paths.
  **Suggested command:** /impeccable clarify

## Persona Red Flags

**Jordan (First-Timer):** Hits Register wall of 6 fields with no grouping or progress; `Phone (Optional)` with `+1 234 567 890` placeholder and `Address (Optional)` with no why — abandons at field 4. No help link, no explanation of client vs admin, `Registration` title gives no reassurance. After submit, `password_confirmation` mismatch shows nothing (`Register.jsx:118` has no error render).

**Sam (Accessibility-Dependent):** Cannot reach either custom Show/Hide button via Tab (`tabIndex={-1}`); screen reader gets `errors.email` as plain `<p>` with no `role="alert"` or `aria-describedby` link; login email/password lack `autocomplete` so password manager flow breaks; strength checklist is the one bright spot (`aria-live` meter). Dark left panel `text-white/70` eyebrow + `text-white/85` body over animated pixels risks contrast/motion issues with no reduce-motion gate on `PixelBlast`/`requestAnimationFrame`.

**Casey (Distracted Mobile):** Left panel hidden (`lg:hidden` logo fallback good), but Register is a long single-column scroll with 6 keyboards; Phone uses `type="text"` with no `inputMode="tel"` / `autocomplete="tel"` so iOS shows wrong keyboard; no state persistence note — interruption mid-form + Inertia re-render risks loss; primary `Register` button at very bottom, out of thumb zone after scroll.

## Minor Observations

- `CardTitle text-2xl` (30px) overshoots DESIGN.md Display 24px; Register card should use `text-xl font-semibold tracking-tight`.
- `motion.div y: 10/14` rise conflicts with DESIGN.md `honor reduced-motion: fade only` — keep opacity, drop y entirely.
- `placeholder="••••••••"` on all passwords masks length; use `Enter your password` / `Choose a password (8+ chars)` instead.
- Mobile `TechstackMark size-9` + `text-primary` duplicates desktop panel brand; keep one.
- `Label htmlFor="password"` on Register points at `PasswordStrengthInput id="password"` — works, but confirm input has no `autocomplete="new-password"` while password does.
- No `required` or `aria-required` markers anywhere; add asterisk + `required` to Name/Email/Password.

## Questions to Consider

- What if Register asked only Name + Email + Password, and Phone/Address lived where invoices actually need them?
- Does auth need to feel immersive, or would the most confident version be the quietest surface in the app?
- What would make a client sure within 5 seconds which door they just opened — client portal or admin?
