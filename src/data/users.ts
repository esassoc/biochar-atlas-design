// MOCK FIXTURE — Biochar Atlas user accounts.
//
// Not real account data. The people are the real ESA / ABI / USDA ARS project
// team (esa: projects/biochar-atlas/project.md); their org and job title
// are real, and everything that belongs to an *account* rather than a person —
// email address, application role, status, dates — is invented for the
// prototype. Emails follow a plausible pattern; none of them are live.
//
// Every column the Users grid and the user record page render resolves to a
// field on this type. Nothing on either surface is decorative.

export type UserOrg = 'ESA' | 'ABI' | 'USDA ARS';

/** Application role — what the account can do. Distinct from `title`, which is
 *  the person's job at their own organization. */
export type UserRole = 'Administrator' | 'Contributor' | 'Viewer';

/** Account lifecycle. `Invited` has never signed in, so `lastActive` is null. */
export type UserStatus = 'Active' | 'Invited' | 'Deactivated';

export interface AtlasUser {
  id: string;
  name: string;
  email: string;
  org: UserOrg;
  /** Job title at their own organization. */
  title: string;
  role: UserRole;
  status: UserStatus;
  /** ISO date of last sign-in; null when the account has never been used. */
  lastActive: string | null;
  /** `id` of the account that sent the invitation. */
  invitedBy: string;
  /** ISO date the account was created. */
  memberSince: string;
}

export const users: AtlasUser[] = [
  {
    id: 'kathleen-elmquist',
    name: 'Kathleen Elmquist',
    email: 'kelmquist@esassoc.com',
    org: 'ESA',
    title: 'Project manager / product owner',
    role: 'Administrator',
    status: 'Active',
    lastActive: '2026-08-14',
    invitedBy: 'john-burns',
    memberSince: '2026-06-18',
  },
  {
    id: 'john-burns',
    name: 'John Burns',
    email: 'jburns@esassoc.com',
    org: 'ESA',
    title: 'Project director',
    role: 'Administrator',
    status: 'Active',
    lastActive: '2026-08-12',
    invitedBy: 'john-burns',
    memberSince: '2026-06-18',
  },
  {
    id: 'raynard-lee',
    name: 'Raynard Lee',
    email: 'rlee@esassoc.com',
    org: 'ESA',
    title: 'Technical architect',
    role: 'Administrator',
    status: 'Active',
    lastActive: '2026-08-14',
    invitedBy: 'john-burns',
    memberSince: '2026-06-24',
  },
  {
    id: 'andy-lovseth',
    name: 'Andy Lovseth',
    email: 'alovseth@esassoc.com',
    org: 'ESA',
    title: 'UX designer',
    role: 'Contributor',
    status: 'Active',
    lastActive: '2026-08-14',
    invitedBy: 'kathleen-elmquist',
    memberSince: '2026-06-24',
  },
  {
    id: 'mack-peters',
    name: 'Mack Peters',
    email: 'mpeters@esassoc.com',
    org: 'ESA',
    title: 'Developer',
    role: 'Contributor',
    status: 'Active',
    lastActive: '2026-08-13',
    invitedBy: 'raynard-lee',
    memberSince: '2026-07-06',
  },
  {
    id: 'aya-attal',
    name: 'Aya Attal',
    email: 'aattal@esassoc.com',
    org: 'ESA',
    title: 'Software development intern',
    role: 'Viewer',
    status: 'Invited',
    lastActive: null,
    invitedBy: 'raynard-lee',
    memberSince: '2026-08-11',
  },
  {
    id: 'brandon-smith',
    name: 'Brandon Smith',
    email: 'brandon.smith@americanbiochar.org',
    org: 'ABI',
    title: 'Director of Agricultural Technology',
    role: 'Administrator',
    status: 'Active',
    lastActive: '2026-08-13',
    invitedBy: 'kathleen-elmquist',
    memberSince: '2026-06-18',
  },
  {
    id: 'myles-gray',
    name: 'Myles Gray',
    email: 'myles.gray@americanbiochar.org',
    org: 'ABI',
    title: 'Executive Director',
    role: 'Viewer',
    status: 'Invited',
    lastActive: null,
    invitedBy: 'brandon-smith',
    memberSince: '2026-07-29',
  },
  {
    id: 'tim-creed',
    name: 'Tim Creed',
    email: 'tim.creed@usda.gov',
    org: 'USDA ARS',
    title: 'Data scientist',
    role: 'Contributor',
    status: 'Active',
    lastActive: '2026-08-14',
    invitedBy: 'brandon-smith',
    memberSince: '2026-06-18',
  },
  {
    id: 'kristen-tripp',
    name: 'Kristen Tripp',
    email: 'kristen.tripp@usda.gov',
    org: 'USDA ARS',
    title: 'Researcher, Corvallis',
    role: 'Contributor',
    status: 'Active',
    lastActive: '2026-08-07',
    invitedBy: 'brandon-smith',
    memberSince: '2026-06-24',
  },
];

export const usersById: Record<string, AtlasUser> = Object.fromEntries(
  users.map((u) => [u.id, u]),
);

/** "14 Aug 2026" — the one date format both surfaces use. */
export function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d} ${months[m - 1]} ${y}`;
}

/** Initials for the avatar disc — first + last, matching esa-avatar's rule. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.length === 1
    ? parts[0][0].toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
