// Single source of truth for the prototype library — one entry per working
// screen. The home page renders this list; keep status honest so the library
// reads as a roadmap, not a brochure.

export type PrototypeStatus = 'live' | 'in-progress' | 'planned' | 'archived';

export interface PrototypePage {
  slug: string;
  title: string;
  description: string;
  route: string;       // base-less, e.g. '/prototypes/suitability-tool'
  createdAt: string;   // ISO date YYYY-MM-DD
  status: PrototypeStatus;
}

export const prototypes: PrototypePage[] = [
  {
    slug: 'suitability-tool',
    title: 'Biochar Suitability Tool',
    description:
      'The centerpiece: pick a field on the map, auto-derive SSURGO soil context, choose application goals, compare biochars, and get scored recommendations with a downloadable report.',
    route: '/prototypes/suitability-tool',
    createdAt: '2026-06-11',
    status: 'in-progress',
  },
  {
    slug: 'assessment-report',
    title: 'Assessment Report',
    description:
      'Print-styled, field-ready PDF view of a completed assessment — scores, rationale, limitations and disclaimers, ruleset version stamp.',
    route: '/prototypes/assessment-report',
    createdAt: '2026-06-11',
    status: 'in-progress',
  },
  {
    slug: 'scenario-comparison',
    title: 'Scenario Comparison',
    description:
      'Side-by-side evaluation across biochars, application rates, and compost co-application.',
    route: '/prototypes/scenario-comparison',
    createdAt: '2026-06-11',
    status: 'planned',
  },
  {
    slug: 'form-workflow',
    title: 'Form-Based Workflow',
    description:
      'The map-free entry path: coordinates or county lookup plus manual soil-test entry, for users with lab data or low-bandwidth field laptops.',
    route: '/prototypes/form-workflow',
    createdAt: '2026-06-11',
    status: 'planned',
  },
  {
    slug: 'cps-336-calculator',
    title: 'CPS 336 Calculator',
    description:
      'The NRCS Soil Carbon Amendment calculator re-platformed as a second workflow sharing the same shell, soil context, and biochar catalog.',
    route: '/prototypes/cps-336-calculator',
    createdAt: '2026-06-11',
    status: 'planned',
  },
  {
    slug: 'admin-catalog',
    title: 'Admin — Biochar Catalog',
    description:
      'Catalog CRUD, dataset refresh, and algorithm version history — the admin workflow for data refreshes.',
    route: '/prototypes/admin-catalog',
    createdAt: '2026-06-11',
    status: 'planned',
  },
];
