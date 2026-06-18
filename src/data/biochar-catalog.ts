// =============================================================================
// MOCK DATA — for prototyping only.
// Property values are invented but kept inside realistic published ranges for
// pyrolyzed-biomass biochar (fixed C, ash, pH, CEC, BET surface area, H:C, and
// CaCO3-equivalent liming value). Feedstock names are real and used
// representatively; none of these reflect a measured, certified product.
// The first two entries are the calibration pair and must not change.
// =============================================================================

export type FeedstockClass =
  | 'Softwood'
  | 'Hardwood'
  | 'Nut shell'
  | 'Crop residue'
  | 'Manure'
  | 'Grass';

export interface Biochar {
  /** Stable kebab-case slug — used as the cross-file reference key. */
  id: string;
  /** Display name, includes the highest treatment temperature. */
  name: string;
  feedstockClass: FeedstockClass;
  /** Free-text description of the source biomass. */
  feedstockDetail: string;
  /** Highest treatment temperature (°C). Higher HTT → more fixed C / surface
   *  area / pH / ash and a lower (more stable) H:C ratio. */
  htt: number;
  /** Fixed carbon (% of mass). Proxy for recalcitrant carbon. */
  fixedCarbonPct: number;
  /** Ash content (% of mass). High in manures and crop residues. */
  ashPct: number;
  /** Biochar pH (1:20 in water). */
  ph: number;
  /** Cation-exchange capacity (cmol(+)/kg). Drives nutrient holding. */
  cecCmolKg: number;
  /** BET surface area (m²/g). Drives water holding and microbial habitat. */
  surfaceAreaM2g: number;
  /** Bulk density (g/cm³). Lower = more porous / lighter. */
  bulkDensityGcm3: number;
  /** Molar H:C ratio. Lower = more aromatic / more permanent carbon
   *  (IBI permanence threshold is ~0.7). */
  hcRatio: number;
  /** Liming value as % CaCO3 equivalent. How much it raises soil pH. */
  limingPctCaCO3eq: number;
  /** Typical screened particle-size range. */
  particleSize: string;
  /** Region where this feedstock is plausibly sourced. */
  region: string;
  /** One plain-language sentence for the catalog card. */
  notes: string;
}

export const biocharCatalog: Biochar[] = [
  {
    id: 'douglas-fir-slash-550',
    name: 'Douglas-fir slash, 550°C',
    feedstockClass: 'Softwood',
    feedstockDetail: 'Douglas-fir logging slash (branches and tops)',
    htt: 550,
    fixedCarbonPct: 68,
    ashPct: 4.0,
    ph: 8.2,
    cecCmolKg: 16,
    surfaceAreaM2g: 310,
    bulkDensityGcm3: 0.28,
    hcRatio: 0.42,
    limingPctCaCO3eq: 6,
    particleSize: '2–6 mm',
    region: 'Pacific Northwest (OR/WA)',
    notes:
      'Light, porous softwood char from logging slash; a moderate pH and high pore volume make it a versatile all-rounder for water and carbon goals.',
  },
  {
    id: 'mixed-hardwood-650',
    name: 'Mixed hardwood, 650°C',
    feedstockClass: 'Hardwood',
    feedstockDetail: 'Mixed Pacific Northwest hardwoods (alder, maple, oak)',
    htt: 650,
    fixedCarbonPct: 76,
    ashPct: 9.0,
    ph: 9.8,
    cecCmolKg: 22,
    surfaceAreaM2g: 420,
    bulkDensityGcm3: 0.32,
    hcRatio: 0.32,
    limingPctCaCO3eq: 14,
    particleSize: '1–5 mm',
    region: 'Pacific Northwest',
    notes:
      'Hotter pyrolysis yields very stable, high-surface-area char with strong liming value — best where raising pH is part of the plan.',
  },
  {
    id: 'hazelnut-shell-500',
    name: 'Hazelnut shell, 500°C',
    feedstockClass: 'Nut shell',
    feedstockDetail: 'Hazelnut (filbert) shells from orchard processing',
    htt: 500,
    fixedCarbonPct: 64,
    ashPct: 3.2,
    ph: 7.6,
    cecCmolKg: 14,
    surfaceAreaM2g: 240,
    bulkDensityGcm3: 0.38,
    hcRatio: 0.48,
    limingPctCaCO3eq: 4,
    particleSize: '2–8 mm',
    region: 'Willamette Valley, OR',
    notes:
      'Dense orchard-shell char abundant in the Willamette Valley; near-neutral pH and good carbon stability with only modest porosity.',
  },
  {
    id: 'ponderosa-pine-450',
    name: 'Ponderosa pine, 450°C',
    feedstockClass: 'Softwood',
    feedstockDetail: 'Ponderosa pine forest-thinning residue',
    htt: 450,
    fixedCarbonPct: 58,
    ashPct: 3.5,
    ph: 7.2,
    cecCmolKg: 12,
    surfaceAreaM2g: 160,
    bulkDensityGcm3: 0.26,
    hcRatio: 0.58,
    limingPctCaCO3eq: 3,
    particleSize: '3–10 mm',
    region: 'Eastern Oregon',
    notes:
      'Lower-temperature pine char retains more volatiles (higher H:C); coarse and light, but less stable for long-term carbon storage.',
  },
  {
    id: 'wheat-straw-500',
    name: 'Wheat straw, 500°C',
    feedstockClass: 'Crop residue',
    feedstockDetail: 'Wheat straw (post-harvest residue)',
    htt: 500,
    fixedCarbonPct: 52,
    ashPct: 18,
    ph: 9.2,
    cecCmolKg: 24,
    surfaceAreaM2g: 130,
    bulkDensityGcm3: 0.22,
    hcRatio: 0.50,
    limingPctCaCO3eq: 9,
    particleSize: '1–4 mm',
    region: 'Columbia Basin, OR/WA',
    notes:
      'Ash-rich residue char with good CEC and liming but lower fixed carbon — suited to nutrient and pH goals more than sequestration.',
  },
  {
    id: 'dairy-manure-600',
    name: 'Dairy manure, 600°C',
    feedstockClass: 'Manure',
    feedstockDetail: 'Separated dairy-manure solids',
    htt: 600,
    fixedCarbonPct: 38,
    ashPct: 36,
    ph: 10.2,
    cecCmolKg: 32,
    surfaceAreaM2g: 90,
    bulkDensityGcm3: 0.45,
    hcRatio: 0.40,
    limingPctCaCO3eq: 22,
    particleSize: '0.5–3 mm',
    region: 'Willamette Valley, OR',
    notes:
      'High-ash, high-CEC manure char with strong liming and nutrient value but low fixed carbon — a soil-fertility amendment, not a carbon char.',
  },
  {
    id: 'walnut-shell-550',
    name: 'Walnut shell, 550°C',
    feedstockClass: 'Nut shell',
    feedstockDetail: 'Walnut shells from orchard processing',
    htt: 550,
    fixedCarbonPct: 70,
    ashPct: 3.8,
    ph: 8.0,
    cecCmolKg: 15,
    surfaceAreaM2g: 330,
    bulkDensityGcm3: 0.40,
    hcRatio: 0.40,
    limingPctCaCO3eq: 5,
    particleSize: '2–6 mm',
    region: 'Pacific Northwest',
    notes:
      'Hard, dense nutshell char with high surface area and stable carbon; a near-neutral pH makes it easy to pair with sensitive soils.',
  },
  {
    id: 'oak-600',
    name: 'Oak, 600°C',
    feedstockClass: 'Hardwood',
    feedstockDetail: 'Oak hardwood',
    htt: 600,
    fixedCarbonPct: 74,
    ashPct: 6.5,
    ph: 9.2,
    cecCmolKg: 19,
    surfaceAreaM2g: 390,
    bulkDensityGcm3: 0.34,
    hcRatio: 0.35,
    limingPctCaCO3eq: 11,
    particleSize: '2–6 mm',
    region: 'Pacific Northwest',
    notes:
      'Dense hardwood char with high fixed carbon and a very stable structure; alkaline, so it doubles as a liming amendment.',
  },
  {
    id: 'juniper-500',
    name: 'Western juniper, 500°C',
    feedstockClass: 'Softwood',
    feedstockDetail: 'Western juniper (rangeland-restoration removals)',
    htt: 500,
    fixedCarbonPct: 62,
    ashPct: 5.0,
    ph: 8.0,
    cecCmolKg: 14,
    surfaceAreaM2g: 220,
    bulkDensityGcm3: 0.30,
    hcRatio: 0.46,
    limingPctCaCO3eq: 6,
    particleSize: '3–8 mm',
    region: 'Central/Eastern Oregon',
    notes:
      'Char from western juniper cleared in rangeland restoration; balanced and moderately porous, with mild liming value.',
  },
  {
    id: 'corn-stover-450',
    name: 'Corn stover, 450°C',
    feedstockClass: 'Crop residue',
    feedstockDetail: 'Corn stover (stalks, leaves, cobs)',
    htt: 450,
    fixedCarbonPct: 48,
    ashPct: 22,
    ph: 8.8,
    cecCmolKg: 26,
    surfaceAreaM2g: 70,
    bulkDensityGcm3: 0.20,
    hcRatio: 0.55,
    limingPctCaCO3eq: 12,
    particleSize: '1–4 mm',
    region: 'Willamette Valley / Columbia Basin',
    notes:
      'Very light, ashy residue char with high CEC; a weak structure and low fixed carbon limit it to short-term fertility and pH goals.',
  },
  {
    id: 'switchgrass-550',
    name: 'Switchgrass, 550°C',
    feedstockClass: 'Grass',
    feedstockDetail: 'Switchgrass (perennial bioenergy grass)',
    htt: 550,
    fixedCarbonPct: 56,
    ashPct: 14,
    ph: 9.0,
    cecCmolKg: 22,
    surfaceAreaM2g: 180,
    bulkDensityGcm3: 0.24,
    hcRatio: 0.45,
    limingPctCaCO3eq: 8,
    particleSize: '1–4 mm',
    region: 'Willamette Valley, OR',
    notes:
      'Perennial-grass char with moderate ash and good CEC; a balanced general-purpose amendment with modest sequestration value.',
  },
  {
    id: 'orchard-prunings-600',
    name: 'Orchard prunings, 600°C',
    feedstockClass: 'Hardwood',
    feedstockDetail: 'Mixed orchard prunings (fruit and nut)',
    htt: 600,
    fixedCarbonPct: 72,
    ashPct: 7.5,
    ph: 9.4,
    cecCmolKg: 20,
    surfaceAreaM2g: 360,
    bulkDensityGcm3: 0.33,
    hcRatio: 0.36,
    limingPctCaCO3eq: 12,
    particleSize: '2–6 mm',
    region: 'Willamette Valley / Hood River, OR',
    notes:
      'Woody char from fruit- and nut-orchard prunings; high fixed carbon and a stable structure with useful liming value.',
  },
];

/** Lookup helper — returns undefined if the id is unknown. */
export function getBiochar(id: string): Biochar | undefined {
  return biocharCatalog.find((b) => b.id === id);
}
