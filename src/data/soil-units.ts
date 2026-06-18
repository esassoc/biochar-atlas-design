// =============================================================================
// MOCK DATA — for prototyping only.
// Representative property values for real Willamette Valley (Lane County, OR)
// soil series. Series names and taxonomic classes are genuine; the per-property
// values are plausible representative figures, not parsed from a live SSURGO
// query. Survey area is OR039 (Lane County Area, Oregon). The four
// calibration-locked values on Willamette silt loam (clay 18%, OM 3.4%, pH 5.9,
// CEC 22) must not change — the scoring calibration depends on them.
//
// The second block of properties (cecMeqCm3 … surfaceStonesPct) feeds the NRCS
// "Dynamic Soil Properties Response to Biochar" interpretation (interpretation.ts),
// which scores the SITE's readiness to receive biochar — distinct from scoring.ts,
// which scores which BIOCHAR best fits. These NRCS-criteria values are mock too.
// Willamette Valley is not karst country, so `karst` is false on every demo
// field (kept honest to the real geography); the interpretation engine still
// handles karst as a hard constraint for the general case.
// =============================================================================

export type DrainageClass =
  | 'Well drained'
  | 'Moderately well drained'
  | 'Somewhat poorly drained'
  | 'Poorly drained';

/** SSURGO flooding-frequency classes, ordered least → most frequent. */
export type FloodingFrequency = 'None' | 'Very rare' | 'Rare' | 'Occasional' | 'Frequent';
/** SSURGO ponding-frequency / duration classes, ordered least → most. */
export type PondingFrequency = 'None' | 'Very brief' | 'Brief' | 'Long' | 'Very long';

export interface SoilUnit {
  /** SSURGO map-unit key (5-digit string here for the mock). */
  mukey: string;
  /** Map-unit symbol shown on the soil survey. */
  musym: string;
  /** Soil series name. */
  series: string;
  /** Full map-unit name. */
  name: string;
  /** USDA Soil Taxonomy classification. */
  taxonomy: string;
  /** Soil survey area code (OR039 = Lane County Area, Oregon). */
  surveyArea: string;
  /** Representative clay content (% of mineral fraction). */
  clayPct: number;
  /** Representative organic-matter content (% of mass). */
  omPct: number;
  /** Representative surface pH (1:1 water). */
  ph: number;
  /** Representative cation-exchange capacity (cmol(+)/kg). */
  cecCmolKg: number;
  drainageClass: DrainageClass;
  /** Available water capacity (inches of water per inch of soil ≈ cm³/cm³). */
  awcInPerIn: number;
  /** Representative profile depth to a root-limiting layer (inches). */
  depthIn: number;
  /** Representative slope (%). */
  slopePct: number;
  /** USDA texture class of the surface horizon. */
  texture: string;
  /** NRCS farmland classification. */
  farmlandClass: string;

  // ── NRCS Dynamic Soil Properties Response criteria (see interpretation.ts) ──
  /** Cation-exchange capacity in the interpretation's units (meq/cm³ to 30cm). */
  cecMeqCm3: number;
  /** Bulk-density ratio: estimated difference ÷ maximum difference by PSDA. */
  bulkDensityRatio: number;
  /** Linear extensibility percent (maximum to 30cm). */
  lepMax: number;
  /** Saturated hydraulic conductivity (µm/s, maximum to 30cm). */
  ksatUmS: number;
  /** Flooding frequency (use-invariant constraint). */
  floodingFreq: FloodingFrequency;
  /** Ponding frequency / duration (use-invariant constraint; disabled when tiled). */
  pondingFreq: PondingFrequency;
  /** Karst landform (hard constraint — groundwater contamination risk). */
  karst: boolean;
  /** Rock-fragment content, cobbles 0–30cm (% by volume). */
  rockFragPct: number;
  /** Surface stones, cover by fragments >250mm (% cover). */
  surfaceStonesPct: number;
}

export const soilUnits: SoilUnit[] = [
  {
    mukey: '46801',
    musym: '92',
    series: 'Willamette',
    name: 'Willamette silt loam, 2 to 5 percent slopes',
    taxonomy: 'fine-silty, mixed, superactive, mesic Pachic Ultic Argixerolls',
    surveyArea: 'OR039',
    clayPct: 18,
    omPct: 3.4,
    ph: 5.9,
    cecCmolKg: 22,
    drainageClass: 'Well drained',
    awcInPerIn: 0.21,
    depthIn: 60,
    slopePct: 3,
    texture: 'Silt loam',
    farmlandClass: 'All areas are prime farmland',
    cecMeqCm3: 11,
    bulkDensityRatio: 0.25,
    lepMax: 5,
    ksatUmS: 22,
    floodingFreq: 'None',
    pondingFreq: 'None',
    karst: false,
    rockFragPct: 1,
    surfaceStonesPct: 0.05,
  },
  {
    mukey: '46802',
    musym: '94',
    series: 'Woodburn',
    name: 'Woodburn silt loam, 0 to 3 percent slopes',
    taxonomy: 'fine-silty, mixed, superactive, mesic Aquultic Argixerolls',
    surveyArea: 'OR039',
    clayPct: 20,
    omPct: 3.0,
    ph: 6.1,
    cecCmolKg: 20,
    drainageClass: 'Moderately well drained',
    awcInPerIn: 0.20,
    depthIn: 60,
    slopePct: 2,
    texture: 'Silt loam',
    farmlandClass: 'All areas are prime farmland',
    cecMeqCm3: 10,
    bulkDensityRatio: 0.22,
    lepMax: 5,
    ksatUmS: 20,
    floodingFreq: 'None',
    pondingFreq: 'Very brief',
    karst: false,
    rockFragPct: 1.5,
    surfaceStonesPct: 0.1,
  },
  {
    mukey: '46803',
    musym: '76',
    series: 'Malabon',
    name: 'Malabon silty clay loam, 0 to 3 percent slopes',
    taxonomy: 'fine, mixed, superactive, mesic Pachic Ultic Argixerolls',
    surveyArea: 'OR039',
    clayPct: 32,
    omPct: 3.6,
    ph: 6.0,
    cecCmolKg: 26,
    drainageClass: 'Well drained',
    awcInPerIn: 0.19,
    depthIn: 60,
    slopePct: 2,
    texture: 'Silty clay loam',
    farmlandClass: 'All areas are prime farmland',
    cecMeqCm3: 14,
    bulkDensityRatio: 0.10,
    lepMax: 8,
    ksatUmS: 16,
    floodingFreq: 'None',
    pondingFreq: 'None',
    karst: false,
    rockFragPct: 2,
    surfaceStonesPct: 0.05,
  },
  {
    mukey: '46804',
    musym: '27',
    series: 'Chehalis',
    name: 'Chehalis silt loam, 0 to 3 percent slopes',
    taxonomy: 'fine-silty, mixed, superactive, mesic Cumulic Ultic Haploxerolls',
    surveyArea: 'OR039',
    clayPct: 22,
    omPct: 4.0,
    ph: 6.2,
    cecCmolKg: 23,
    drainageClass: 'Well drained',
    awcInPerIn: 0.22,
    depthIn: 60,
    slopePct: 1,
    texture: 'Silt loam',
    farmlandClass: 'All areas are prime farmland',
    cecMeqCm3: 12,
    bulkDensityRatio: 0.30,
    lepMax: 4,
    ksatUmS: 28,
    floodingFreq: 'Occasional',
    pondingFreq: 'Brief',
    karst: false,
    rockFragPct: 1,
    surfaceStonesPct: 0.05,
  },
  {
    mukey: '46805',
    musym: '32',
    series: 'Coburg',
    name: 'Coburg silty clay loam, 0 to 3 percent slopes',
    taxonomy: 'fine, mixed, superactive, mesic Aquultic Argixerolls',
    surveyArea: 'OR039',
    clayPct: 30,
    omPct: 3.2,
    ph: 6.0,
    cecCmolKg: 25,
    drainageClass: 'Moderately well drained',
    awcInPerIn: 0.20,
    depthIn: 60,
    slopePct: 2,
    texture: 'Silty clay loam',
    farmlandClass: 'All areas are prime farmland',
    cecMeqCm3: 13,
    bulkDensityRatio: 0.15,
    lepMax: 7,
    ksatUmS: 18,
    floodingFreq: 'Rare',
    pondingFreq: 'Brief',
    karst: false,
    rockFragPct: 2,
    surfaceStonesPct: 0.1,
  },
  {
    mukey: '46806',
    musym: '4',
    series: 'Amity',
    name: 'Amity silt loam, 0 to 3 percent slopes',
    taxonomy: 'fine-silty, mixed, superactive, mesic Argiaquic Xeric Argialbolls',
    surveyArea: 'OR039',
    clayPct: 19,
    omPct: 2.8,
    ph: 5.7,
    cecCmolKg: 19,
    drainageClass: 'Somewhat poorly drained',
    awcInPerIn: 0.20,
    depthIn: 60,
    slopePct: 1,
    texture: 'Silt loam',
    farmlandClass: 'All areas are prime farmland',
    cecMeqCm3: 9,
    bulkDensityRatio: 0.20,
    lepMax: 6,
    ksatUmS: 12,
    floodingFreq: 'Rare',
    pondingFreq: 'Brief',
    karst: false,
    rockFragPct: 1,
    surfaceStonesPct: 0.1,
  },
  {
    mukey: '46807',
    musym: '36',
    series: 'Dayton',
    name: 'Dayton silt loam, 0 to 3 percent slopes',
    taxonomy: 'fine, smectitic, mesic Vertic Albaqualfs',
    surveyArea: 'OR039',
    clayPct: 24,
    omPct: 2.5,
    ph: 5.5,
    cecCmolKg: 18,
    drainageClass: 'Poorly drained',
    awcInPerIn: 0.18,
    depthIn: 60,
    slopePct: 0,
    texture: 'Silt loam',
    farmlandClass: 'Prime farmland if drained',
    cecMeqCm3: 8,
    bulkDensityRatio: -0.05,
    lepMax: 14,
    ksatUmS: 8,
    floodingFreq: 'Rare',
    pondingFreq: 'Long',
    karst: false,
    rockFragPct: 1,
    surfaceStonesPct: 0.1,
  },
];

/** Lookup helper — returns undefined if the mukey is unknown. */
export function getSoilUnit(mukey: string): SoilUnit | undefined {
  return soilUnits.find((s) => s.mukey === mukey);
}

/**
 * Hydrologic soil group (SSURGO) — runoff / infiltration potential, A (low runoff)
 * to D (high runoff). Surfaced as a creative SSURGO use. In
 * this mock it's derived from drainage class; a real build reads HSG from SSURGO.
 */
const HSG_BY_DRAINAGE: Record<DrainageClass, 'A' | 'B' | 'C' | 'D'> = {
  'Well drained': 'B',
  'Moderately well drained': 'C',
  'Somewhat poorly drained': 'C',
  'Poorly drained': 'D',
};
export function hsgFor(s: SoilUnit): 'A' | 'B' | 'C' | 'D' {
  return HSG_BY_DRAINAGE[s.drainageClass];
}
