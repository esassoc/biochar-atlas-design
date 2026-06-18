# NEEDS — gap analysis vs. the Ecology hub

What the Biochar Atlas spoke changes, adds, or still needs. Update as
prototypes land; promote broadly-useful patterns back to the hub.

## Token delta (vs hub defaults)
- Primary chain re-pointed to forest green (#234a31 family).
- Neutral chain warmed (olive-cast "field notebook" grays, warm paper bg).
- New spoke ramps: `--bca-green-*`, `--bca-amber-*` (suitability scores),
  parchment/cartography accents, provenance colors (SSURGO vs user-provided).
- Type: Public Sans + Roboto Mono; weights remapped 400/500/600/700.

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

## Hub gaps found while building (candidates to promote)
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
