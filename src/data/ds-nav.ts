// Single source of truth for the design-system sidebar + breadcrumbs.
// Scoped to the components the Biochar Atlas actually uses / themes — a
// curated subset of the Ecology set, not the full hub catalog. Hrefs are
// root-relative and base-less; DocsShell wraps them with withBase() at render.
//
// Types come from @esa/docs so the data stays structurally compatible with the
// shared shell; only the DATA is per-spoke.
import type { NavItem, NavGroup } from '@esa/docs/nav';
export type { NavItem, NavGroup };

export const foundations: NavGroup = {
  label: 'Foundations',
  items: [
    { label: 'Color', href: '/design-system/foundations/color' },
    { label: 'Typography', href: '/design-system/foundations/typography' },
    { label: 'Spacing', href: '/design-system/foundations/spacing' },
    { label: 'Radius', href: '/design-system/foundations/radius' },
  ],
};

const c = (label: string, name: string): NavItem => ({
  label,
  href: `/design-system/components/${name}`,
});

export const componentGroups: NavGroup[] = [
  {
    label: 'Core',
    items: [c('Button', 'esa-button'), c('Icon', 'esa-icon')],
  },
  {
    label: 'Forms',
    items: [
      c('Text Field', 'esa-text-field'),
      c('Select', 'esa-select'),
      c('Checkbox', 'esa-checkbox'),
      c('Switch Toggle', 'esa-switch-toggle'),
    ],
  },
  {
    label: 'Display',
    items: [
      c('Badge', 'esa-badge'),
      c('Card', 'esa-card'),
      c('Pill', 'esa-pill'),
      c('Alert Box', 'esa-alert-box'),
      c('Collapsible', 'esa-collapsible'),
      c('Progress Bar', 'esa-progress-bar'),
      c('Empty State', 'esa-empty-state'),
    ],
  },
  {
    label: 'Filters & Controls',
    items: [
      c('Filter Dropdown', 'esa-filter-dropdown'),
      c('Button Toggle', 'esa-button-toggle'),
      c('Chip Group', 'esa-chip-group'),
    ],
  },
];

export const allGroups: NavGroup[] = [foundations, ...componentGroups];
