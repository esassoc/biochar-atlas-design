# @biochar-atlas/design

`biochar-atlas-design` — the active prototyping surface for the **Biochar
Atlas**, the brand and prototype layer for a **Biochar Suitability Tool**,
built on the **[ESA Ecology](../ecology)** hub design system.

Supersedes the interview-era spoke `biochar-design` as of 2026-08-13, when
Phase 1 was contracted. All design work happens here.

## What this is

A prototype of the **Biochar Suitability Tool**: pick a field → auto-derive
SSURGO soil context → choose application goals → compare biochars → scored
recommendation + field-ready report. The audience is NRCS conservationists,
conservation district planners, agronomists, and farmers evaluating biochar as
a soil amendment. This spoke is the design standard a production implementation
would interpret.

## Hub & spoke

```
@esa/ecology (hub)                   @biochar-atlas/design (spoke)
──────────────────────              ─────────────────────────────
primitives ────────────────────────> inherit (never override)
semantic ──────────────────────────> inherit, then OVERRIDE brand
component ─────────────────────────> inherit
esa-* components ──────────────────> reuse (auto re-skinned)
                                     + bca-* components (custom)
```

Packages are consumed as local `file:` links; hub packages must be **built
locally** (`npm run build:tokens` in ../ecology) before `npm install` here.

## Token cascade

Theming is a `[data-theme="biochar"]` override of the semantic layer, loaded
after hub tokens — see [`src/styles/theme-biochar.css`](./src/styles/theme-biochar.css):
forest green primary, warm field-notebook neutrals, score amber, parchment
cartography accents, and Public Sans (the USWDS typeface — a deliberate
credibility signal for the NRCS audience).

## Commands

```bash
npm install
npm run dev        # http://localhost:4340
npm run build
```

## Status

- [x] Spoke scaffold + theme
- [x] Design system (foundations + curated component docs)
- [x] App shell (Atlas-module sidenav + topbar)
- [x] Suitability Tool prototype
- [x] Assessment report
- [ ] Scenario comparison, form workflow, admin
