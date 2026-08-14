// Biochar Atlas AG Grid kit — the shared client-side grid theme + cell
// renderers. A port of beacon-design/src/lib/beacon-grid.ts (same Theming API
// object, same renderer-returns-a-DOM-node pattern, same Lucide funnel icon
// override), palette-swapped to this spoke.
//
// Literal hex throughout, each annotated with the theme token it mirrors: AG
// Grid resolves theme params at config time and cannot read CSS custom
// properties. Keep these in sync with theme-biochar.css BY VALUE.
//
// Import from a page's client <script>:
//   import { atlasTheme, makeStatusChipRenderer } from '../lib/bca-grid';
import { themeQuartz, iconOverrides } from 'ag-grid-community';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';

const lucideFunnelSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>';

const atlasIconOverrides = iconOverrides({
  type: 'image',
  mask: true,
  icons: { filter: { svg: lucideFunnelSvg }, filterActive: { svg: lucideFunnelSvg } },
});

/**
 * The house grid — Beacon's numbers, this spoke's palette.
 *
 * TYPE IS 13px AND ROWS ARE 44px, BELOW ANDY'S 16px FLOOR. This is an explicit
 * override he made on 2026-08-14 after seeing the grid at 16px/48px: "don't
 * like the chunkiness here", take it to Beacon's actual numbers. The floor
 * still holds everywhere else in the app — it is a carve-out for dense data
 * grids, not a general relaxation, and it travels with the grid module: cells,
 * header, footer strip and toolbar all sit at the dense scale, nothing outside
 * it does. Recorded in NEEDS.md.
 *
 * The header is a brand slab, also his call, also on 2026-08-14 — he read the
 * argument for a light header (a filled band re-stating the chrome decision of
 * 2026-08-13, which exists to keep the app quiet) and chose Beacon's slab
 * anyway. White on brand Green measures 10.46:1.
 */
export const atlasTheme = themeQuartz.withPart(atlasIconOverrides).withParams({
  fontFamily: 'Inter, system-ui, sans-serif',
  headerFontFamily: 'Inter, system-ui, sans-serif',
  accentColor: '#364500', // brand Green / --color-primary — sort, filter-active, checkbox
  foregroundColor: '#21201c', // --bca-neutral-12 / --color-text-primary, 15.59:1 on the panel

  // ── The brand slab ──────────────────────────────────────────────────────
  headerBackgroundColor: '#364500', // brand Green / --color-primary
  headerTextColor: '#ffffff', // 10.46:1 on the slab
  // Beacon's exact resize-handle treatment: white at 20%, which is legible on
  // a dark slab where the light --color-border used by a light header is not.
  headerColumnResizeHandleColor: 'rgba(255, 255, 255, 0.2)',

  // ── Density: Beacon's numbers, verbatim ─────────────────────────────────
  headerFontSize: '13px',
  headerFontWeight: 600,
  headerHeight: 48,
  rowHeight: 44,
  dataFontSize: '13px',

  // Quartz's own default background is white, which put the rows on a surface
  // the app has nowhere else. The rows sit on the panel; the zebra is the
  // shell's own hue rather than a grey, because --bca-sage-3 sits ΔE 0.0284
  // from the panel where --bca-neutral-2 measures 0.0139 and disappears.
  backgroundColor: '#fafaf7', // --color-surface
  oddRowBackgroundColor: '#f2f1e9', // --bca-sage-3
  rowHoverColor: '#e6eae0', // --bca-green-3, ΔE 0.0540 from the panel

  borderColor: '#d0cfcc', // --bca-neutral-6 / --color-border
  wrapperBorder: '1px solid #d0cfcc',
  // Bottom corners square because the record-count strip is welded under the
  // grid. Beacon's 4px, not this spoke's 6px: the radius is part of what reads
  // as chunky at 44px rows.
  wrapperBorderRadius: '4px 4px 0 0',
  borderRadius: '4px',
  checkboxCheckedBackgroundColor: '#364500',
});

/** The card-hosted variant — a grid that ends at its last row, so all four
 *  corners round and nothing is welded underneath. */
export const atlasCardTheme = atlasTheme.withParams({
  wrapperBorderRadius: '4px',
});

/**
 * The house column defaults. **Columns fill the grid** — `flex` rather than
 * fixed `width`, so the last column ends at the right edge instead of leaving a
 * dead band of empty grid beside it. A page sets a `flex` WEIGHT per column
 * (how much of the surplus that column takes) and a `minWidth` (the point below
 * which it stops shrinking and the grid scrolls instead).
 *
 * `flex` over `sizeColumnsToFit()` deliberately, on two counts:
 *
 *  - It is declarative. AG Grid re-solves it on every container resize with no
 *    `gridSizeChanged` handler to write, so there is nothing to thrash.
 *  - It survives a manual resize. `sizeColumnsToFit()` on a resize event snaps
 *    every column back to the fit, which silently undoes the drag the user just
 *    made. Dragging a flex column pins THAT column and leaves the rest flexing,
 *    which is the behaviour a resize handle promises.
 *
 * The record panel overlays the grid rather than pushing it, so the container
 * width does not change when a record opens and neither approach would thrash
 * there — but a browser resize still happens, and only one of the two survives
 * it intact.
 */
export const atlasDefaultColDef: ColDef = {
  sortable: true,
  resizable: true,
  filter: true,
  suppressHeaderMenuButton: true,
  flex: 1,
  minWidth: 120,
  tooltipValueGetter: (p) => p.value,
};

/** A status value's chip colour. `quiet` draws the dot only, leaving the chip
 *  untinted — for values that are the norm rather than the exception. */
export interface ChipTone {
  /** The hue the dot takes, and the tint when `quiet` is false. */
  chip: string;
  /** True to suppress the fill and the coloured ink. */
  quiet?: boolean;
}

/**
 * Beacon's status chip: a coloured dot, a label, and an optional tint. The
 * renderer stays generic — it stamps `data-status` and sets `--_chip`, and the
 * consuming page's `:global` CSS decides what tinted and quiet look like.
 *
 * AG Grid injects cells outside Astro's style scope, so the page must ship the
 * matching `:global(.bca-grid-chip)` rules.
 */
export function makeStatusChipRenderer(tones: Record<string, ChipTone>) {
  return (p: ICellRendererParams) => {
    const label = p.value == null ? '' : String(p.value);
    if (!label) return '';
    const key = label.toLowerCase();
    const tone = tones[key];

    const el = document.createElement('span');
    el.className = 'bca-grid-chip';
    el.dataset.status = key;
    if (tone?.quiet) el.dataset.quiet = '';
    if (tone) el.style.setProperty('--_chip', tone.chip);

    const dot = document.createElement('span');
    dot.className = 'bca-grid-chip__dot';
    el.append(dot, document.createTextNode(label));
    return el;
  };
}

/** Options for {@link makeLinkRenderer}. */
export interface LinkRendererOptions {
  /** Builds the destination from the row. Omit for a non-navigating link. */
  href?: (data: Record<string, unknown>) => string;
}

/**
 * The name cell — a real anchor with a real href, even though a click is
 * intercepted to open the panel. That is the detail that makes the deep link
 * genuinely shareable: right-click-copy-link and middle-click both work,
 * because the href is not a decoration over a click handler.
 */
export function makeLinkRenderer(options: LinkRendererOptions = {}) {
  return (p: ICellRendererParams) => {
    const el = document.createElement('a');
    el.className = 'bca-grid-name';
    el.textContent = String(p.value ?? '');
    el.href = options.href ? options.href(p.data ?? {}) : '#';
    if (!options.href) el.addEventListener('click', (e) => e.preventDefault());
    return el;
  };
}
