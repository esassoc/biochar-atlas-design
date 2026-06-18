// =============================================================================
// Map constants for the field-picker map. The basemap config is real (CARTO
// Positron, rendered grayscale by the page); the parcel/field overlays come
// from src/data/parcels.ts (real OSM farmland geometry — see
// scripts/fetch-parcels.mjs). Earlier sketch overlays (fake SSURGO quads, a
// hand-drawn river) were removed: everything drawn on this map is now real.
// =============================================================================

/** Map center as [lat, lng] (Leaflet order) — the Santa Clara/Coburg farm belt. */
export const MAP_CENTER: [number, number] = [44.105, -123.065];

/** Default zoom level before the parcel-belt fitBounds runs. */
export const MAP_ZOOM = 12;

/**
 * CARTO Positron ("light_all") raster tiles. The {r} placeholder lets Leaflet
 * request @2x retina tiles. Rendered grayscale via a CSS filter on the tile
 * pane, not here.
 */
export const TILE_URL =
  'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

/** Required OSM + CARTO attribution for the Positron basemap. */
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// -----------------------------------------------------------------------------
// Layer registry (legend)
// -----------------------------------------------------------------------------

export interface MapLayer {
  id: string;
  label: string;
  /** Whether the layer is visible when the map first loads. */
  defaultOn: boolean;
}

/** Toggleable layers for the map legend, in display order. */
export const mapLayers: MapLayer[] = [
  { id: 'selected-field-boundary', label: 'Selected field boundary', defaultOn: true },
  // Real OSM farmland patchwork (src/data/parcels.ts) — the signature patchwork look.
  { id: 'surrounding-parcels', label: 'Surrounding parcels', defaultOn: true },
];
