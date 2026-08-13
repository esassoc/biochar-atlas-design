# NEEDS — gap analysis vs. the Ecology hub

What the Biochar Atlas spoke changes, adds, or still needs. Update as
prototypes land; promote broadly-useful patterns back to the hub.

## Token delta (vs hub defaults)

The ABI brand palette, as issued. The twelve brand hexes are final — the
theme carries them verbatim in a `--bca-brand-*` block and derives everything
else from them. Extending with lighter/darker steps is the agreement with ABI
(kickoff 2026-08-12); replacing is not.

- Primary chain re-pointed to ABI Green `#364500` at **green/9**, the Radix
  home of a solid. Green Dark `#262903` falls out at 10 as the hover, and 11–12
  extend past it for pressed states. Anchoring at 9 rather than 12 is what
  makes 1–8 a usable tint range: the light steps span 0.509 in lightness and
  9–12 span 0.177, both over the 0.150 floor, where anchoring at 12 left the
  dark end at 0.059. It costs saturation in the tints (green/3 is near-neutral,
  which is why the active nav item is a solid fill and not a wash) and buys the
  first primary border in this palette that clears WCAG 1.4.11 — green/7 at
  3.06 on canvas, 3.25 on the panel, against green/6's 1.47.
- **Chrome is a tinted shell** — four surfaces on ONE hue (OKLCH 106.6°, the
  Sage family), stepped in lightness with chroma tapering as they lighten.
  Chosen by Andy 2026-08-13 from four lightness ladders; the shipped one is
  "Sage Light 2", the third-lightest.

      topbar   #eaeae2      sidenav  #edece5      canvas  #f4f3ee
      panel    #fafaf7      seam     #deddd4

  This SUPERSEDES the neutral-ramp chrome (topbar `#ffffff` · canvas `#f6f5f4`
  · sidebar `#e8e5de` · panel `#dedddb`, the last of which never existed in the
  built app). The neutral ramp keeps borders, text, wells and disabled states;
  only the four shell surfaces moved onto the Sage hue.

  The problem it solves is measurable. Shipped, the white topbar sat ΔE 0.0783
  from the Ash sidebar and the sidebar sat 0.0783 from the white workflow
  panel — the two hardest seams in the app, about four times the 0.020
  visible-edge floor, and the reason the shell read as cut in half. Tinting
  collapses the topbar seam to 0.0073 and halves the panel seam to 0.0427. The
  panel cannot come down further and stay legible at table density.

  Two crossings, both resolved in the application rather than shipped quietly:
  the panel could not clear the canvas AND white at once (0.036 of lightness
  between them, two visible steps need 0.040), so it takes the canvas side at
  0.0209 — where cards actually sit — leaving white-over-panel shadow-carried
  at 0.0162, which nothing pairs today. And the sidenav sits 0.0170 from
  basemap land on map-bearing report layouts, declared at `--bca-chrome-seam`
  and carried by the border.

  Calibration: beacon's shell is border-first — one tinted region (its topbar,
  ΔL 0.0389 to canvas), everything else one value, borders separating. This
  spoke tints all four because the objection being answered was starkness, not
  busyness.
- Active nav item is a **solid primary fill with inverse text**, not a tint.
  `--color-primary-subtle` sits ΔE 0.0126 from the tinted sidenav — the same
  color — so a wash reads as no state. The solid is 8.83:1 against the sidenav
  (clears 1.4.11 outright) with the label at 10.46:1. AppShell gained
  `--_nav-active-ink` for the label; `--_nav-active-color` deliberately stays
  pointed at primary because it also colors section-header hover and active
  text sitting directly on the sidenav, which inverting would blank.
- Info's subtle surface is **sage/4, not sage/3** like the other three
  families. The shell IS the Sage hue, so sage/3 sits 3.5° of hue and no
  chroma from the canvas — ΔE 0.0079, the same color. Warning has the identical
  problem by luminance and escapes through chroma; Sage has no such escape, so
  an advisory callout separates by value or not at all. Costs 5.19 → 4.83 on
  its own ink, still over 4.5.
- Brand ramps (`--bca-green-*`, `--bca-gold-*`, `--bca-sage-*`,
  `--bca-purple-*`, `--bca-jade-*`), 12 steps each, anchored so the issued hex
  appears unmodified at the step it actually occupies.
- Gold is accent and CTA fill with dark labels only (white on Gold is 1.60:1);
  it never carries a UI state — Gold Dark is 1.86:1 against the canvas, under
  WCAG 1.4.11's 3.0. Focus rings are Green, 9.41:1 on the canvas.
- `--focus-ring-color` / `-width` / `-offset` are now DEFINED. Hub components
  outline with them but the token package never declared them, so the var()
  resolved invalid and focus rings computed to none across every spoke.
- Status families are conventional and deliberately NOT brand — success green,
  warning yellow/amber, danger red (Andy, 2026-08-13). Status is functional
  convention; brand colors carry identity. Info stays Sage and stays in-brand:
  it is the advisory voice, not a state. This supersedes the earlier in-brand
  mapping (success Jade, warning Gold-11, danger Purple), which existed because
  the ABI palette contains no red — hues span 67–150 plus Purple at 335, and
  the 0–60 band is empty. That gap is still real; the statuses just no longer
  try to cover it with Purple. Nothing needs to be asked of ABI.
- Status values live in `--bca-status-{green,amber,red}-*`, NOT in the
  `--bca-<hue>-*` namespace, which means "derived from an issued ABI color".
  Steps 3/6/12 reference the HUB's own Radix primitives (`--color-green-*`,
  `--color-yellow-*`, `--color-red-*`) — conventional status was already in
  @esa/tokens' primitive layer, so no new literals were minted and the
  "[data-theme] re-points semantics, never primitives" contract holds. Step 11
  is the one spoke literal: darkened along OKLCH lightness (hue + chroma held)
  by the least amount that clears 4.5:1 on white, canvas AND its own subtle.
- Deleting the overrides to inherit the hub's status SEMANTICS was checked and
  rejected: the hub spells success in lime (`--color-lime-9` `#bdee63`, a
  bright fill wanting dark text) and info in blue. Lime next to ABI Green reads
  as a second, wronger green. The hub's primitives are the right borrow; its
  status semantics are not.
- Warning's subtle surface is luminance-identical to the canvas (1.02:1), so a
  warning container separates by hue and border, never by value — `-border` is
  load-bearing there in a way it is not for the other three. It does clear the
  perceptual floor (ΔE 0.062), which is chroma doing what value cannot.
- Status solids on the worst light surface — the topbar — run 4.15–4.37:1:
  fine as dots, icons and bars (over the 3.0 non-text floor), not as text.
  Status text uses `-strong`, 10.47:1 at worst on its own subtle. Earlier
  versions of this note and two comments in the theme measured against a panel
  of `#dedddb`; no surface in the app was ever that color — it came from a
  proposal-era mock. Corrected 2026-08-13.
- Functional scales: `--bca-soh-1..5` (the map's 5 discrete suitability
  classes, a Gold→Green path that clears worst-case colorblind ΔE 0.120 per
  adjacent pair), `--bca-bar-1..5` (continuous 0–100, single-hue — the dev
  guide's red→yellow→green collapses to ΔE 0.051 under deuteranopia), and
  `--bca-badge-*` (4 recommendation values: one neutral fill, hue in the ink).
- Provenance separates by weight here and by SHAPE in the component — color is
  already spoken for by the rating classes.
- Type: Inter (300–700) + Crimson Pro Light on page titles; Roboto Mono for
  data values. Sentence case, never Title Case. `--font-display` is the hub's
  own hook, so DocsShell page titles pick the face up with no fork.
- Compatibility block at the end of the theme re-points the old `--bca-*`
  names the prototype pages still reference. Retire with those pages.

## Components to build (bca-*)
- [ ] `bca-score-meter` — 0–100 amber bar + numeral (hub promotion candidate)
- [ ] `bca-goal-chip` — selectable goal pill with check state (compare with
      hub `esa-chip-group` before building)
- [ ] `bca-biochar-card` — compare card: material photo placeholder, feedstock
      / HTT / fixed C / surface area rows
- [ ] `bca-soil-panel` — SSURGO-derived soil context table with provenance
      label + "show more properties" collapsible
- [ ] `bca-results-card` — floating suitability summary with recommendation
      narrative + report download
- [ ] `bca-map-legend` — layer legend card with toggles
- [ ] Leaflet map island (suitability-tool page script, not a component yet)

## Left open by the chrome decision (follow-up)
- AppShell hardcodes `<nav class="side-nav collapsed">` on the suitability
  tool, so the shipped default is a 72px icon rail. The tinted sidenav was
  judged expanded, because that is the surface the decision was about — by
  default it is a narrow strip and the topbar carries most of the tint.
- The workflow stepper's own treatment is deliberately NOT in the chrome
  commit. The solid-fill decision applies to the active NAV item, which is what
  `--_nav-active-bg` styles; the numbered step markers in the canvas are
  wireframe work.
- The two `public/abi-logo-stacked*.png` files are extracted but unwired —
  nothing in the shell renders a logo image yet, and per project notes the mark
  is being replaced. Use the `-alpha` version when it lands: the shell is
  tinted now, and the white-backed version shows its box at ΔE 0.0485.

## Heading weight is component-owned (follow-up)
The theme declares Crimson Pro Light on `h1`, but the weight only lands where
the rule that owns the heading doesn't pin one. Every heading rule in this
spoke and in the hub compiles to `.class[astro-cid] h1[astro-cid]`, which
outranks a `[data-theme] h1` rule by two attribute selectors — a token cannot
win that. Two page titles were opted in by removing their hardcoded weight
(suitability-tool, home hero); the rest still render Crimson Pro semibold if
they inherit the face at all. Making Light stick everywhere is a heading pass
over the components, not a token change.

## Hub gaps found while building (candidates to promote)
- `--focus-ring-color` is defined twice in `@esa/tokens` and the second one
  wins: `tokens.css` sets it to `--color-primary` (correct — it follows the
  theme), then `component-tokens.css` re-points it to `--color-border-focus`,
  which is `--color-grass-8` (#65ba74). Any spoke importing both in the
  documented order gets mint-green focus rings that ignore its brand and
  measure 2.18:1 against a light canvas — below WCAG 1.4.11's 3.0. Overridden
  here; the hub fix is for `component-tokens.css` to leave the focus ring
  chained to primary. (2.14:1 against the shell's current canvas.)
- `@esa/docs` DocsShell hardcodes `font-weight: 600` on `.article h1` and `h2`
  while reading `--font-display` for the family — so a brand can set the face
  but not the weight. Hub fix: read `--font-weight-*` tokens there too.
- `esa-button` (.astro) drops unknown attributes — icon-only buttons can't
  receive an `aria-label`, so they have no accessible name. Hub fix: forward
  rest attrs to the native button (or add an `ariaLabel` prop).
- `esa-badge` hardcodes `border-radius: var(--radius-full)` — no hook for a
  square/4px-radius badge (needed for numbered workflow-step markers in the
  Suitability Tool). Hub fix: expose `--_badge-radius` like esa-input-tag's
  chip style hooks.
- ~~`esa-chip-group` tone `teal` read teal primitives instead of the semantic
  primary chain~~ — FIXED in hub 2026-06-11: tone now reads
  `--color-primary-subtle/-border/primary`, default radius is 4px (via a new
  `--_radius` knob), md padding bumped. `esa-select` gained
  `--form-label-font-size` / `--form-label-font-weight` hooks the same day.

## Spoke-init lesson (for the NEXT spoke)
- `.claude/` (component-first skill + check-component-first hook +
  settings.json) is part of spoke init — beacon-design and cb-fish-design both
  carry it. This spoke initially missed it (ported 2026-06-11); copy it on
  day one.

## Infra
- [ ] Handoff bundle generation (scripts/gen-handoff.mjs) — port from
      beacon-design when the first prototype stabilizes
- [ ] GitHub Pages deploy (gh-pages dep is wired; needs repo + Actions)
