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
  adjacent pair), `--bca-bar-1..5` (continuous 0–100 — ColorBrewer RdYlGn-5,
  peak held and green sunk), and `--bca-badge-*` (4 recommendation values: one
  neutral fill, hue in the ink).
- **The bar ramp was reversed twice on 2026-08-14, and this is the second.**
  Three ramps exist in git; all three are real decisions and none should be
  read back as an oversight.

  | # | ramp | worst adjacent | ends | ordering |
  |---|---|---|---|---|
  | 1 | single-hue cream→green `#fceeda … #364500` | 0.141 | 0.580 | monotonic |
  | 2 | lightness-ordered RdYlGn (`5dda48f`) | 0.103 | 0.433 | monotonic |
  | 3 | **RdYlGn-5, peak held** `#d7191c #fca448 #e7e579 #77af1c #033e16` | 0.107 | 0.106 | non-monotonic |

  Ramp 1 was chosen for measured separation: the dev guide's own
  red→yellow→green screenshot collapses to ΔE 0.051 under deuteranopia, so the
  single hue was the safe answer. Andy took the conventional red-to-green
  anyway — the same call as the status decision the day before, that a score
  bar is a convention the user arrives already knowing. Ramp 2 tried to have
  both: conventional hues re-lit onto a descending lightness ladder, which is
  what held the ends at 0.433. Ramp 3 gives the ladder back on purpose. Andy
  compared six candidates side by side under Machado simulation and picked
  this one knowingly — a trade of measured separation for the conventional
  read. Comparison artifact:
  `andy-work/projects/biochar-atlas/reference/2026-08-14-score-ramp-comparison.html`.

  What ramp 3 costs against ramp 2, measured (Machado 2009, OKLab ΔE,
  worst case across protanopia/deuteranopia/tritanopia; floor 0.020):
  scale ends **0.433 → 0.106**, a 4× reduction in the separation the scale
  exists to carry; lightness ordering lost (span 0.583 but non-monotonic, step
  3 the lightest); and greyscale lost — luminance runs 0.152 → 0.477 → 0.744 →
  0.347 → 0.035, an inverted V, where ramps 1 and 2 both descended cleanly.
  Ramp 3's closest pair is also **not adjacent**: steps 2 and 4 sit 0.036 apart
  under protanopia, which is the ~30% vs ~70% comparison a reader makes
  scanning a column of scores. Ramps 1 and 2 had their closest pair on the
  adjacent diagonal; adjacent-safe stopped implying scan-safe here.

  **The score numeral must always accompany the bar.** WCAG 1.4.1 was
  belt-and-braces under ramp 2 and is the mechanism under ramp 3; a bar
  shipped without its numeral is an accessibility regression, not a style
  lapse. It sits BESIDE the bar, never in the fill — no single ink survives
  the ramp (white clears steps 1 and 5 at 5.19:1 and 12.32:1 and fails 2/3/4
  at 1.99/1.32/2.65; `--bca-neutral-12` does the reverse), and the crossover
  happens twice.

  Step 1 keeps its own literal rather than aliasing `--bca-status-red-11`
  (`#cd2a30`), ΔE 0.0232 away — over the floor, but close enough that across a
  page the two read as one red, so nothing looks broken either way. They stay
  separate because they answer to different constraints: the status red is
  pinned by a white-label requirement (5.29:1) it can never lose, the ramp red
  by CVD separation from steps 2 and 4 and from the track. Aliased, a future
  contrast fix on the danger button would silently re-light a score bar.
  `#d7191c` is also the one step held unmodified from published RdYlGn-5 — 2
  through 5 all moved — so it is the ramp's anchor rather than a spare red.
  This **retires** the ramp-2 claim that the bar block "does not mint a private
  red": it does now, on purpose.

  **The track moved for step 3, 2026-08-14.** `--bca-bar-track` goes
  `--bca-neutral-4` → `--bca-neutral-5` (`#dedddb` → `#d8d7d4`), taking the
  step-3 pair from 0.034 to 0.042 (tritanopia). The mechanism: `#e7e579` sits
  at L 0.901 and neutral-4 at L 0.898; in normal vision chroma separates them
  (C 0.131 vs 0.005), but under tritanopia the yellow's chroma collapses toward
  the neutral axis and lightness carries nothing. The step's lightness is fixed
  by the ramp, so the track was the only movable side. `--bca-neutral-6`
  reaches 0.060 but IS the card border (ΔE 0.000), so an empty bar would draw
  at border weight and read as filled-with-grey; neutral-5 sits 0.025 off the
  border and 0.105 off the panel, so an empty track still reads as a track.
  Step 3 vs the track remains the ramp's binding pair — anything that relights
  either side re-opens this.

  Against the SOH map ramp, ramp 3 overlaps the gold band where ramp 2 did
  not: three pairs now under 0.075 (bar-2/soh-2 at 0.072, bar-3/soh-1 at
  0.071, bar-5/soh-5 at 0.060) against one for ramp 2. They stay legible by
  container — the map ramp only paints polygons, the bar only fills a track —
  so never put a legend for both in one strip.
- Provenance separates by weight here and by SHAPE in the component — color is
  already spoken for by the rating classes.
- **Tone inks and hovers are mapped, not inherited.** Our solids sit at step 11
  so they can carry white; the hub's sit at 9 and carry dark ink. Mapping only
  the fill shipped the hub's dark inks on our dark fills — secondary 2.06:1,
  success 2.11:1, badge warning 2.26:1, button warning 3.24:1, every one a
  failure and the "muddy label" Andy caught. `--color-{secondary,success,
  warning}-on-fill` and `--button-on-warning` are now white, which clears all
  of them (5.02–5.88, primary 10.46) with no fill moved. `--color-{success,
  warning,danger,info}-hover` are the OKLab midpoint of each family's steps 11
  and 12 — unmapped they jumped to hub lime, hub amber and, for info, BLUE.
  `--color-{primary,secondary}-strong` were leaking a hub green (`#2a7e3b`)
  into outline and soft buttons; they are ABI Green and sage/12 now.
- Type: Inter (300–700) + Crimson Pro Light on page titles; JetBrains Mono for
  data values. Sentence case, never Title Case. `--font-display` is the hub's
  own hook, so DocsShell page titles pick the face up with no fork.
- Compatibility block at the end of the theme re-points the old `--bca-*`
  names the prototype pages still reference. Retire with those pages.

## Brand button tones (2026-08-14)
Andy's read of the shipped Button page: only the first swatch (primary green)
was on-brand, and the rest were the hub's semantic tone set borrowed for a
control that is not a status. Brand tones were ADDED beside the conventional
ones rather than replacing them — danger in particular stays conventional red,
consistent with the 2026-08-13 status decision.

- **`bca-button` wraps `esa-button` and adds a `tone` axis** — green, purple,
  gold. It has to be a wrapper: `--_accent` and its siblings are declared on
  `.esa-button[data-astro-cid-…]` at 0,2,0, so a spoke rule needs a third
  selector to win without depending on bundle order, and a wrapper's own
  scoped `[cid] :global(.esa-button)` supplies it. **Hub gap:** a `tone` axis
  on the hub's button, orthogonal to `color`, so a brand does not need a
  wrapper per spoke.
- **`tone="green"` IS `color="primary"`.** `--color-primary` is brand Green, so
  there is no second green — listing it keeps the set reading as three and
  gives a future change one place to land.
- **Purple survives as a fill, but not at the issued hex.** Brand Purple
  `#45173d` is purple-12, a text color. As a fill it carries white at 14.55:1
  but sits ΔE 0.1046 from `--bca-neutral-12`, the app's own near-black — at
  button scale it reads as a black button with a cast. Step 11 `#834877` reads
  purple (ΔE 0.268 from neutral-12), carries white at 6.65:1, and clears
  1.4.11 against the panel on its own at 6.36. So the fill is step 11 and the
  issued hex returns as the hover, where a deeper value is wanted anyway.
  Note the adjacency: `--color-text-link` is also purple-12, so a purple button
  and a link share a family — different roles, one a fill and one text.
- **Gold is the one tone whose fill cannot also be its border.** The issued
  Gold is 1.53:1 against the panel: invisible as an outline, half what WCAG
  1.4.11 asks of a control boundary. Outline draws border AND label from
  gold-11 (5.43 panel, 5.11 canvas). Gold also cannot carry white — 1.60:1 —
  so the fill's ink is ABI Green at 6.54:1, the same pairing the topbar avatar
  uses. **This is the failure visible in Andy's screenshot**, a gold button
  with a white label.
- **Gold's hover cannot be gold-10**, which drops that green label to 3.62:1.
  It is the OKLab midpoint of gold-9 and gold-10, `#e4a73d` — a real point
  between two rungs rather than a value solved for a target — holding the label
  at 4.93:1 while darkening visibly (ΔE 0.0833, four times the visible-edge
  floor).
- **The page was cut, not extended.** Six near-identical swatch rows would have
  become nine. It now groups by the decision a designer is actually making:
  Brand tones (fill and outline), Emphasis (secondary, ghost), Destructive, and
  Status colors — the last documented rather than recommended, because
  colouring a button by status describes an outcome before it has happened.
  The same reasoning changed the Snackbar page's variant triggers to neutral.

## The house grid and record surface (2026-08-14, revised same day)
The Admin › Users prototype establishes the shapes this app reuses for every
collection. It changed once already: it shipped as a list page plus a
`/admin/users/{id}` record page, and Andy reviewed it and reversed three
things. Both states are in git; what follows is the current one, with the
reversals named so the earlier reasoning is not re-derived from scratch.

`src/lib/bca-grid.ts` is the shared theme + renderers, a palette-swapped port
of `beacon-design/src/lib/beacon-grid.ts`. Documented live at
`/design-system/components/bca-user-grid` and `/bca-user-panel` — both pages
mount the SHIPPED components, not copies, so the docs cannot drift from the app.

### The 16px floor does not apply to a data grid — Andy, 2026-08-14
**This is an explicit override and it must not be "fixed" back.** The grid
first shipped at 16px cells in 48px rows, with the reasoning that this spoke
sets a design system rather than mirroring a shipped one. Andy saw it and said
"don't like the chunkiness here" — take it to Beacon's actual numbers. It now
runs Beacon's verbatim: **13px cells and header, 44px rows, 48px header, 4px
radius.**

The carve-out is scoped, not general. It travels with the grid module — cells,
column headers, the control strip above and the count strip below, because he
called the chunkiness out across all three — and stops there. A record opened
from the grid returns to the app scale. The floor still holds for every other
surface, and the four sub-16px fixes in the theme (`--form-font-size-md`,
esa-pill / esa-badge, the two snackbar labels) stand: he approved those the
same day, in the same message.

### The header is a brand slab — Andy, 2026-08-14
Also a reversal. The header first shipped as the panel's own surface with dark
semibold labels and a hairline, on the argument that a solid `#364500` band
undoes the 2026-08-13 chrome decision (the Sage-Light-2 ladder exists because
Andy called the untinted shell "too stark"), and that Beacon reached the same
answer in `settingsEsaTheme` for the same reason. He read that and chose
Beacon's slab anyway. `headerBackgroundColor: '#364500'` with white labels at
**10.46:1**, and Beacon's `rgba(255,255,255,0.2)` resize handles, which are
legible on a dark slab where `--color-border` is not.

The wrapper border is Beacon's treatment unchanged. It does not fight at the
seam, so nothing was solved there — the instruction was to fix a seam conflict
in the border rather than by lightening the slab, and there was no conflict to
fix.

### The record is a panel, not a page — Andy, 2026-08-14
`/admin/users/{id}` is deleted. The record opens as `esa-side-dialog` over the
list, so the grid keeps its scroll, sort and filter state.

- **Width 520px.** Beacon's split across 31 call sites is 520 for a read-only
  dossier and 640 for a write surface. This one reads; the two editable fields
  open a separate `esa-dialog` on top.
- **z-index must be raised on the element.** `esa-side-dialog` is a CUSTOM
  overlay, not a native `<dialog>` — no top layer, and DOM order will not save
  it. This shell's topbar is 1100 and its nav flyout 1200, so the panel runs
  `--z-modal: 1300; --z-modal-backdrop: 1250`.
- **`?user=<id>` is the whole routing story**, ported from beacon-design's
  `BcnProjectDataPanel`, which is the only bidirectional contract in either
  Beacon repo. pushState on open, stripped on close, honoured on load and on
  `popstate`. Two parts are easy to omit and both are load-bearing: a `push`
  flag so a history-driven open does not re-push, and a re-entrancy guard,
  because `popstate` → `close()` fires the lego's `close` event whose handler
  would push a second entry. Triggers stay real `<a href="?user=…">` with only
  the left click intercepted, so copy-link and middle-click work.
- **Every record is server-rendered and hidden.** Opening one unhides it. That
  is what let `bca-record-header`, `bca-field-group` and `bca-field` survive the
  move unchanged — nothing is built at runtime.
- **`slot="footer"` must sit on a real element, never an Astro `<Fragment>`.**
  The Fragment unwraps before the DOM and the attribute is lost; the lego's
  `.footer:not(:has(*))` then collapses an empty bar while the button falls into
  the body. This shipped wrong on the first pass and was caught in a screenshot,
  not in the source.
- **Saving raises an event, it does not write the DOM.** `bca-user-edit-dialog`
  dispatches `bca:user-updated`; the panel and the grid both listen. That is
  what makes it impossible for the open record and the row underneath it to
  disagree — and the grid needs `getRowId` set, or the update has to rebuild
  `rowData` and loses sort, filter and scroll position.
- **Role and Status are chips in the identity band and plain values in the
  Access group.** They used to be chips in both. In 520px the same chip twice
  reads as the panel emphasising something.

### Colour marks the exception, not the value
Andy asked whether cell status chips should be coloured by status. They are,
but only where the colour buys a decision. **Invited** is the one value asking
someone to act, so it is the only chip with a fill. **Active** is eight of ten
rows — tinting it makes a green column carrying no decision — so it takes a
green dot and no fill. **Deactivated** recedes; an inert account is an end
state.

Nothing is red. No account status is a failure, and spending the danger colour
on one would leave nothing to spell an actual failure with.

The tinted chip is Beacon's mechanism exactly: `--_chip` at 16% for the fill and
70% against the body ink for the label. Measured on the amber: **5.63:1** on the
panel, **5.23:1** on the zebra row, **4.91:1** on a hovered row. The hovered row
is the binding case, and it is why the ink mixes toward the body colour —
amber-11 unmixed measures 3.61:1 on the same fill. `bca-status-chip` carries the
same three tones through esa-pill's public hooks, so a status reads identically
in a cell and in the record.

### Still true from the first pass
- **AG Grid v35 Theming API, no CSS import.** `themeQuartz.withParams({...})`
  passed as `gridOptions.theme`; there is no `ag-theme-*.css`. Params are
  literal hex because AG Grid resolves them at config time and cannot read
  custom properties — keep them in sync with the theme BY VALUE.
- **`backgroundColor` must be set, not just `oddRowBackgroundColor`.** Quartz's
  default even row is white, so setting only the odd one put the rows on a
  surface the app has nowhere else. Both are `#fafaf7`; the zebra is sage-3 at
  ΔE 0.0284 from it, where `--bca-neutral-2` measures 0.0139 and disappears.
- **A cell renderer cannot use an `.astro` lego.** `.astro` components are
  compile-time and their CSS is scoped to a `data-astro-cid` attribute; a
  renderer builds its node with `document.createElement` at runtime and can
  never carry it, so the node renders completely unstyled. The Lit tier is not
  an escape either — there is no `esa-pill` web component. The status chip is
  therefore drawn twice: `bca-status-chip.astro` (esa-pill) in the panel, and
  `:global(.bca-grid-chip)` in `bca-user-grid.astro` for cells, with the same
  three tones in both. **Hub gap:** the legos that appear in data grids across
  every spoke — pill, badge, icon — need Lit twins, or the hub needs a
  documented "grid cell" CSS layer.
- **The edit dialog is scoped to what an administrator owns.** Role and status
  only. Name, email, organization and job title belong to the person and arrive
  from the directory; an admin editing them would be changing a fact about a
  colleague rather than a permission.
- **No Deactivated row in the fixture.** Nobody on the real project team has
  been deactivated, and inventing a person to demonstrate a state would put an
  unmodeled name in the data. The state is reachable through the edit dialog
  instead. If the grid needs to show it at rest, that is a fixture decision for
  Andy, not one to make quietly.

## The admin page-title treatment (2026-08-14)
`bca-page-header` is the pattern every admin page uses — not a one-off on Users.
Andy asked for bigger and less bold, with an icon to its left, and for a
proposal on the icon's colour.

- **36px Crimson Pro Light** (`--type-size-700`, weight 300) against
  `esa-page-header`'s default of `--type-size-600` at 550.
- **The glyph is brand Green, not the title's ink.** A 2px-stroke Lucide outline
  at cap height carries far more mass than Crimson Pro Light does at the same
  colour, so matching the ink makes the icon the loudest thing in the row. Green
  measures L 0.364 against the ink's 0.243 — a real value step back — and still
  holds 10.00:1 on the panel. It also reads as identity rather than emphasis,
  which is what a page glyph is for.
- **24px, `size="lg"`.** Crimson Pro's cap height at 36px is ≈24px, so the glyph
  sits on the cap line rather than floating against it.

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
- **The product logotype is "Biochar Atlas"** (Andy, 2026-08-14). This
  REVERSES the 2026-08-13 call recorded here as *"'Atlas' IS the logotype"* —
  the argument then was that the issued ABI mark already sets "American
  Biochar Institute", so "Biochar" appeared twice in one lockup a few
  centimetres apart. Andy weighed that and took the full product name anyway.
  What survives the reversal: the institute logotype stays dropped, the mark
  holds at 36px in both states (its floor — below ~32px the gold star and the
  cutouts close into a blob), the pair stays horizontal rather than stacked
  (the header has ~72px of vertical room, and horizontal is what makes the
  collapse honest — the word drops, the mark does not move), and the institute
  keeps its credit in the img `alt`.

  What moved: the wordmark comes down from 30px to **24px**. Not a fit
  problem — measured, "Biochar Atlas" in Crimson Pro Light is 155.2px at 30px
  against 246px of usable width (340 nav − 32 header padding − 16 brand
  padding − 36 mark − 10 gap), so 30px fits with 91px to spare. It is a
  proportion problem: at 30px the word runs 4.3× the mark's own width and the
  symbol reads as a bullet in front of a headline. The mark cannot meet it
  halfway, so the type is the only side with room to give; at 24px the word is
  124.2px, 3.5× the mark. `bca-coming-soon` repeats the relationship on the
  canvas and came down proportionally, 28px → 22px.
- **The nav is pruned to what is real** (Andy, 2026-08-14) — the Suitability
  Tool, About, Admin. This retires the roadmap-preview idea entirely, along
  with its two prior treatments: the "Phase 2" tag pills (2026-08-13) and the
  inert muted sections that replaced them the same day. Both the
  `.nav-section__header--disabled` block (and the source-order note that
  guarded it against the `.esa-icon:first-child` rule) and the
  `.nav-sublink--disabled` block are deleted, as are the `disabled` fields on
  `NavSection` and `NavItem`. Suitability became a `link` section rather than
  an accordion — one destination behind a chevron is a disclosure that
  discloses nothing — which added `NavSection.href` and a
  `.nav-section--active .nav-section__header--link` rule so a link section can
  take the same active tint a sublink does. `activeNavId` now also opens the
  section holding the match, unless `expandedSections` says otherwise.
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
- **Sublinks are text-only** (Andy, 2026-08-13); icons belong to the section
  header. The indent that replaces them is not a chosen number — it is
  `calc(header padding + icon size + gap)`, so a sublink label lands exactly
  under its section label (both at x=50 in a 340px nav) and the icon column
  reads as a gutter. The row itself is no longer inset, so the active tint is
  as wide as a section header's hover fill. Inside the collapsed-rail flyout
  there is no icon column to align to, so sublinks there reset to their own
  8px padding and line up with the panel title instead. `NavItem` no longer
  has an `icon` field.
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
- **`esa-page-header` cannot put a glyph on the title's line.** Its `icon` prop
  is EYEBROW-only (`{icon && <EsaIcon name={icon} size="sm" />}` inside the
  eyebrow `<p>`), its `title` is a string prop with no slot, and its two slots
  are `breadcrumbs` and `actions`. There is no way in. Beacon hit the same wall
  and hand-rolled it — its `PageLayout` puts `<EsaIcon>` INSIDE the `<h1>` — and
  so does this spoke, in `bca-page-header`, which reads esa-page-header's own
  `--page-header-title-*` hooks so the two cannot drift. **Hub fix:** a
  `titleIcon` prop, or a `title` slot.
- **`esa-side-dialog`'s close button has no themed focus ring.** `.close` sets
  border, radius, background, colour and a hover — but no `:focus-visible`, so
  the UA's blue ring lands on it. The lego moves focus into the panel on open,
  so this shows on *every* open, and it cannot be fixed from a spoke: the button
  is in the component's shadow root and `-webkit-focus-ring-color` is not a
  custom property a theme can re-point. **Hub fix:** a `:focus-visible` rule
  reading `--focus-ring-color` / `--focus-ring-width`, as the other legos do.
- **`esa-button` does not forward `paths` to `esa-icon`.** It renders
  `<EsaIcon name={icon} size={size} />` and stops, so an icon outside the
  built-in registry silently renders an empty 20px SVG next to the label —
  visible as a gap, not as an error. `esa-icon` itself takes `paths` precisely
  for this, and `esa-sidebar-nav` passes it through. Not blocking here (every
  glyph the admin pages use — `plus`, `pencil`, `download`, `users` — is in the
  registry), but the next spoke with a brand glyph on a button will hit it.
  **Hub fix:** an `iconPaths` prop passed straight through.
- **`esa-pill` and `esa-badge` hardcode `font-size` with no hook.** Every other
  value on both — `--pill-bg`, `--pill-text-color`, `--pill-border-color`,
  `--pill-radius`, `--badge-bg`, `--badge-text-color` — is a public token, but
  the size is a private `--_pill-font-size: 13px` / `--_badge-font-size: 13px`
  a theme cannot reach. 13px is under the 16px floor and a status chip is read,
  not glanced. Overridden here with a three-class rule at the bottom of the
  theme, which is the only way to clear the components' own `[astro-cid]`
  specificity without depending on bundle order. Hub fix: expose
  `--pill-font-size` / `--badge-font-size`.
- **`--form-font-size-md` chains to `--type-size-200`**, which clamps at
  0.9375rem — so every default-size input, select and textarea in every spoke
  tops out at 15px and falls to 12px on a narrow viewport. A field someone
  types into is the clearest case of the 16px floor. Re-pointed here at md
  only; xs and sm keep the hub scale for dense toolbar controls. Hub fix: give
  md its own step at or above 1rem.
- **`esa-avatar` derives its background from an `hsl()` hash of the name**
  (`--_avatar-bg: var(--avatar-bg, hsl(var(--_avatar-hue, 200) 45% 65%))`), so
  an unthemed avatar sprays arbitrary hues through a controlled palette. The
  `--avatar-bg` hook makes it fixable in one line, which this theme does — but
  a hash-derived hue should not be the default a brand has to opt out of.
- **`esa-snackbar-item` reads its own `--snackbar-item-bg-*` hooks whose
  fallbacks are HUB PRIMITIVES**, not the semantic tokens a theme re-points —
  so an unthemed toast renders hub green, hub orange, hub red and, for info,
  BLUE. The same shape as the tone-ink and tone-hover problem below, at a
  fourth location. Themed here; measured on the rendered page at
  `#676556 / #177c52 / #a45e00 / #cd2a30`, white ink throughout. Three more on
  the same component. The DEFAULT (variantless) background is a bare
  `var(--color-gray-12)` with no hook at all — latent today, since `variant`
  defaults to `'info'`. The `icon` property is declared reactive but
  `renderIcon()` switches only on `variant`, so setting it does nothing. And
  the message sizes from `--type-size-200` (15px ceiling) and the action label
  from `--type-size-150` (14px), both inside shadow DOM with no size hook —
  under the 16px floor for text a person reads. **The workaround has a trap
  worth keeping:** re-pointing those scale steps on `esa-snackbar-item` does
  nothing, because the container renders its items inside its OWN shadow root
  and a document stylesheet cannot match an element in a shadow tree. It has to
  go on `esa-snackbar-container`, where the inherited custom property crosses
  the boundary. Hub fix: `--snackbar-item-font-size`.
- **No `esa-*` lego is a record-page identity header** — an entity's mark, its
  name, one line of context, its status chips and its record-level actions.
  `esa-page-header` is the list-page answer and has no place for a mark or for
  chips beside the name. Built here as `bca-record-header`; beacon-design
  hand-rolls the same band in its own record page. The reusable home is a
  hub-level `esa-record-header`.
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
- **A tone is three tokens, and only the fill is documented as one.** Remapping
  `--color-success` (or secondary, warning, danger, info) leaves
  `--color-{tone}-on-fill` and `--color-{tone}-hover` pointing at the hub's own
  palette, and both are silent failures: the ink because it still renders (just
  at 2.06–2.26:1 on our darker fills), the hover because nothing is wrong until
  the pointer lands and a success button turns lime, or an info button turns
  blue. A spoke that remaps a tone MUST map all three, and the hub should say
  so — or better, derive the ink from the fill. Also note the two components
  disagree on the warning hook: `esa-badge` reads `--color-warning-on-fill`,
  `esa-button` reads `--button-on-warning`. This spoke defines both.
- **`esa-badge`'s dot variant fills from the HOVER token**
  (`.esa-badge--dot.esa-badge--success { --_badge-bg: var(--color-success-hover) }`),
  which conflates an interaction state with a status solid. It means a spoke
  cannot choose a properly dark hover without darkening its status dots to
  match — the reason this theme's hovers are the 11/12 midpoint rather than
  step 12. The dot should read a solid of its own (`--color-{tone}` or a
  dedicated `--color-{tone}-dot`).
- **DocsShell's brand row has no text wrapper, so name and tag can only sit
  side by side.** It emits three flat flex children — mark, `<b>` name,
  `.ver` tag — and in a 264px sidebar they compete for one line: with a real
  logomark in the slot, "Biochar Atlas" and "Design System" both wrapped
  (51.2px tall against 25.6px). A spoke that wants the conventional two-line
  lockup has to re-lay the whole row as a grid from outside and place each
  child by hand, which is what this one does. Hub fix: wrap name + tag in a
  `.brand-text` span (or take a `brandStack` prop) so the stack is a one-line
  spoke override. Related: the slot is 30px while the lettered square it
  replaces is 26px, so any swapped-in mark changes the row's height too — the
  slot should default to the mark's own footprint.
- `--focus-ring-color` is defined twice in `@esa/tokens` and the second one
  wins: `tokens.css` sets it to `--color-primary` (correct — it follows the
  theme), then `component-tokens.css` re-points it to `--color-border-focus`,
  which is `--color-grass-8` (#65ba74). Any spoke importing both in the
  documented order gets mint-green focus rings that ignore its brand and
  measure 2.18:1 against a light canvas — below WCAG 1.4.11's 3.0. Overridden
  here; the hub fix is for `component-tokens.css` to leave the focus ring
  chained to primary. (2.14:1 against the shell's current canvas.)
- `@esa/docs` offers exactly one pill modifier, `pill--stable`, and it tints
  itself with the success tokens — so a non-status label (provenance, kind,
  version) either shouts status green or goes fully plain. This spoke's
  "Inherited" pill went plain. Hub fix: a neutral emphasis modifier, or let the
  pill take its tone as a prop.
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
- **Never write an escaped tag inside a prop that gets `set:html`.**
  `ComponentDoc.astro` renders its `summary` with `set:html`, and Astro decodes
  entities in an attribute at parse time — so `&lt;details&gt;` reached the DOM
  as a real, unclosed `<details>` element. The rest of the page nested inside
  it and the browser labelled it with its own default marker, which is why the
  esa-collapsible page rendered as "▼ Details" with the body jammed into the
  summary line. Name the element in prose (`the native <code>details</code>
  element`) instead. It was the only instance in the spoke; grep `&lt;` before
  adding another.
- `.claude/` (component-first skill + check-component-first hook +
  settings.json) is part of spoke init — beacon-design and cb-fish-design both
  carry it. This spoke initially missed it (ported 2026-06-11); copy it on
  day one.

## Infra
- [ ] Handoff bundle generation (scripts/gen-handoff.mjs) — port from
      beacon-design when the first prototype stabilizes
- [ ] GitHub Pages deploy (gh-pages dep is wired; needs repo + Actions)
