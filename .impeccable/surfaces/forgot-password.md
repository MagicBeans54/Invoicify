---
version: 1
slug: "forgot-password"
primary_target: "forgot-password"
related_targets: ["Auth/Login","Auth/Register"]
---

## Direction contract

THESIS: Self-serve reset closes the auth loop; it refuses the dead-end "contact your owner" pattern for a company-owned tool.

OWN-WORLD: Inherits AuthLayout dark PixelBlast plus centered paper Card, 32px mint-ledger primary, hairline inputs, Manrope semibold titles, tabular numerals.

STORY: A locked-out admin or client enters their account email, receives a 60-minute link via existing mail, picks a new password with the shared strength meter, and lands back at login.

FIRST VIEWPORT: Centered Card under AuthLayout; title plus muted description, single email field, full-width mint send button, back-to-login footer; sent and reset states reuse the same Card shell with status copy.

FORM: Direct extension of Auth/Login composition; narrow specified request so no concept roll per new-work extension rule.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
