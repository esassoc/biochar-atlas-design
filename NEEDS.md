# NEEDS — gap analysis vs. the Ecology hub

What the Biochar Atlas spoke changes, adds, or still needs. Update as
prototypes land; promote broadly-useful patterns back to the hub.

## Token delta (vs hub defaults)

The ABI brand palette, as issued. The twelve brand hexes are final — the
theme carries them verbatim in a `--bca-brand-*` block and derives everything
else from them. Extending with lighter/darker steps is the agreement with ABI
(kickoff 2026-08-12); replacing is not.

- Primary chain re-pointed to ABI Green `#364500`, at its natural ramp
  position (step 12 — the darkest step, because Green is a text and solid
  color, not a mid-tone). Hover is Green Dark `#262903`.
- Neutral chain rebuilt as a 12-step scale on the palette's own neutral hue
  (OKLCH 87.1°). Brand Ash is step 3 exactly and Grey Dark lands on step 12,
  so the chrome shares the brand's cast rather than sitting beside it.
  Chrome: topbar `#ffffff` · canvas `#f6f5f4` · sidebar `#e8e5de` ·
  panel `#dedddb`.
- Brand ramps (`--bca-green-*`, `--bca-gold-*`, `--bca-sage-*`,
  `--bca-purple-*`, `--bca-jade-*`), 12 steps each, anchored so the issued hex
  appears unmodified at the step it actually occupies.
- Gold is accent and CTA fill with dark labels only (white on Gold is 1.60:1);
  it never carries a UI state — Gold Dark is 1.90:1 against the canvas, under
  WCAG 1.4.11's 3.0. Focus rings are Green.
- `--focus-ring-color` / `-width` / `-offset` are now DEFINED. Hub components
  outline with them but the token package never declared them, so the var()
  resolved invalid and focus rings computed to none across every spoke.
- Status families are in-brand: info Sage, success Jade, warning Gold-11,
  danger Purple. The palette contains no red (hues span 67–150 plus Purple at
  335; the 0–60 band is empty), so Purple carries the negative signal.
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
  chained to primary.
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
