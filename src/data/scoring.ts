// =============================================================================
// MOCK SCORING ENGINE — for prototyping only.
// This is a *plausible, deterministic, explainable* stand-in for the real
// suitability algorithms (which will come from USDA ARS). It produces stable
// 0–100 scores and plain-language rationale from the mock biochar, soil, and
// goal data. NOTHING here is validated science — it exists so the product
// layer (maps, scorecards, reports) has something honest-feeling to render.
//
// Design contract:
//   - Fully DETERMINISTIC: no Math.random, no Date, no I/O. Same inputs in,
//     same scores out, on every demo run.
//   - Every biochar factor is normalized to 0–1 against the catalog's realistic
//     range (see FACTOR_RANGES), then blended per goal via GOAL_WEIGHTS and
//     nudged by soil context. The narrative is generated from the *same*
//     arithmetic, so the words always match the number.
//   - Calibrated so that, on the default scenario (Willamette silt loam +
//     water-retention / SOM / carbon-sequestration), Douglas-fir slash 550°C
//     totals 78 and Mixed hardwood 650°C totals 64 — the calibration anchors.
// =============================================================================

import type { Biochar } from './biochar-catalog';
import { biocharCatalog, getBiochar } from './biochar-catalog';
import type { SoilUnit } from './soil-units';
import { getSoilUnit } from './soil-units';
import { CURRENT_RULESET } from './rulesets';

export { CURRENT_RULESET };

/** The three goals scored by default. */
export const DEFAULT_GOAL_IDS = [
  'improve-water-retention',
  'increase-soil-organic-matter',
  'carbon-sequestration',
] as const;

// -----------------------------------------------------------------------------
// Application options (rate + compost co-application) — a Q8 mock modifier.
//
// These are NOT validated agronomy; they give the demo plausible directionality:
// a rate far from the agronomic baseline gently lowers overall fit, and compost
// co-application nudges the goals it actually helps (SOM, soil biology, nutrient
// retention). The defaults are the NEUTRAL baseline — at BASELINE_RATE with
// compost off the modifier is identity (×1.0 / +0), so the calibration anchors
// (78/64) and every existing score are untouched. Change a dial here, not the
// per-call math.
// -----------------------------------------------------------------------------

export interface AppOptions {
  /** Biochar application rate, tons/acre. */
  rateTonsPerAcre: number;
  /** Whether compost is co-applied with the biochar. */
  compost: boolean;
}

/** The neutral baseline: defaults that reproduce today's scores exactly. */
export const BASELINE_RATE_TONS_PER_ACRE = 5;
export const DEFAULT_APP_OPTIONS: AppOptions = {
  rateTonsPerAcre: BASELINE_RATE_TONS_PER_ACRE,
  compost: false,
};

/** Plausible rate band for the UI (deterministic; tons/acre). */
export const RATE_MIN_TONS_PER_ACRE = 1;
export const RATE_MAX_TONS_PER_ACRE = 20;

// Modifier dials.
const K_RATE = 0.15; // how hard an off-baseline rate trims fit
const RATE_FIT_FLOOR = 0.7; // a far-off rate never zeroes the score
const COMPOST_BONUS = 0.06; // per-goal 0–1 nudge for compost-helped goals
/** Goals compost co-application meaningfully helps. */
const COMPOST_GOALS = new Set<string>([
  'increase-soil-organic-matter',
  'support-soil-biology',
  'improve-nutrient-retention',
  'reduce-nutrient-leaching',
]);

// -----------------------------------------------------------------------------
// Result shape
// -----------------------------------------------------------------------------

export interface GoalScore {
  goalId: string;
  /** 0–100, calibrated and rounded. */
  score: number;
  /** One plain-language sentence explaining this goal's score. */
  rationale: string;
}

export interface SuitabilityResult {
  /** Headline suitability, 0–100 integer. */
  total: number;
  perGoal: GoalScore[];
  narrative: string;
  /** A bare result never carries `recommended` — that flag lives on the
   *  comparison wrapper (see compareBiochars). Declared `never` so it can't be
   *  set on a single result by mistake. */
  recommended?: never;
}

export interface BiocharComparison {
  biochar: Biochar;
  result: SuitabilityResult;
  /** True for the single top-ranked biochar in a comparison. */
  recommended: boolean;
}

// -----------------------------------------------------------------------------
// Normalization
// -----------------------------------------------------------------------------

const clamp = (v: number, lo: number, hi: number): number =>
  Math.max(lo, Math.min(hi, v));

/** Min–max normalize into 0–1, clamped. */
const norm = (v: number, lo: number, hi: number): number =>
  clamp((v - lo) / (hi - lo), 0, 1);

/**
 * Realistic [min, max] ranges for each raw biochar property across the catalog.
 * Normalization is done against THESE, not the live data, so the scale stays
 * stable if the catalog grows.
 */
const FACTOR_RANGES = {
  fixedCarbonPct: [35, 80],
  ashPct: [3, 40],
  ph: [7.0, 10.5],
  cecCmolKg: [10, 35],
  surfaceAreaM2g: [60, 450],
  hcRatio: [0.3, 0.6], // inverted into a stability factor (lower H:C = better)
  limingPctCaCO3eq: [3, 25],
  bulkDensityGcm3: [0.2, 0.5], // inverted into a porosity factor (lower = better)
} as const;

type FactorKey =
  | 'porosity'
  | 'surface'
  | 'fixedC'
  | 'stability'
  | 'cec'
  | 'liming'
  | 'ash'
  | 'lowAsh'
  | 'phHi';

type Factors = Record<FactorKey, number>;

/** Convert a biochar's raw properties into normalized 0–1 scoring factors. */
function biocharFactors(b: Biochar): Factors {
  const surface = norm(b.surfaceAreaM2g, ...FACTOR_RANGES.surfaceAreaM2g);
  const ash = norm(b.ashPct, ...FACTOR_RANGES.ashPct);
  return {
    surface,
    ash,
    lowAsh: 1 - ash,
    fixedC: norm(b.fixedCarbonPct, ...FACTOR_RANGES.fixedCarbonPct),
    stability: 1 - norm(b.hcRatio, ...FACTOR_RANGES.hcRatio),
    cec: norm(b.cecCmolKg, ...FACTOR_RANGES.cecCmolKg),
    liming: norm(b.limingPctCaCO3eq, ...FACTOR_RANGES.limingPctCaCO3eq),
    porosity: 1 - norm(b.bulkDensityGcm3, ...FACTOR_RANGES.bulkDensityGcm3),
    phHi: norm(b.ph, ...FACTOR_RANGES.ph),
  };
}

interface SoilContext {
  /** 1 = very low organic matter (lots of headroom for SOM/carbon goals). */
  lowOM: number;
  /** 1 = strongly acidic (big liming opportunity). */
  acidity: number;
  /** 1 = very low CEC (big nutrient-retention opportunity). */
  lowCEC: number;
  /** 1 = high clay (compaction-prone). */
  clay: number;
  /** 1 = coarse texture (water-retention benefit is larger). */
  coarse: number;
}

/** Convert a soil unit into normalized 0–1 context modifiers. */
function soilContext(s: SoilUnit): SoilContext {
  const clay = norm(s.clayPct, 5, 45);
  return {
    clay,
    coarse: 1 - clay,
    lowOM: 1 - norm(s.omPct, 1.0, 6.0),
    acidity: 1 - norm(s.ph, 4.5, 7.5),
    lowCEC: 1 - norm(s.cecCmolKg, 8, 30),
  };
}

// =============================================================================
// ╔═════════════════════════════════════════════════════════════════════════╗
// ║  TUNING DIAL — domain judgment lives here                                 ║
// ║                                                                           ║
// ║  Everything below is the part a soil scientist / designer is meant to     ║
// ║  tune. GOAL_WEIGHTS blends normalized biochar factors per goal (weights   ║
// ║  sum to ~1.0). The soil-context block then nudges each goal up or down    ║
// ║  based on the field, and the pH-fit block penalizes chars that are too    ║
// ║  alkaline for the soil they're going on. Calibration constants are        ║
// ║  derived from these at module load (see CALIBRATION below) — change a     ║
// ║  weight and the anchors recompute automatically.                          ║
// ╚═════════════════════════════════════════════════════════════════════════╝
// =============================================================================

/**
 * Per-goal weighted blend of biochar factors. Each goal's weights sum to ~1.0,
 * so the base goal score is itself 0–1 before soil context and pH fit apply.
 */
const GOAL_WEIGHTS: Record<string, Partial<Record<FactorKey, number>>> = {
  // Water held in pores: porosity + surface area lead; CEC and low ash help a bit.
  'improve-water-retention': { porosity: 0.4, surface: 0.35, cec: 0.15, lowAsh: 0.1 },
  // Building SOM: carbon you add (fixed C), how long it lasts (stability), habitat (surface).
  'increase-soil-organic-matter': { fixedC: 0.4, surface: 0.3, stability: 0.3 },
  // Locking carbon away: permanence (low H:C) dominates, then mass of fixed C, then low ash.
  'carbon-sequestration': { stability: 0.5, fixedC: 0.35, lowAsh: 0.15 },
  // Holding nutrients in the root zone against leaching.
  'reduce-nutrient-leaching': { cec: 0.5, surface: 0.3, fixedC: 0.2 },
  // Raising pH: liming value + alkaline pH are the whole story.
  'raise-soil-ph': { liming: 0.65, phHi: 0.35 },
  // Nutrient retention: CEC + surface + the mineral nutrients carried in ash.
  'improve-nutrient-retention': { cec: 0.5, surface: 0.25, ash: 0.25 },
  // Relieving compaction: porosity leads, durable structure helps.
  'relieve-compaction': { porosity: 0.55, surface: 0.25, fixedC: 0.2 },
  // Microbial habitat: pore surface + nutrient holding + stable carbon + workable pH.
  'support-soil-biology': { surface: 0.4, cec: 0.25, stability: 0.2, phHi: 0.15 },
};

/**
 * Additive soil-context modifier per goal (applied to the base blend before the
 * pH-fit multiplier). Small magnitudes — they bend the score toward the field's
 * needs without overriding the biochar's own merit. Coefficients are the dials.
 */
function soilModifier(goalId: string, sc: SoilContext): number {
  switch (goalId) {
    // Coarse soils gain more from added water-holding capacity.
    case 'improve-water-retention':
      return 0.1 * (sc.coarse - 0.5);
    // Low-OM soils amplify the benefit of an organic-matter / carbon amendment.
    case 'increase-soil-organic-matter':
      return 0.18 * sc.lowOM;
    case 'carbon-sequestration':
      return 0.06 * sc.lowOM;
    // Low-CEC soils gain the most nutrient-holding benefit.
    case 'reduce-nutrient-leaching':
    case 'improve-nutrient-retention':
      return 0.15 * sc.lowCEC;
    // Clay-rich soils are the ones that need de-compacting.
    case 'relieve-compaction':
      return 0.15 * sc.clay;
    case 'support-soil-biology':
      return 0.08 * sc.lowOM;
    default:
      return 0;
  }
}

// pH-fit dials. An acidic soil can absorb a more alkaline char (it needs the
// lime); a near-neutral soil is harmed by an over-alkaline one (micronutrient
// lock-out, over-liming). K_OVERSHOOT sets how hard we punish overshoot;
// FIT_FLOOR keeps even a badly-matched char from going to zero on these goals.
const K_OVERSHOOT = 0.3;
const FIT_FLOOR = 0.4;

/**
 * 0–1 multiplier applied to every NON-pH goal. 1.0 when the char's pH is at or
 * below what the soil can comfortably take; falls off as pH overshoots.
 */
function phFit(b: Biochar, s: SoilUnit): number {
  const targetMaxPh = 8.0 + 0.5 * clamp(7.0 - s.ph, 0, 3);
  const overshoot = Math.max(0, b.ph - targetMaxPh);
  return clamp(1 - K_OVERSHOOT * overshoot, FIT_FLOOR, 1);
}

/**
 * The raise-soil-pH goal is only valuable on acidic soils. On a near-neutral or
 * alkaline soil the goal is largely moot (and over-liming is a risk), so we
 * scale the base score down. Acidic soil → full credit; neutral → ~0.25×.
 */
function phGoalFit(sc: SoilContext): number {
  return 0.25 + 0.75 * sc.acidity;
}

// =============================================================================
// End TUNING DIAL. Below is mechanical: apply the dials, calibrate, narrate.
// =============================================================================

/** Weighted contribution of each factor to a goal's base score (weight × value). */
function goalContributions(goalId: string, f: Factors): Partial<Record<FactorKey, number>> {
  const weights = GOAL_WEIGHTS[goalId] ?? {};
  const out: Partial<Record<FactorKey, number>> = {};
  for (const key of Object.keys(weights) as FactorKey[]) {
    out[key] = (weights[key] ?? 0) * f[key];
  }
  return out;
}

/**
 * Overall 0–1 fit multiplier for the application rate. 1.0 at the baseline rate;
 * falls off (floored) as the rate departs from it in either direction. Applied
 * uniformly to every goal, so the per-goal scores and the mean shift together.
 */
function rateFit(rateTonsPerAcre: number): number {
  const deviation = Math.abs(rateTonsPerAcre - BASELINE_RATE_TONS_PER_ACRE) / BASELINE_RATE_TONS_PER_ACRE;
  return clamp(1 - K_RATE * deviation, RATE_FIT_FLOOR, 1);
}

/** Additive 0–1 compost nudge for the goals it helps; 0 otherwise (and when off). */
function compostBonus(goalId: string, compost: boolean): number {
  return compost && COMPOST_GOALS.has(goalId) ? COMPOST_BONUS : 0;
}

/** Final 0–1 score for one goal, with soil context, pH fit, and app options applied.
 *  At DEFAULT_APP_OPTIONS (baseline rate, compost off) the app modifier is identity. */
function goalScore01(
  goalId: string,
  b: Biochar,
  s: SoilUnit,
  app: AppOptions = DEFAULT_APP_OPTIONS,
): number {
  const f = biocharFactors(b);
  const sc = soilContext(s);
  const contributions = goalContributions(goalId, f);
  let base = 0;
  for (const v of Object.values(contributions)) base += v ?? 0;

  const fit = rateFit(app.rateTonsPerAcre);
  const bonus = compostBonus(goalId, app.compost);
  if (goalId === 'raise-soil-ph') {
    return clamp((base + bonus) * phGoalFit(sc) * fit, 0, 1);
  }
  const withSoil = base + soilModifier(goalId, sc) + bonus;
  return clamp(withSoil * phFit(b, s) * fit, 0, 1);
}

function meanScore01(
  b: Biochar,
  s: SoilUnit,
  goalIds: readonly string[],
  app: AppOptions = DEFAULT_APP_OPTIONS,
): number {
  const ids = goalIds.length ? goalIds : DEFAULT_GOAL_IDS;
  const sum = ids.reduce((acc, g) => acc + goalScore01(g, b, s, app), 0);
  return sum / ids.length;
}

// -----------------------------------------------------------------------------
// CALIBRATION — solved from the two calibration anchors at module load.
//
// We run the *raw* model (mean of goal scores, 0–1) on the two anchor biochars
// for the default scenario, then solve a linear map  score = A·mean + B  so the
// anchors land on exactly 78 and 64. Because it's derived from the dials above,
// re-tuning a weight automatically re-pins the anchors. (If a future tweak ever
// made Douglas-fir ≤ Mixed hardwood, A would blow up — that's the guard rail
// telling you the dials no longer agree with the calibration anchors.)
// -----------------------------------------------------------------------------

interface AnchorSpec {
  biocharId: string;
  target: number;
}
const ANCHOR_SOIL_MUKEY = '46801'; // Willamette silt loam
const CALIBRATION_ANCHORS: AnchorSpec[] = [
  { biocharId: 'douglas-fir-slash-550', target: 78 },
  { biocharId: 'mixed-hardwood-650', target: 64 },
];

const CALIBRATION = (() => {
  const soil = getSoilUnit(ANCHOR_SOIL_MUKEY);
  const a = getBiochar(CALIBRATION_ANCHORS[0].biocharId);
  const b = getBiochar(CALIBRATION_ANCHORS[1].biocharId);
  // Fallback identity map if anchors are somehow missing (keeps the app alive).
  if (!soil || !a || !b) return { A: 100, B: 0 };
  const meanA = meanScore01(a, soil, DEFAULT_GOAL_IDS);
  const meanB = meanScore01(b, soil, DEFAULT_GOAL_IDS);
  const A = (CALIBRATION_ANCHORS[0].target - CALIBRATION_ANCHORS[1].target) / (meanA - meanB);
  const B = CALIBRATION_ANCHORS[0].target - A * meanA;
  return { A, B };
})();

/** Map a 0–1 score through the calibration into a 0–100 integer. */
function toDisplay(score01: number): number {
  return clamp(Math.round(CALIBRATION.A * score01 + CALIBRATION.B), 0, 100);
}

// -----------------------------------------------------------------------------
// Narrative — built from the same arithmetic that makes the number.
// -----------------------------------------------------------------------------

const FACTOR_PHRASE: Record<FactorKey, string> = {
  porosity: 'high porosity',
  surface: 'large surface area',
  fixedC: 'high fixed-carbon content',
  stability: 'stable, low-H:C carbon',
  cec: 'strong cation exchange',
  liming: 'high liming value',
  ash: 'nutrient-rich ash',
  lowAsh: 'carbon-dense, low-ash makeup',
  phHi: 'alkaline pH',
};

const GOAL_PHRASE: Record<string, string> = {
  'improve-water-retention': 'water retention',
  'increase-soil-organic-matter': 'organic-matter building',
  'carbon-sequestration': 'carbon sequestration',
  'reduce-nutrient-leaching': 'reduced nutrient leaching',
  'raise-soil-ph': 'raising soil pH',
  'improve-nutrient-retention': 'nutrient retention',
  'relieve-compaction': 'relieving compaction',
  'support-soil-biology': 'soil-biology support',
};

/** Pull the great-group / subgroup tail off a taxonomic string, e.g.
 *  'fine-silty, …, mesic Pachic Ultic Argixerolls' → 'Pachic Ultic Argixerolls'. */
function soilTaxonName(soil: SoilUnit): string {
  const tail = soil.taxonomy.split(',').pop()?.trim() ?? soil.taxonomy;
  const regimes = ['frigid', 'mesic', 'thermic', 'cryic', 'isomesic'];
  const words = tail.split(/\s+/);
  return regimes.includes(words[0]?.toLowerCase()) ? words.slice(1).join(' ') : tail;
}

function scoreTier(total: number): string {
  if (total >= 75) return 'a strong';
  if (total >= 60) return 'a solid';
  if (total >= 45) return 'a limited';
  return 'a poor';
}

/** Aggregate weighted factor contributions across the selected goals. */
function aggregateContributions(
  b: Biochar,
  goalIds: readonly string[],
): Partial<Record<FactorKey, number>> {
  const f = biocharFactors(b);
  const agg: Partial<Record<FactorKey, number>> = {};
  for (const g of goalIds) {
    const c = goalContributions(g, f);
    for (const key of Object.keys(c) as FactorKey[]) {
      agg[key] = (agg[key] ?? 0) + (c[key] ?? 0);
    }
  }
  return agg;
}

function topFactorKeys(
  agg: Partial<Record<FactorKey, number>>,
  count: number,
): FactorKey[] {
  return (Object.keys(agg) as FactorKey[])
    .sort((a, b) => (agg[b] ?? 0) - (agg[a] ?? 0))
    .slice(0, count);
}

function topGoalsByScore(
  b: Biochar,
  s: SoilUnit,
  goalIds: readonly string[],
  count: number,
): string[] {
  return [...goalIds]
    .sort((g1, g2) => goalScore01(g2, b, s) - goalScore01(g1, b, s))
    .slice(0, count);
}

function joinPhrases(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

/** Single-biochar narrative. */
function buildNarrative(b: Biochar, s: SoilUnit, total: number, goalIds: readonly string[]): string {
  const agg = aggregateContributions(b, goalIds);
  const factors = topFactorKeys(agg, 2).map((k) => FACTOR_PHRASE[k]);
  const goalPhrases = topGoalsByScore(b, s, goalIds, 2).map((g) => GOAL_PHRASE[g] ?? g);
  const taxon = soilTaxonName(s);
  const fit = phFit(b, s);
  let phClause = '';
  if (fit >= 0.999) {
    phClause = ` Its pH sits comfortably within what this soil can take.`;
  } else if (fit <= 0.7) {
    phClause = ` Its alkaline pH overshoots what this near-neutral soil needs, which holds the score back.`;
  } else {
    phClause = ` Its pH runs a little high for this soil, trimming the score slightly.`;
  }
  return (
    `${b.name} is ${scoreTier(total)} match for this field — its ${joinPhrases(factors)} ` +
    `line up with the ${taxon} profile, working hardest toward your ${joinPhrases(goalPhrases)} goals.` +
    phClause
  );
}

/** Comparative narrative for the recommended (top-ranked) biochar. */
function buildComparativeNarrative(
  top: Biochar,
  runnerUp: Biochar | undefined,
  s: SoilUnit,
  goalIds: readonly string[],
): string {
  const taxon = soilTaxonName(s);
  const goalPhrases = topGoalsByScore(top, s, goalIds, 2).map((g) => GOAL_PHRASE[g] ?? g);
  if (!runnerUp) {
    const agg = aggregateContributions(top, goalIds);
    const factors = topFactorKeys(agg, 2).map((k) => FACTOR_PHRASE[k]);
    return (
      `${top.name} is the best match for this field: its ${joinPhrases(factors)} align with the ` +
      `${taxon} profile, weighted toward your ${joinPhrases(goalPhrases)} goals.`
    );
  }
  // The factor where the winner most out-contributes the runner-up.
  const aggTop = aggregateContributions(top, goalIds);
  const aggRun = aggregateContributions(runnerUp, goalIds);
  const keys = new Set<FactorKey>([
    ...(Object.keys(aggTop) as FactorKey[]),
    ...(Object.keys(aggRun) as FactorKey[]),
  ]);
  let bestKey: FactorKey | null = null;
  let bestDelta = -Infinity;
  for (const k of keys) {
    const delta = (aggTop[k] ?? 0) - (aggRun[k] ?? 0);
    if (delta > bestDelta) {
      bestDelta = delta;
      bestKey = k;
    }
  }
  const edgeFactor = bestKey ? FACTOR_PHRASE[bestKey] : 'overall profile';
  // pH advantage: the winner is less alkaline / better-fitting for this soil.
  const phEdge =
    phFit(top, s) > phFit(runnerUp, s) + 0.001
      ? ` and a milder pH that better fits the ${taxon} profile`
      : '';
  return (
    `${top.name} is the better match for this field: its ${edgeFactor}${phEdge} ` +
    `edges out ${runnerUp.name}, weighted toward your ${joinPhrases(goalPhrases)} goals.`
  );
}

function goalRationale(goalId: string, b: Biochar, s: SoilUnit, score: number): string {
  const f = biocharFactors(b);
  const lead = topFactorKeys(goalContributions(goalId, f), 1)[0];
  const leadPhrase = lead ? FACTOR_PHRASE[lead] : 'overall properties';
  const goalPhrase = GOAL_PHRASE[goalId] ?? goalId;
  if (goalId === 'raise-soil-ph' && s.ph >= 6.5) {
    return `Scores ${score}/100 for ${goalPhrase}: this soil is already near neutral, so its ${leadPhrase} adds little here.`;
  }
  if (score >= 70) {
    return `Scores ${score}/100 for ${goalPhrase}, driven by its ${leadPhrase}.`;
  }
  if (score >= 45) {
    return `Scores ${score}/100 for ${goalPhrase} — its ${leadPhrase} helps, but it isn't this char's strong suit.`;
  }
  return `Scores ${score}/100 for ${goalPhrase}: weak on this goal given its ${leadPhrase}.`;
}

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

/**
 * Score how well one biochar suits one field's soil for the selected goals.
 * Deterministic: same arguments always yield the same result.
 */
export function evaluateSuitability(
  soil: SoilUnit,
  biochar: Biochar,
  goalIds: string[],
  app: AppOptions = DEFAULT_APP_OPTIONS,
): SuitabilityResult {
  const ids = goalIds.length ? goalIds : [...DEFAULT_GOAL_IDS];
  const perGoal: GoalScore[] = ids.map((goalId) => {
    const score = toDisplay(goalScore01(goalId, biochar, soil, app));
    return { goalId, score, rationale: goalRationale(goalId, biochar, soil, score) };
  });
  const total = clamp(Math.round(CALIBRATION.A * meanScore01(biochar, soil, ids, app) + CALIBRATION.B), 0, 100);
  const narrative = buildNarrative(biochar, soil, total, ids);
  return { total, perGoal, narrative };
}

/**
 * Score several biochars against the same field + goals, sorted best-first,
 * with the single top result flagged `recommended` and given a comparative
 * narrative referencing the runner-up.
 */
export function compareBiochars(
  soil: SoilUnit,
  biochars: Biochar[],
  goalIds: string[],
  apps: AppOptions[] = [],
): BiocharComparison[] {
  const ids = goalIds.length ? goalIds : [...DEFAULT_GOAL_IDS];
  // Per-biochar application options (apps[i] pairs with biochars[i]); each
  // defaults to the neutral baseline, so omitting apps reproduces today's scores.
  const appFor = (i: number): AppOptions => apps[i] ?? DEFAULT_APP_OPTIONS;
  const ranked = biochars
    .map((biochar, i) => ({
      biochar,
      result: evaluateSuitability(soil, biochar, ids, appFor(i)),
      // Unrounded mean kept for deterministic tie-breaking.
      raw: meanScore01(biochar, soil, ids, appFor(i)),
    }))
    .sort((a, b) => b.raw - a.raw || a.biochar.id.localeCompare(b.biochar.id));

  return ranked.map((entry, i) => {
    const recommended = i === 0;
    if (recommended) {
      entry.result.narrative = buildComparativeNarrative(
        entry.biochar,
        ranked[1]?.biochar,
        soil,
        ids,
      );
    }
    return { biochar: entry.biochar, result: entry.result, recommended };
  });
}

/** Convenience: compare the whole catalog for a field on the default goals. */
export function compareDefault(soil: SoilUnit): BiocharComparison[] {
  return compareBiochars(soil, biocharCatalog, [...DEFAULT_GOAL_IDS]);
}
