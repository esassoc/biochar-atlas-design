// Biochar Atlas AG Grid kit — the shared client-side grid theme + cell
// renderers. Structurally a port of beacon-design/src/lib/beacon-grid.ts (same
// Theming API object, same renderer-returns-a-DOM-node pattern, same Lucide
// funnel icon override), with this spoke's palette and two deliberate
// divergences documented below.
//
// Literal hex throughout, each annotated with the theme token it mirrors: AG
// Grid resolves theme params at config time and cannot read CSS custom
// properties. Keep these in sync with theme-biochar.css BY VALUE.
//
// Import from a page's client <script>:
//   import { atlasTheme, statusChipRenderer, linkRenderer } from '../lib/bca-grid';
import { themeQuartz, iconOverrides } from 'ag-grid-community';
import type { ICellRendererParams } from 'ag-grid-community';

const lucideFunnelSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>';

const atlasIconOverrides = iconOverrides({
  type: 'image',
  mask: true,
  icons: { filter: { svg: lucideFunnelSvg }, filterActive: { svg: lucideFunnelSvg } },
});

/**
 * The house grid.
 *
 * TWO divergences from Beacon's grid, both deliberate.
 *
 * 1. TYPE IS 16px, NOT 13px. Beacon runs 13px data and header text in 44px
 *    rows because its spoke is a faithful port of the production Angular app,
 *    which predates the floor. This spoke is setting a design system rather
 *    than mirroring a shipped one, and 16px is Andy's minimum for anything a
 *    person reads. Rows and header grow with it — 48px, from 19.2px of line
 *    box plus the same ~28px of breathing room Beacon's 44px row gives its
 *    13px text — so the density change is the type's, not an arbitrary
 *    loosening.
 *
 * 2. THE HEADER IS LIGHT, NOT A BRAND SLAB. Beacon fills its header with
 *    teal-900 because a teal bar IS the Beacon grid's identity. Dropping a
 *    solid #364500 band into this shell would undo the chrome decision made
 *    on 2026-08-13: Andy called the untinted shell "too stark", and the whole
 *    Sage-Light-2 ladder exists to keep the app quiet. So the header runs the
 *    panel's own surface with dark semibold labels and a hairline doing the
 *    band's job — title, columns, rows in one descent. Beacon reached the
 *    same answer for the same reason in `settingsEsaTheme`, where a filled
 *    header would have stacked a second dark bar under its charcoal band.
 *    Brand identity lives in `accentColor` instead, where interaction is.
 */
export const atlasTheme = themeQuartz.withPart(atlasIconOverrides).withParams({
  fontFamily: 'Inter, system-ui, sans-serif',
  headerFontFamily: 'Inter, system-ui, sans-serif',
  accentColor: '#364500', // brand Green / --color-primary — sort, filter-active, checkbox
  foregroundColor: '#21201c', // --bca-neutral-12 / --color-text-primary, 15.59:1 on the panel
  // Quartz's own default is white, which left the header on the panel and the
  // rows on a surface the app has nowhere else. Both are the panel now, so the
  // grid is one plane with the header separated by a rule rather than a value.
  backgroundColor: '#fafaf7', // --color-surface
  headerBackgroundColor: '#fafaf7', // --color-surface — the panel, same plane as the rows
  headerTextColor: '#21201c', // --bca-neutral-12, the same ink the rows carry
  headerFontSize: '16px',
  headerFontWeight: 600,
  headerHeight: 48,
  rowHeight: 48,
  dataFontSize: '16px',
  // The hairline that does the filled band's job. Without it the header and
  // the first row are one continuous surface.
  headerRowBorder: '1px solid #d0cfcc', // --bca-neutral-6 / --color-border
  // Zebra on the shell's own hue rather than a grey: sage-3 sits ΔE 0.0284
  // from the panel — over the 0.020 visible-edge floor, where --bca-neutral-2
  // measures 0.0139 and disappears.
  oddRowBackgroundColor: '#f2f1e9', // --bca-sage-3
  rowHoverColor: '#e6eae0', // --bca-green-3, ΔE 0.0540 from the panel
  borderColor: '#d0cfcc', // --bca-neutral-6 / --color-border
  wrapperBorder: '1px solid #d0cfcc',
  // Bottom corners square because the record-count strip is welded under the
  // grid. A grid that ends at its last row takes the full radius.
  wrapperBorderRadius: '6px 6px 0 0',
  borderRadius: '6px',
  // Beacon's white resize handle is invisible on a light header; the seam is not.
  headerColumnResizeHandleColor: '#d0cfcc',
  checkboxCheckedBackgroundColor: '#364500',
});

/** The card-hosted variant — a grid that ends at its last row, so all four
 *  corners round and nothing is welded underneath. */
export const atlasCardTheme = atlasTheme.withParams({
  wrapperBorderRadius: '6px',
});

/**
 * A quiet status chip — hairline border, surface fill, the value stamped as
 * `data-status` so the consuming page tones it from semantic tokens instead of
 * a literal. AG Grid injects cells outside Astro's style scope, so the page
 * must ship the matching `:global(.bca-grid-chip)` CSS.
 */
export function statusChipRenderer(p: ICellRendererParams) {
  const label = p.value == null ? '' : String(p.value);
  if (!label) return '';
  const el = document.createElement('span');
  el.className = 'bca-grid-chip';
  el.dataset.status = label.toLowerCase();
  el.textContent = label;
  return el;
}

/** Options for {@link makeLinkRenderer}. */
export interface LinkRendererOptions {
  /** Builds the destination from the row. Omit for a non-navigating link. */
  href?: (data: Record<string, unknown>) => string;
}

/** The name cell — a real link to the record page. */
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
