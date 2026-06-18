// =============================================================================
// MOCK DATA — for prototyping only.
// Versioned scoring rulesets. Every assessment is stamped with the ruleset that
// produced it, so results stay reproducible as the science evolves. The real
// algorithms come from USDA ARS; these are placeholders with invented version
// history and plain-language changelogs.
// =============================================================================

export type RulesetStatus = 'current' | 'draft';

export interface Ruleset {
  /** Stable id used to stamp saved assessments. */
  id: string;
  /** Compact label for chips / version stamps. */
  label: string;
  /** Full human-readable name. */
  name: string;
  status: RulesetStatus;
  /** Release date (ISO, or a planned-date string for drafts). */
  releasedAt: string;
  /** Plain-language change notes, newest first. */
  changelog: string[];
}

export const rulesets: Ruleset[] = [
  {
    id: 'or-wv-0.9',
    label: 'v0.9 · OR-WV',
    name: 'Oregon Willamette Valley pilot ruleset',
    status: 'current',
    releasedAt: '2026-04-18',
    changelog: [
      'Recalibrated liming response for soils above pH 6.5 to avoid over-rewarding alkaline chars.',
      'Added a porosity term (bulk density) to the water-retention score so light, fluffy chars rank higher.',
      'Tuned the carbon-sequestration weights toward H:C stability rather than raw fixed-carbon content.',
    ],
  },
  {
    id: 'national-1.0-draft',
    label: 'v1.0 · National (draft)',
    name: 'National draft ruleset',
    status: 'draft',
    releasedAt: '2026-09-01 (planned)',
    changelog: [
      'Generalized soil-context modifiers beyond the Willamette Valley to cover national soil orders.',
      'Introduced climate-region adjustments so the same biochar scores differently by precipitation zone.',
    ],
  },
];

/** The ruleset currently in effect — used as the default stamp for new runs. */
export const CURRENT_RULESET: Ruleset =
  rulesets.find((r) => r.status === 'current') ?? rulesets[0];

/** Lookup helper — returns undefined if the id is unknown. */
export function getRuleset(id: string): Ruleset | undefined {
  return rulesets.find((r) => r.id === id);
}
