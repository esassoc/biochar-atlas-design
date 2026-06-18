// =============================================================================
// MOCK DATA — for prototyping only.
// Saved assessments for the authenticated demo persona (a Lane County NRCS
// district conservationist). These populate the "My assessments" list so the
// signed-in experience has history to show. Top scores were taken from the
// deterministic scoring engine for each field + goal set, so the saved numbers
// match what re-running the assessment would produce; everything else (names,
// dates, owners) is invented. Field names and soil series cross-reference
// fields.ts / soil-units.ts; biochar and ruleset ids cross-reference
// biochar-catalog.ts / rulesets.ts.
// =============================================================================

export type AssessmentStatus = 'complete';

export interface SavedAssessment {
  /** Stable id. */
  id: string;
  /** Field this assessment was run against (FieldSite.name). */
  fieldName: string;
  /** Dominant soil series of that field (SoilUnit.series). */
  soilSeries: string;
  /** Goal ids scored (see goals.ts). */
  goalIds: string[];
  /** Biochars compared in the run (Biochar.id). */
  biocharIds: string[];
  /** Headline score of the top-ranked biochar, 0–100. */
  topScore: number;
  /** Ruleset that produced the scores (Ruleset.id). */
  rulesetId: string;
  status: AssessmentStatus;
  /** Whether a field-ready report PDF has been generated for this run. */
  reportAvailable: boolean;
  /** When the assessment was saved (ISO date). */
  createdAt: string;
}

export const savedAssessments: SavedAssessment[] = [
  {
    id: 'asmt-2026-0502-river-bend',
    fieldName: 'River Bend Field',
    soilSeries: 'Willamette',
    goalIds: [
      'improve-water-retention',
      'increase-soil-organic-matter',
      'carbon-sequestration',
    ],
    biocharIds: ['douglas-fir-slash-550', 'mixed-hardwood-650', 'walnut-shell-550'],
    topScore: 78,
    rulesetId: 'or-wv-0.9',
    status: 'complete',
    reportAvailable: true,
    createdAt: '2026-05-02',
  },
  {
    id: 'asmt-2026-0515-awbrey-slough',
    fieldName: 'Awbrey Slough Forty',
    soilSeries: 'Dayton',
    goalIds: ['raise-soil-ph', 'improve-nutrient-retention', 'relieve-compaction'],
    biocharIds: ['dairy-manure-600', 'wheat-straw-500', 'oak-600'],
    topScore: 56,
    rulesetId: 'or-wv-0.9',
    status: 'complete',
    reportAvailable: true,
    createdAt: '2026-05-15',
  },
  {
    id: 'asmt-2026-0528-santa-clara',
    fieldName: 'Santa Clara Flat',
    soilSeries: 'Malabon',
    goalIds: ['relieve-compaction', 'improve-water-retention', 'support-soil-biology'],
    biocharIds: ['douglas-fir-slash-550', 'oak-600', 'orchard-prunings-600'],
    topScore: 72,
    rulesetId: 'or-wv-0.9',
    status: 'complete',
    reportAvailable: false,
    createdAt: '2026-05-28',
  },
  {
    id: 'asmt-2026-0609-coburg-bottoms',
    fieldName: 'Coburg Bottoms',
    soilSeries: 'Coburg',
    goalIds: [
      'reduce-nutrient-leaching',
      'increase-soil-organic-matter',
      'carbon-sequestration',
    ],
    biocharIds: [
      'walnut-shell-550',
      'oak-600',
      'hazelnut-shell-500',
      'mixed-hardwood-650',
    ],
    topScore: 76,
    rulesetId: 'or-wv-0.9',
    status: 'complete',
    reportAvailable: true,
    createdAt: '2026-06-09',
  },
];

/** Lookup helper — returns undefined if the id is unknown. */
export function getAssessment(id: string): SavedAssessment | undefined {
  return savedAssessments.find((a) => a.id === id);
}
