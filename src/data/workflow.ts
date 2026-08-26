// Suitability Tool workflows — the stepper prototype's data spine.
//
// The Evaluate a Site workflow maps the Developer Guide's eight modules
// (08_12_2026) one step per module, in module order — no folding. Explore
// Biochars follows the guide's own biochar-first stepper (§0.2: Goals →
// Biochar Selection → Contribution Results → Export, no cost-benefit) plus
// two flagged additions: the optional Module 4 amendment-entry step (§0.1
// names manual entry as an Explore entry point) and the optional "Add a site"
// step (this prototype's proposal — the client review needs to confirm it).
//
// `values` is the canned data a step captures when completed in the demo.
// Deterministic on purpose: the calibration anchors (Douglas-fir slash 550 °C
// scores 78, mixed hardwood 650 °C scores 64 on Willamette silt loam under the
// default goals) are fixed, per CLAUDE.md. Demo geography is the Santa
// Clara/Coburg farm belt, Lane County, Oregon (survey area OR039).

export interface StepValue {
  label: string;
  value: string;
}

export interface StepDef {
  id: string;
  /** Rail label — concise imperative, shorter than the guide's module titles. */
  label: string;
  /** Step headline in the main column. */
  title: string;
  /** Developer Guide module this step covers, e.g. "Guide module 4". */
  modules: string;
  optional?: boolean;
  /** One or two sentences of user guidance inside the step. */
  guidance: string;
  /** What Phase 2 builds inside this step — the placeholder panel contents. */
  planned: string[];
  /** Key values captured on completion — the summary rows this step reveals. */
  values: StepValue[];
}

export interface WorkflowDef {
  id: string;
  label: string;
  steps: StepDef[];
}

// ── Steps shared by both workflows ──────────────────────────────────────────

const goalsStep: Omit<StepDef, 'optional'> = {
  id: 'goals',
  label: 'Set goals',
  title: 'Set goals and criteria',
  modules: 'Guide module 3',
  guidance:
    'Select one or more application goals and any exclusion criteria. Goals drive the biochar scoring; exclusions remove biochars that fail them.',
  planned: ['Goal cards with priority ranking', 'Exclusion criteria toggles'],
  values: [
    { label: 'Goals', value: 'Water retention, organic matter, carbon storage' },
    { label: 'Exclusions', value: 'CPS 336 standard' },
  ],
};

// Guide module 4 — used only when the material is not in the ABI catalog, so
// it is optional in both workflows.
const amendmentStep: StepDef = {
  id: 'amendment',
  label: 'Add amendment',
  title: 'Add a custom amendment',
  modules: 'Guide module 4',
  optional: true,
  guidance:
    'Enter or upload a biochar, compost, or other amendment that is not in the catalog. Entries standardize into the same record the catalog uses.',
  planned: [
    'Amendment type selector',
    'Manual property entry',
    'Lab report upload',
    'Standardized record preview',
  ],
  values: [
    { label: 'Custom amendment', value: 'Hazelnut shell 500 °C' },
    { label: 'Source', value: 'Lab report' },
  ],
};

const resultsStep: StepDef = {
  id: 'results',
  label: 'Review results',
  title: 'Review contribution results',
  modules: 'Guide module 6',
  guidance:
    'Set the application rate and review the nutrient budget. Liming and soil carbon results update with the rate.',
  planned: [
    'Application rate input',
    'Nutrient budget tables',
    'Fertilizer replacement values',
    'pH and liming calculator',
    'Soil carbon calculator',
  ],
  values: [
    { label: 'Application rate', value: '10 tons/acre' },
    { label: 'Soil carbon', value: '+4.4 tons C/acre' },
  ],
};

const exportStep: StepDef = {
  id: 'export',
  label: 'Export report',
  title: 'Export the report',
  modules: 'Guide module 8',
  guidance:
    'Download the assessment as a field-ready PDF or as the NRCS CPS 336 package.',
  planned: ['PDF report builder', 'NRCS CPS 336 export'],
  values: [{ label: 'Report', value: 'PDF assessment' }],
};

// ── Evaluate a site (soil-first) — modules 1 through 8, one step each ────────

export const evaluateASite: WorkflowDef = {
  id: 'evaluate',
  label: 'Evaluate a site',
  steps: [
    {
      id: 'site',
      label: 'Select a site',
      title: 'Select a site',
      modules: 'Guide module 1',
      guidance:
        'Draw, click, or import the area of interest. Soil properties for the selected area load from SSURGO and stay editable.',
      planned: [
        'Interactive map with the national SOH-BC layer',
        'AOI drawing and import',
        'SSURGO retrieval',
        'Soil property editor',
        'Soil lab report upload',
      ],
      values: [
        { label: 'Site', value: 'Coburg Bend field' },
        { label: 'Area', value: '38.2 ac' },
        { label: 'Survey area', value: 'OR039' },
      ],
    },
    {
      id: 'soil',
      label: 'Review soil',
      title: 'Review the soil summary',
      modules: 'Guide module 2',
      guidance:
        'Confirm the standardized soil record. The NRCS published rating and the ABI exploratory score are reported side by side.',
      planned: [
        'Soil properties table',
        'NRCS SOH-BC published rating',
        'ABI exploratory score',
        'Advisory messages',
      ],
      values: [
        { label: 'Soil', value: 'Willamette silt loam' },
        { label: 'Texture', value: 'Silt loam' },
        { label: 'pH', value: '5.9' },
        { label: 'NRCS rating', value: 'Moderately well suited' },
      ],
    },
    { ...goalsStep },
    { ...amendmentStep },
    {
      id: 'biochar',
      label: 'Choose biochar',
      title: 'Choose a biochar',
      modules: 'Guide module 5',
      guidance:
        'Compare scored biochars and select one. Custom amendments you added appear in their own group beside the catalog.',
      planned: [
        'Scored biochar list',
        'User-provided amendments group',
        'Application mode selector',
      ],
      values: [
        { label: 'Biochar', value: 'Douglas-fir slash 550 °C' },
        { label: 'Score', value: '78' },
        { label: 'Mode', value: 'Single' },
      ],
    },
    { ...resultsStep },
    {
      id: 'costs',
      label: 'Weigh costs',
      title: 'Weigh costs and benefits',
      modules: 'Guide module 7',
      optional: true,
      guidance:
        'Estimate the five-year financial impact of the application. The rate and fertilizer savings carry over from the contribution results.',
      planned: [
        'Cost and yield assumptions',
        'Five-year performance table',
        'Scenario testing',
      ],
      values: [
        { label: 'Amendment cost', value: '$142/acre' },
        { label: 'Five-year net', value: '+$186/acre' },
      ],
    },
    { ...exportStep },
  ],
};

// ── Explore biochars (biochar-first) ─────────────────────────────────────────

export const exploreBiochars: WorkflowDef = {
  id: 'explore',
  label: 'Explore biochars',
  steps: [
    { ...goalsStep, optional: true },
    { ...amendmentStep },
    {
      id: 'biochars',
      label: 'Choose biochars',
      title: 'Choose biochars',
      modules: 'Guide module 5',
      guidance:
        'Browse the scored catalog and select up to three biochars to compare. Custom amendments you added appear in their own group.',
      planned: [
        'Scored biochar list',
        'User-provided amendments group',
        'Application mode selector',
      ],
      values: [
        { label: 'Mode', value: 'Comparison' },
        { label: 'Douglas-fir slash 550 °C', value: '78' },
        { label: 'Mixed hardwood 650 °C', value: '64' },
      ],
    },
    {
      id: 'site',
      label: 'Add a site',
      title: 'Add a site',
      modules: 'Guide modules 1–2',
      optional: true,
      guidance:
        'Add a field to unlock the nutrient budget, liming, and soil carbon results.',
      planned: ['Interactive map', 'SSURGO retrieval', 'Soil summary'],
      values: [
        { label: 'Soil', value: 'Willamette silt loam' },
        { label: 'pH', value: '5.9' },
      ],
    },
    { ...resultsStep },
    { ...exportStep },
  ],
};
