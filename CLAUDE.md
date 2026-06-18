# Biochar Atlas — Ecology spoke

Astro spoke of the Ecology hub (`../ecology`) for a **Biochar Suitability
Tool** prototype. Read `../ecology/CLAUDE.md` for hub conventions — they all
apply here.

## The product in one paragraph
NRCS conservationists (primary), conservation district planners, agronomists,
and farmers evaluate whether a *specific biochar* suits a *specific field* and
*management goals*. Pick a field on the map → SSURGO soil properties
auto-derive → select goals → compare biochars from a curated catalog → 0–100
suitability scores with plain-language rationale → downloadable field-ready
report. Science (scoring algorithms) comes from USDA ARS; we build the product
layer only.

## Spoke conventions
- Theme: `[data-theme="biochar"]` in `src/styles/theme-biochar.css`. Semantic
  overrides only; spoke-local tokens use the `--bca-*` prefix. Public Sans
  (weights 400/500/600/700 — NOT DM Sans's 350/450/550/650).
- Custom components: `src/components/bca/` with `bca-` prefix. Reuse `esa-*`
  from the hub first; build `bca-*` only when no hub equivalent exists.
- App shell: `src/layouts/AppShell.astro` (ported from beacon-design). The
  sidenav lists Atlas modules — planned modules render ghosted ("Phase 2")
  on purpose: the nav previews the planned roadmap.
- Mock data lives in `src/data/`. Scoring (`src/data/scoring.ts`) must be
  DETERMINISTIC — same inputs, same scores, every demo run. Calibration
  anchor: Douglas-fir slash 550°C scores 78 and mixed hardwood 650°C scores 64
  on the default scenario (Willamette silt loam + water retention / SOM /
  carbon sequestration goals). These are fixed calibration anchors.
- Demo geography: the Santa Clara/Coburg farm belt, Lane County, Oregon (map
  centers on 44.105°N, 123.065°W). Survey area is **OR039** — keep it fixed to
  this Oregon code (a WA075 code would be Washington, wrong here). Demo fields = the 20 REAL
  OSM farmland parcels in `src/data/parcels.ts` (refresh via
  `scripts/fetch-parcels.mjs`); names/soil assignments are mock (`fields.ts`),
  and `fields[0]` must stay pinned to Willamette silt loam for the
  calibration anchors. Map overlays are real geometry only — no sketch layers.
- Maps: Leaflet with real tiles (dep already configured in astro.config.mjs
  `optimizeDeps`). Mute tiles toward the parchment palette with CSS filters.
- Dev port 4340. Do not run `npm run build` from parallel agents — write
  files, then one consolidated build verifies.

## Where the intelligence lives

The component-first skill, the `check-component-first` PreToolUse hook,
/spoke-init, and the pre-commit review all ship from the **spoke-kit plugin**
(`ecology` marketplace, hosted in the hub repo `esassoc/ecology`). Nothing is
copied into this repo: `.claude/settings.json` declares the marketplace and
enables the plugin, and a SessionStart check warns if it's missing. To update:
`claude plugin marketplace update ecology`.

Note: the hook's escape token is `bcn-lego-checked:` in every spoke (it's
universal); this spoke's own components still use the `bca-` prefix per the
conventions above.
