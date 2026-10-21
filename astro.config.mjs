import { defineConfig } from 'astro/config';

// Minimal, mirroring the ecology hub and the beacon/cb-fish spokes. The spoke
// ships static HTML/CSS; interactivity comes from the hub's Lit web components
// (self-registering) and any island scripts a prototype adds.
//
// Intended to publish to GitHub Pages as a project site, so production builds
// need the subpath as `base`. Dev stays at root for clean local URLs —
// withBase() (src/lib/base.ts) reads whichever base is active.
const base = process.env.NODE_ENV === 'production' ? '/biochar-atlas-design/' : '/';

export default defineConfig({
  // Off: the design layer and the Handoff pill run without Astro's dev toolbar.
  devToolbar: { enabled: false },
  site: 'https://esassoc.github.io',
  base,
  server: { port: 4340 },
  vite: {
    // Pre-bundle every npm dep a client script imports. The hub is a file:
    // symlink, so Vite discovers deps mid-session as pages start using new
    // legos — each discovery invalidates the dep cache and the browser gets
    // "504 Outdated Optimize Dep" until a server restart. Naming them up front
    // ends that class of failure (it silently killed the workflow switcher
    // twice, then the Users grid).
    optimizeDeps: {
      include: [
        'lit',
        'lit/directives/unsafe-html.js',
        'lit/directives/unsafe-svg.js',
        'ag-grid-community',
      ],
    },
  },
});
