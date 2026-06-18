// =============================================================================
// REAL GEOMETRY, MOCK IDENTITY — demo field sites derived from the 20 real
// OpenStreetMap farmland parcels in parcels.ts (scripts/fetch-parcels.mjs).
// Boundaries and acreage are real; names, owners, localities, and the
// field → SSURGO soil assignment are invented for the prototype.
//
// Ordering contract: fields[0] is the DEFAULT field on the Suitability Tool,
// chosen as the parcel closest to 27.4 ac and pinned to
// Willamette silt loam (mukey 46801) so the scoring calibration anchors
// (Douglas-fir 78 / mixed hardwood 64) reproduce on first load.
// =============================================================================

import { parcels } from './parcels';

export interface PolygonGeometry {
  type: 'Polygon';
  /** GeoJSON ring(s); [lng, lat] order; first ring closed (first === last). */
  coordinates: number[][][];
}

export interface FieldSite {
  id: string;
  name: string;
  /** Field area in acres (computed from the real polygon). */
  acres: number;
  /** Map centroid as [lat, lng] (Leaflet order). */
  centroid: [number, number];
  /** SoilUnit.mukey of the field's (mock-assigned) dominant soil. */
  soilMukey: string;
  /** Owner name, or '—' for anonymized demo fields. */
  owner: string;
  /** Nearest locality, for orientation. */
  locality: string;
  boundary: PolygonGeometry;
}

/** Willamette-Valley-flavored field names, assigned by display order. */
const FIELD_NAMES = [
  'River Bend Field',
  'Santa Clara Flat',
  'Coburg Bottoms',
  'Green Island Margin',
  'Awbrey Slough Forty',
  'Prairie Road Field',
  'Willakenzie Block',
  'McKenzie Confluence Field',
  'Spring Creek Strip',
  'Irving Road Field',
  'Beacon Drive Forty',
  'Harlow Bottoms',
  'Game Farm Flat',
  'Maple Drive Field',
  'Wilkes Bend',
  'Delta Ponds Edge',
  'Armitage Field',
  'Coburg Road Strip',
  'Meadowlark Edge',
  'Country Farm Loop Field',
];

/** Deterministic soil variety; index 0 → Willamette (the calibration anchor). */
const SOIL_ROTATION = ['46801', '46803', '46805', '46802', '46807', '46804', '46806'];

/** Average of the ring's vertices (excluding the closing duplicate), [lat, lng]. */
function centroidOf(ring: number[][]): [number, number] {
  const pts = ring.slice(0, -1);
  const lat = pts.reduce((s, [, la]) => s + la, 0) / pts.length;
  const lng = pts.reduce((s, [lo]) => s + lo, 0) / pts.length;
  return [Math.round(lat * 1e4) / 1e4, Math.round(lng * 1e4) / 1e4];
}

function localityOf(lat: number): string {
  if (lat >= 44.118) return 'Coburg, OR';
  if (lat >= 44.085) return 'Santa Clara, OR';
  return 'Eugene, OR';
}

// Default-first ordering: the parcel nearest 27.4 ac leads.
const ordered = (() => {
  const rest = [...parcels];
  let best = 0;
  let bestDelta = Infinity;
  rest.forEach((p, i) => {
    const delta = Math.abs(p.acres - 27.4);
    if (delta < bestDelta) {
      bestDelta = delta;
      best = i;
    }
  });
  const [defaultParcel] = rest.splice(best, 1);
  return [defaultParcel, ...rest];
})();

export const fields: FieldSite[] = ordered.map((parcel, i) => {
  const centroid = centroidOf(parcel.ring);
  return {
    id: parcel.id,
    name: FIELD_NAMES[i % FIELD_NAMES.length],
    acres: parcel.acres,
    centroid,
    soilMukey: SOIL_ROTATION[i % SOIL_ROTATION.length],
    owner: '—',
    locality: localityOf(centroid[0]),
    boundary: { type: 'Polygon', coordinates: [parcel.ring] },
  };
});
