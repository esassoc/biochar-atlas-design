// =============================================================================
// MOCK DATA — for prototyping only.
// Application-rate, co-application, and economics scenario data for the
// scenario-comparison workflow. The effect multipliers, costs, and especially
// the NRCS payment figures are INVENTED placeholders chosen to look plausible —
// none are quoted from a real rate schedule. See the loud warning above the
// NRCS block before reusing any number here.
// =============================================================================

import type { FeedstockClass } from './biochar-catalog';

// -----------------------------------------------------------------------------
// Application rate (tons/acre)
// -----------------------------------------------------------------------------

/** The three demo application rates, in tons per acre. */
export const applicationRates = [5, 10, 20] as const;

export type ApplicationRate = (typeof applicationRates)[number];

export interface ApplicationRateScenario {
  tonsPerAcre: ApplicationRate;
  label: string;
  /**
   * Mock multiplier applied to a biochar's per-goal effect at this rate,
   * relative to the 10 t/ac baseline (1.0). Sub-linear at the high end to
   * reflect diminishing returns — doubling the rate does not double the benefit.
   */
  effectMultiplier: number;
  /** One plain-language sentence on what this rate buys and costs. */
  note: string;
}

export const applicationRateScenarios: ApplicationRateScenario[] = [
  {
    tonsPerAcre: 5,
    label: '5 tons/acre',
    effectMultiplier: 0.65,
    note: 'A light, budget-friendly rate that still measurably lifts water-holding and biology, with the lowest material cost and easiest incorporation.',
  },
  {
    tonsPerAcre: 10,
    label: '10 tons/acre',
    effectMultiplier: 1.0,
    note: 'The pilot baseline rate — the best balance of soil benefit against material and spreading cost for most Willamette Valley fields.',
  },
  {
    tonsPerAcre: 20,
    label: '20 tons/acre',
    effectMultiplier: 1.3,
    note: 'A heavy single application for carbon-focused or badly degraded ground; benefit per ton tapers off and cost roughly doubles.',
  },
];

// -----------------------------------------------------------------------------
// Co-application (compost)
// -----------------------------------------------------------------------------

export interface CoApplicationOption {
  id: string;
  label: string;
  description: string;
  /** How co-applying changes the biochar's behavior in the soil (mock note). */
  interactionNote: string;
}

/** The compost co-application toggle offered alongside rate. */
export const compostCoApplication: CoApplicationOption = {
  id: 'compost-co-application',
  label: 'Co-apply with compost',
  description:
    'Blend the biochar into mature compost for two to four weeks before spreading, so it goes on the field pre-charged rather than raw.',
  interactionNote:
    'Pre-charging loads the char’s pores and exchange sites with nutrients and microbes, so the nutrient-retention and soil-biology benefits show up in the first season instead of after a year of field weathering.',
};

/** Full option set for the UI — a raw baseline plus the compost blend. */
export const coApplicationOptions: CoApplicationOption[] = [
  {
    id: 'biochar-only',
    label: 'Biochar only',
    description: 'Apply the biochar on its own and let it weather and charge in place.',
    interactionNote:
      'A raw, freshly pyrolyzed char can briefly tie up some nitrogen as it equilibrates; benefits build over the first one to two seasons.',
  },
  compostCoApplication,
];

// -----------------------------------------------------------------------------
// Economics (all figures MOCK)
// -----------------------------------------------------------------------------

/**
 * Delivered material cost (USD per ton) by feedstock class. Placeholder values
 * in a believable $180–$620 band: cheap, abundant residues at the low end,
 * dense premium nutshell char at the top.
 */
export const biocharCostPerTon: Record<FeedstockClass, number> = {
  'Crop residue': 180,
  Manure: 210,
  Grass: 240,
  Softwood: 300,
  Hardwood: 380,
  'Nut shell': 620,
};

/** Mock spreading + light-incorporation cost, USD per acre, rate-independent. */
export const spreadingCostPerAcre = 45;

export interface NrcsPaymentScenario {
  /** NRCS program the payment flows through. */
  program: string;
  /** Conservation Practice Standard. */
  practice: string;
  /** Short scenario name (which payment tier / land class). */
  scenarioName: string;
  /** Placeholder payment, USD per acre. */
  paymentPerAcre: number;
  note: string;
}

// !!! ====================================================================== !!!
// !!! MOCK NRCS PAYMENTS — PLACEHOLDERS ONLY. Real CPS 336 (Soil Carbon      !!!
// !!! Amendment) payment rates vary by state, fund pool, land class, and     !!!
// !!! program year, and are set in the NRCS payment schedule — NOT here.     !!!
// !!! Do not quote, budget against, or display these as actual rates.        !!!
// !!! ====================================================================== !!!
export const nrcsPaymentScenarios: NrcsPaymentScenario[] = [
  {
    program: 'EQIP',
    practice: 'CPS 336 Soil Carbon Amendment',
    scenarioName: 'Base rate',
    paymentPerAcre: 165,
    note: 'Illustrative base cost-share for a single biochar application — placeholder, not a published rate.',
  },
  {
    program: 'EQIP',
    practice: 'CPS 336 Soil Carbon Amendment',
    scenarioName: 'Historically underserved producer',
    paymentPerAcre: 248,
    note: 'Illustrative elevated rate for beginning, limited-resource, socially disadvantaged, or veteran producers — placeholder figure.',
  },
  {
    program: 'CSP',
    practice: 'CPS 336 Soil Carbon Amendment',
    scenarioName: 'Enhancement payment',
    paymentPerAcre: 92,
    note: 'Illustrative annual enhancement payment under the Conservation Stewardship Program — placeholder figure.',
  },
];

// -----------------------------------------------------------------------------
// Convenience estimator (mock arithmetic — handy for the scenario screen)
// -----------------------------------------------------------------------------

export interface CostEstimate {
  materialCost: number;
  spreadingCost: number;
  grossCost: number;
  nrcsPayment: number;
  netCost: number;
}

/**
 * Rough per-acre cost estimate for a feedstock class at a given rate, before
 * and after an optional NRCS payment. Pure arithmetic on the mock figures above.
 */
export function estimateCostPerAcre(
  feedstockClass: FeedstockClass,
  tonsPerAcre: ApplicationRate,
  nrcsPaymentPerAcre = 0,
): CostEstimate {
  const materialCost = biocharCostPerTon[feedstockClass] * tonsPerAcre;
  const grossCost = materialCost + spreadingCostPerAcre;
  return {
    materialCost,
    spreadingCost: spreadingCostPerAcre,
    grossCost,
    nrcsPayment: nrcsPaymentPerAcre,
    netCost: grossCost - nrcsPaymentPerAcre,
  };
}
