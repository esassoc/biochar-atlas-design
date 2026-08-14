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
- **Chrome is a tinted shell** — four surfaces in the Sage family (OKLCH hue
  97–107°), stepped in lightness with chroma tapering as they lighten.
  Chosen by Andy 2026-08-13 from four lightness ladders; the shipped one is
  "Sage Light 2", the third-lightest.

      topbar   #e6e5dd      sidenav  #edece5      canvas  #f4f3ee
      panel    #fafaf7      seam     #deddd4

  This SUPERSEDES the neutral-ramp chrome (topbar `#ffffff` · canvas `#f6f5f4`
  · sidebar `#e8e5de` · panel `#dedddb`, the last of which never existed in the
  built app). The neutral ramp keeps borders, text, wells and disabled states;
  only the four shell surfaces moved onto the Sage hue.

  The problem it solves is measurable. Shipped, the white topbar sat ΔE 0.0783
  from the Ash sidebar and the sidebar sat 0.0783 from the white workflow
  panel — the two hardest seams in the app, about four times the 0.020
  visible-edge floor, and the reason the shell read as cut in half. Tinting
  collapses the topbar seam to 0.0215 and halves the panel seam to 0.0427. The
  panel cannot come down further and stay legible at table density.

  The topbar seam landed at 0.0073 first — one continuous frame, deliberately
  sub-floor. Andy asked for "just a tick" of separation the same day, so the
  bar moved down the Sage ladder to `#e6e5dd`, the exact OKLab midpoint of
  sage/4 and sage/5. That is a real rung of the ramp, not a value reverse-
  engineered from a target: sage/4 itself reads at 0.0094 (invisible) and
  sage/5 at 0.0310 (a band across the top). It also puts the bar on the ramp's
  own hue, 100.8°, rather than the 106.6° the interpolated value carried.

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
- [ ] Leaflet map island — the map, its fixtures and the `leaflet` dependency
      were all removed when the spoke narrowed to the shell (see below).
      Rebuilding it starts from `git show a810b3d:src/pages/prototypes/suitability-tool.astro`.

## Shell demo pass (2026-08-13)
The spoke's job narrowed to demonstrating the app shell and the design system.
Deleted: both prototype pages, `bca-assessment-report`,
`bca-interpretation-panel`, `biochar-map.css`, every `src/data/*` fixture except
`ds-nav.ts`, `scripts/fetch-parcels.mjs`, and the `leaflet` /`@types/leaflet`
dependencies with their Vite `optimizeDeps` workaround. One shell page survives
at `/suitability-tool`, holding `bca-coming-soon`.
- **"Atlas" IS the logotype.** The institute logotype was dropped from the
  sidenav entirely (Andy, 2026-08-13, reversing the composition shipped hours
  earlier); the lockup is now the issued symbol at 36px beside "Atlas" at 30px,
  Crimson Pro Light in ABI Green. Horizontal rather than stacked: the header has
  ~72px of vertical room and stacking pushes the first nav row down, and laid
  out this way the collapse is honest — the word drops and the mark does not
  move. 36px is the same size in both states and is also the floor; below ~32px
  the gold star and the cutouts close into a blob. The institute keeps its
  credit in the img `alt`. `bca-coming-soon` still repeats the relationship on
  the canvas.
- **Phase 2 pills are gone.** Those four sections render inert instead —
  header only, no chevron, no sublist, `--color-text-muted` at 5.38:1 on the
  sidenav. The disabled block MUST stay after the `.nav-section__header >
  .esa-icon:first-child` rule: both weigh 0,2,0, so source order is the only
  thing muting the icon, and that icon is the entire signal on the rail.
- **The shell ships EXPANDED** as of 2026-08-13. It shipped collapsed first,
  which hid the lockup, the nav hierarchy and the inert sections — everything
  the pass had just added — behind a click.
- **The active nav item is a tint, not a slab** (Andy: the solid green was
  overwhelming). green-4 wash + Green label + semibold. Both halves are tokens
  on `.side-nav` — `--_nav-active-bg` / `--_nav-active-ink` — and the block
  above them carries two documented alternates (green-5 for more presence,
  gold-5 for the warm/brand-accent read) as a two-line swap. The trade is
  written down there and is worth knowing before touching it: the old slab was
  8.83:1 against the sidenav, so the FILL ALONE satisfied WCAG 1.4.11. No tint
  can — green-7 is the first step near 3:1 and it is far too dark to carry
  Green text — so the state now rests on fill + color + weight together.
- **Collapsed-rail flyouts.** A section's sublinks move into a floating panel
  beside the rail on hover or focus. Two traps are load-bearing:
  `.main-nav` had `overflow-y: auto; overflow-x: visible`, and a box with
  `overflow-y: auto` computes `visible` to `auto` — the flyout was clipped at
  the rail edge until the rail got `overflow: visible` outright. And the
  panel is revealed with `visibility`, not `display`, specifically so
  `:focus-within` on the always-visible section header opens it and puts the
  links in the tab order.
- **The topbar's bottom edge has its own token**, `--_topbar-border` at sage-7
  — one rung darker than `--bca-chrome-seam`, which every other chrome border
  still uses. Under a topbar that is now its own plane the shared seam read
  soft (ΔE 0.0247 against the bar; sage-7 reads 0.0684).
- **The user avatar is filled brand Gold with Green initials** (6.54:1). Never
  white on gold — that is 1.60:1. The ring is gone; the disc sits ΔE 0.1416
  from the topbar and holds its own edge.
- The workflow stepper's own treatment remains out of scope — wireframe work.


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
- No `esa-*` lego is a **search-trigger field** — a control shaped like a search
  input that opens something rather than submitting. `esa-text-field` is a real
  bordered, labelled input, `esa-icon-button` is icon-only, `esa-search-panel`
  is a whole filter surface. Beacon built `BcnSearchTrigger`, cb-fish built
  `cbf-search-field`, and this spoke now has `bca-global-search`: three
  independent spokes solving the same shape, which is the promotion signal.
- No `esa-*` lego is a **collapsed-rail flyout** — a section's sublinks in a
  panel beside a narrow icon rail. `esa-sidebar-nav`, an entire sidebar nav and
  therefore the component that should own this, answers the same problem with
  `:host([collapsed]) .children { display: none }` — it drops the children
  instead of relocating them. `esa-nav-dropdown` is a `<details>` that opens
  BELOW its trigger (`top: 100%; left: 0`) from a labelled icon-link with a
  chevron: wrong axis, wrong trigger. `esa-popover` is closest mechanically
  (`position="right"`, hover trigger, Esc + outside-click) but renders
  `role="dialog"` and pins itself `top: 50%; translateY(-50%)`, both inside
  shadow DOM and so unreachable — a submenu of links is not a dialog, and a
  four-item panel centred on a 44px icon row hangs above and below it. Built
  here as `.nav-flyout`.
- No `esa-*` lego is a **disclosure icon-button**, which is why the sidebar
  toggle stays hand-rolled under a lego-check. `esa-icon-button` renders exactly
  `<Tag class aria-label title><EsaIcon name size/></Tag>` with no rest-spread,
  so it takes no `id` and — the load-bearing one — cannot carry `aria-expanded`.
  A disclosure control has to ship its state in server-rendered markup, not
  acquire it on first click. It also forwards no `paths` (so `panel-left`, which
  is outside esa-icon's built-in registry, is unreachable) and exposes no hook on
  its inner icon, which this control needs to mirror the glyph on state. Not a
  spoke quirk: `beacon-design/src/layouts/AppShell.astro` ships the identical
  hand-rolled button and reserves `EsaIconButton` for its plain admin link. The
  reusable home is a hub-level `esa-disclosure-button` — icon-only,
  `aria-expanded`, forwardable `paths`, class hook on the glyph.
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
