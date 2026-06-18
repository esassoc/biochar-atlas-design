// =============================================================================
// MOCK INTERPRETATION ENGINE — for prototyping only.
// A deterministic, explainable stand-in for the NRCS "Dynamic Soil Properties
// Response to Biochar" model (USDA ARS owns the real science). It scores
// the SITE's readiness to receive biochar — distinct from scoring.ts, which
// scores which BIOCHAR best fits. The two compose: site readiness first
// (this module), then biochar selection (scoring.ts).
//
// Model, per the NRCS interpretation doc:
//   • 7 DYNAMIC soil properties (pH, CEC, OM, bulk-density ratio, LEP, Ksat,
//     AWC). Each gets a 0–1 membership value modeling the degree of positive
//     impact biochar can have. The doc multiplies each by 0.15 and sums; in this
//     alpha they are additive and EQUAL-WEIGHT, so we report the mean membership
//     of the active factors as a 0–100 "response potential."
//   • 6 USE-INVARIANT site constraints (slope, flooding, ponding, karst, rock
//     fragments, surface stones). Biochar cannot change these; poor ones flag a
//     limitation. Karst and frequent flooding are HARD constraints.
//
// Interactivity supported:
//   • Factors are individually TOGGLEABLE (filter the interpretation's
//     components — pH response, rock fragments, slope, …).
//   • A "soil is artificially drained (tiled)" gate disables ponding /
//     depth-to-water-table inputs.
//
// DETERMINISTIC: no Math.random, no Date, no I/O. Nothing here is validated
// science — it exists so the product layer has something honest-feeling to show.
// =============================================================================

import type { SoilUnit, FloodingFrequency, PondingFrequency } from './soil-units';
import { CURRENT_RULESET } from './rulesets';

export type SuitabilityClass = 'well' | 'moderate' | 'poor';
export type FactorGroup = 'dynamic' | 'constraint';

export interface CriterionResult {
  key: string;
  label: string;
  group: FactorGroup;
  /** Current soil value, formatted for display (e.g. "5.9", "Occasional"). */
  valueText: string;
  /** Band this value falls in. */
  band: SuitabilityClass;
  /** 0–1 membership (dynamic factors only). */
  membership?: number;
  /** What the property affects (from the doc's "Impact" column). */
  impact: string;
  /** User-toggled on/off (off = excluded from the score). */
  active: boolean;
  /** Gated off by an upstream answer (e.g. ponding when the field is tiled). */
  disabled: boolean;
  disabledReason?: string;
}

export interface InterpretationResult {
  /** 0–100 mean membership of the active dynamic factors (response potential). */
  responseScore: number;
  /** Composed site verdict after constraints are applied. */
  verdict: SuitabilityClass;
  verdictLabel: string;
  /** True when a hard constraint (karst / frequent flooding) is present. */
  hardConstraint: boolean;
  criteria: CriterionResult[];
  /** Poorly-suited constraints, as plain-language warnings. */
  flags: string[];
  /** Moderately-suited constraints worth noting. */
  cautions: string[];
  narrative: string;
  rulesetLabel: string;
}

export interface InterpretationOptions {
  /** Criterion keys the user has switched OFF. */
  disabledKeys?: Iterable<string>;
  /** Field is artificially drained (tiled) → disables ponding. */
  tiled?: boolean;
}

const clamp = (v: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, v));

// -----------------------------------------------------------------------------
// Membership functions — piecewise-linear ramps between the doc's band edges.
// `lowGood`: small values = high improvement potential (membership 1 at/below
// `well`, 0 at/above `poor`). `highGood`: the reverse.
// -----------------------------------------------------------------------------

function rampLowGood(v: number, well: number, poor: number): number {
  if (v <= well) return 1;
  if (v >= poor) return 0;
  return (poor - v) / (poor - well);
}
function rampHighGood(v: number, well: number, poor: number): number {
  if (v >= well) return 1;
  if (v <= poor) return 0;
  return (v - poor) / (well - poor);
}

// -----------------------------------------------------------------------------
// DYNAMIC factor definitions (the 7 membership functions).
// `well`/`poor` are the doc's band edges; `dir` picks the ramp.
// =============================================================================
// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  TUNING DIAL — the membership model. USDA ARS owns these thresholds; they   ║
// ║  map 1:1 to the interpretation doc's criteria table and would live in       ║
// ║  versioned admin config, editable without a code change.                    ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

interface DynamicDef {
  key: string;
  label: string;
  unit: string;
  dir: 'lowGood' | 'highGood';
  well: number;
  poor: number;
  impact: string;
  get: (s: SoilUnit) => number;
}

const DYNAMIC_FACTORS: DynamicDef[] = [
  { key: 'ph', label: 'pH response', unit: '', dir: 'lowGood', well: 5.5, poor: 7.5,
    impact: 'Microbial & fungal activity, nutrient availability', get: (s) => s.ph },
  { key: 'cec', label: 'Cation exchange', unit: 'meq/cm³', dir: 'lowGood', well: 4, poor: 12,
    impact: 'Nutrient storage', get: (s) => s.cecMeqCm3 },
  { key: 'om', label: 'Organic matter', unit: '%', dir: 'lowGood', well: 2, poor: 10,
    impact: 'Physical & chemical resilience', get: (s) => s.omPct },
  { key: 'bulk-density', label: 'Bulk-density ratio', unit: '', dir: 'highGood', well: 0.4, poor: 0,
    impact: 'Compaction, root penetration, aeration', get: (s) => s.bulkDensityRatio },
  { key: 'lep', label: 'Linear extensibility', unit: '%', dir: 'lowGood', well: 4, poor: 12,
    impact: 'Vertical redistribution', get: (s) => s.lepMax },
  { key: 'ksat', label: 'Saturated conductivity', unit: 'µm/s', dir: 'highGood', well: 40, poor: 14,
    impact: 'Infiltration, gas exchange', get: (s) => s.ksatUmS },
  { key: 'awc', label: 'Available water capacity', unit: 'cm³/cm³', dir: 'lowGood', well: 0.02, poor: 0.2,
    impact: 'Plant-available water', get: (s) => s.awcInPerIn },
];

// -----------------------------------------------------------------------------
// USE-INVARIANT constraint definitions (the 6 site factors biochar can't fix).
// `classify` returns the band; `hard` marks groundwater/flood show-stoppers.
// -----------------------------------------------------------------------------

interface ConstraintDef {
  key: string;
  label: string;
  unit: string;
  impact: string;
  hard: boolean;
  /** Disabled when the field is tile-drained. */
  gatedByTile?: boolean;
  valueText: (s: SoilUnit) => string;
  classify: (s: SoilUnit) => SuitabilityClass;
}

const FLOOD_ORDER: FloodingFrequency[] = ['None', 'Very rare', 'Rare', 'Occasional', 'Frequent'];
const POND_ORDER: PondingFrequency[] = ['None', 'Very brief', 'Brief', 'Long', 'Very long'];

const CONSTRAINT_FACTORS: ConstraintDef[] = [
  { key: 'slope', label: 'Slope', unit: '%', impact: 'Runoff, erosion', hard: false,
    valueText: (s) => `${s.slopePct}%`,
    classify: (s) => (s.slopePct < 6 ? 'well' : s.slopePct <= 15 ? 'moderate' : 'poor') },
  { key: 'flooding', label: 'Flooding', unit: '', impact: 'Removal of sediments', hard: true,
    valueText: (s) => s.floodingFreq,
    classify: (s) => {
      const i = FLOOD_ORDER.indexOf(s.floodingFreq);
      return i <= 1 ? 'well' : i <= 3 ? 'moderate' : 'poor';
    } },
  { key: 'ponding', label: 'Ponding', unit: '', impact: 'Sediment transport', hard: false, gatedByTile: true,
    valueText: (s) => s.pondingFreq,
    classify: (s) => {
      const i = POND_ORDER.indexOf(s.pondingFreq);
      return i === 0 ? 'well' : i <= 2 ? 'moderate' : 'poor';
    } },
  { key: 'karst', label: 'Karst landform', unit: '', impact: 'Groundwater contamination', hard: true,
    valueText: (s) => (s.karst ? 'Karst' : 'Not karst'),
    classify: (s) => (s.karst ? 'poor' : 'well') },
  { key: 'rock-fragments', label: 'Rock fragments', unit: '%', impact: 'Dilution and workability', hard: false,
    valueText: (s) => `${s.rockFragPct}%`,
    classify: (s) => (s.rockFragPct < 2 ? 'well' : s.rockFragPct < 10 ? 'moderate' : 'poor') },
  { key: 'surface-stones', label: 'Surface stones', unit: '%', impact: 'Workability', hard: false,
    valueText: (s) => `${s.surfaceStonesPct}%`,
    classify: (s) => (s.surfaceStonesPct < 0.1 ? 'well' : s.surfaceStonesPct <= 3 ? 'moderate' : 'poor') },
];

// Class thresholds for the dynamic response score (0–100). Tunable dial.
const WELL_MIN = 60;
const MODERATE_MIN = 35;

function classFromScore(score: number): SuitabilityClass {
  if (score >= WELL_MIN) return 'well';
  if (score >= MODERATE_MIN) return 'moderate';
  return 'poor';
}

const CLASS_LABEL: Record<SuitabilityClass, string> = {
  well: 'Well suited',
  moderate: 'Moderately suited',
  poor: 'Poorly suited',
};
const CLASS_RANK: Record<SuitabilityClass, number> = { well: 2, moderate: 1, poor: 0 };
const RANK_CLASS: SuitabilityClass[] = ['poor', 'moderate', 'well'];

function fmt(v: number): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(2).replace(/0$/, '');
}

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

/**
 * Score a field's readiness to receive biochar. Deterministic. `options` carries
 * the user's factor toggles and the tile-drainage answer.
 */
export function interpretSite(soil: SoilUnit, options: InterpretationOptions = {}): InterpretationResult {
  const disabledKeys = new Set(options.disabledKeys ?? []);
  const tiled = options.tiled ?? false;

  const criteria: CriterionResult[] = [];

  // ── Dynamic factors ──
  const activeMemberships: number[] = [];
  for (const d of DYNAMIC_FACTORS) {
    const value = d.get(soil);
    const membership =
      d.dir === 'lowGood' ? rampLowGood(value, d.well, d.poor) : rampHighGood(value, d.well, d.poor);
    const band: SuitabilityClass = membership >= 0.66 ? 'well' : membership >= 0.33 ? 'moderate' : 'poor';
    const active = !disabledKeys.has(d.key);
    if (active) activeMemberships.push(membership);
    criteria.push({
      key: d.key,
      label: d.label,
      group: 'dynamic',
      valueText: `${fmt(value)}${d.unit ? ` ${d.unit}` : ''}`,
      band,
      membership,
      impact: d.impact,
      active,
      disabled: false,
    });
  }

  const responseScore = activeMemberships.length
    ? Math.round((activeMemberships.reduce((a, b) => a + b, 0) / activeMemberships.length) * 100)
    : 0;

  // ── Constraints ──
  const flags: string[] = [];
  const cautions: string[] = [];
  let hardConstraint = false;
  let worstActiveConstraint: SuitabilityClass = 'well';
  // Concise phrases for the narrative (cleaner than reusing the full flag string).
  let primaryLimit: string | null = null;
  let cautionPhrase: string | null = null;

  for (const c of CONSTRAINT_FACTORS) {
    const gated = c.gatedByTile === true && tiled;
    const band = c.classify(soil);
    const active = !disabledKeys.has(c.key) && !gated;
    criteria.push({
      key: c.key,
      label: c.label,
      group: 'constraint',
      valueText: c.valueText(soil),
      band,
      impact: c.impact,
      active,
      disabled: gated,
      disabledReason: gated ? 'Disabled — field is tile-drained' : undefined,
    });
    if (!active) continue;
    if (CLASS_RANK[band] < CLASS_RANK[worstActiveConstraint]) worstActiveConstraint = band;
    if (band === 'poor') {
      flags.push(`${c.label} (${c.valueText(soil)}) — ${c.impact.toLowerCase()}.`);
      const phrase = `${c.label.toLowerCase()} (${c.valueText(soil)})`;
      if (c.hard) {
        hardConstraint = true;
        primaryLimit = phrase; // a hard constraint always becomes the headline reason
      } else if (!primaryLimit) {
        primaryLimit = phrase;
      }
    } else if (band === 'moderate') {
      cautions.push(`${c.label} (${c.valueText(soil)}) — ${c.impact.toLowerCase()}.`);
      if (!cautionPhrase) cautionPhrase = `${c.label.toLowerCase()} (${c.valueText(soil)})`;
    }
  }

  // ── Compose the verdict: dynamic class, downgraded by constraints. A single
  //    poor (non-hard) constraint knocks it down one class; a hard constraint
  //    (karst / frequent flooding) caps the verdict at "poorly suited". ──
  let verdictRank = CLASS_RANK[classFromScore(responseScore)];
  if (worstActiveConstraint === 'poor') verdictRank -= 1;
  if (hardConstraint) verdictRank = Math.min(verdictRank, CLASS_RANK.poor);
  const verdict = RANK_CLASS[clamp(verdictRank, 0, 2)];

  const narrative = buildSiteNarrative(
    soil,
    responseScore,
    verdict,
    primaryLimit,
    cautionPhrase,
    hardConstraint,
  );

  return {
    responseScore,
    verdict,
    verdictLabel: CLASS_LABEL[verdict],
    hardConstraint,
    criteria,
    flags,
    cautions,
    narrative,
    rulesetLabel: CURRENT_RULESET.label,
  };
}

/** Pull the great-group tail off a taxonomic string for readable prose. */
function taxonName(soil: SoilUnit): string {
  const tail = soil.taxonomy.split(',').pop()?.trim() ?? soil.taxonomy;
  const regimes = ['frigid', 'mesic', 'thermic', 'cryic', 'isomesic'];
  const words = tail.split(/\s+/);
  return regimes.includes(words[0]?.toLowerCase()) ? words.slice(1).join(' ') : tail;
}

function buildSiteNarrative(
  soil: SoilUnit,
  score: number,
  verdict: SuitabilityClass,
  primaryLimit: string | null,
  cautionPhrase: string | null,
  hard: boolean,
): string {
  const series = soil.name.split(',')[0];
  const headroom =
    score >= 60
      ? 'strong headroom for biochar to improve its dynamic properties'
      : score >= 35
        ? 'moderate headroom for biochar to improve its dynamic properties'
        : 'little headroom — its dynamic properties are already strong';
  // When a use-invariant constraint pulls the verdict below the improvement
  // potential, lead with the constraint so the sentence doesn't contradict itself.
  const downgraded = CLASS_RANK[verdict] < CLASS_RANK[classFromScore(score)];
  if (primaryLimit && (hard || downgraded)) {
    const reg = hard ? "a hard site limit biochar can't fix" : "a site limit biochar can't fix";
    return `${series} has ${headroom}, but ${primaryLimit} is ${reg} — making it ${CLASS_LABEL[verdict].toLowerCase()} overall, whichever biochar is chosen.`;
  }
  let s = `${series} is ${CLASS_LABEL[verdict].toLowerCase()} to receive biochar — ${headroom}.`;
  if (primaryLimit) s += ` Note ${primaryLimit}, a site limit biochar can't fix.`;
  else if (cautionPhrase) s += ` One factor to watch: ${cautionPhrase}.`;
  else s += ' No use-invariant site constraints flagged.';
  return s;
}

/** The factor metadata, for building toggle UIs without running a full score. */
export const INTERPRETATION_FACTORS: { key: string; label: string; group: FactorGroup }[] = [
  ...DYNAMIC_FACTORS.map((d) => ({ key: d.key, label: d.label, group: 'dynamic' as const })),
  ...CONSTRAINT_FACTORS.map((c) => ({ key: c.key, label: c.label, group: 'constraint' as const })),
];
