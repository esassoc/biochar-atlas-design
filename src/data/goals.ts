// =============================================================================
// MOCK DATA — for prototyping only.
// The management goals a user selects before scoring. Each goal documents which
// SOIL properties make it relevant and which BIOCHAR properties deliver it;
// scoring.ts turns those drivers into weighted factors. Descriptions are
// written for a farmer or field planner, not a soil scientist.
// =============================================================================

export interface Goal {
  /** Stable id — referenced by scoring.ts GOAL_WEIGHTS and by saved scenarios. */
  id: string;
  /** Short display label. */
  label: string;
  /** One plain-language sentence a farmer would understand. */
  description: string;
  /** Soil properties that make this goal worth pursuing on a given field. */
  soilDrivers: string[];
  /** Biochar properties that actually deliver this goal. */
  biocharDrivers: string[];
}

export const goals: Goal[] = [
  {
    id: 'improve-water-retention',
    label: 'Improve water retention',
    description:
      'Help the soil hold more moisture between rains or irrigations so crops stay watered longer.',
    soilDrivers: ['low available water capacity', 'coarse texture', 'low organic matter'],
    biocharDrivers: ['high surface area', 'high porosity (low bulk density)', 'cation-exchange capacity'],
  },
  {
    id: 'increase-soil-organic-matter',
    label: 'Increase soil organic matter',
    description:
      'Build up the dark, carbon-rich fraction of the soil that improves structure and fertility.',
    soilDrivers: ['low organic matter', 'degraded or tilled ground'],
    biocharDrivers: ['high fixed carbon', 'stable (low H:C) carbon', 'high surface area'],
  },
  {
    id: 'carbon-sequestration',
    label: 'Carbon sequestration',
    description:
      'Lock carbon into the soil in a stable form that resists breakdown for decades to centuries.',
    soilDrivers: ['low organic matter', 'aerobic mineral soil'],
    biocharDrivers: ['stable (low H:C) carbon', 'high fixed carbon', 'low ash'],
  },
  {
    id: 'reduce-nutrient-leaching',
    label: 'Reduce nutrient leaching',
    description:
      'Keep applied nitrogen and other nutrients in the root zone instead of washing below it.',
    soilDrivers: ['low cation-exchange capacity', 'coarse texture', 'high rainfall or irrigation'],
    biocharDrivers: ['high cation-exchange capacity', 'high surface area', 'high fixed carbon'],
  },
  {
    id: 'raise-soil-ph',
    label: 'Raise soil pH',
    description:
      'Reduce acidity so nutrients become more available and crop roots grow better.',
    soilDrivers: ['acidic pH', 'aluminum toxicity risk'],
    biocharDrivers: ['high liming value (CaCO3 equivalent)', 'alkaline pH'],
  },
  {
    id: 'improve-nutrient-retention',
    label: 'Improve nutrient retention',
    description:
      'Increase the soil’s ability to hold onto nutrients so fertilizer goes further.',
    soilDrivers: ['low cation-exchange capacity', 'low organic matter'],
    biocharDrivers: ['high cation-exchange capacity', 'high surface area', 'nutrient-rich ash'],
  },
  {
    id: 'relieve-compaction',
    label: 'Relieve compaction',
    description:
      'Loosen dense soil so water, air, and roots can move through it more easily.',
    soilDrivers: ['high clay content', 'high bulk density', 'restricted drainage'],
    biocharDrivers: ['high porosity (low bulk density)', 'high surface area', 'durable carbon structure'],
  },
  {
    id: 'support-soil-biology',
    label: 'Support soil biology',
    description:
      'Give soil microbes and fungi the pore space and habitat they need to thrive.',
    soilDrivers: ['low organic matter', 'low microbial activity'],
    biocharDrivers: ['high surface area', 'cation-exchange capacity', 'stable carbon', 'favorable pH'],
  },
];

/** Lookup helper — returns undefined if the id is unknown. */
export function getGoal(id: string): Goal | undefined {
  return goals.find((g) => g.id === id);
}
