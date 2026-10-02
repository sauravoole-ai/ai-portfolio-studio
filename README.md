# AI Portfolio Studio

A full-stack personal portfolio and publishing platform for presenting AI products, writing, experiments, and professional enquiries through a private-editor/public-site workflow.

**Production:** https://sauravkrjha.vercel.app

## Product Surfaces

- **Home** — editorial introduction and portfolio navigation.
- **Work** — published projects presented as structured case studies.
- **Journal** — writing, observations, and build notes.
- **About** — dynamic profile, capabilities, and technology context.
- **Contact** — validated professional enquiry flow.
- **Studio** — private administration for profile, projects, posts, and messages.

## Stack

- **Application:** React, TypeScript, TanStack Start / Router / Query, Vite, Tailwind CSS
- **Data:** Supabase, PostgreSQL, Auth, Row Level Security, versioned migrations
- **Runtime:** Nitro on Vercel
- **Operations:** GitHub, Vercel Web Analytics, Supabase logging

## Architecture

```text
Public browser
  → TanStack Start application on Vercel
  → published reads / validated writes through Supabase

Private Studio
  → Supabase Auth
  → admin allowlist
  → RLS-protected administration
```

Route obscurity is not treated as a security boundary.

## Public Routes

- `/`
- `/projects`
- `/projects/:slug`
- `/writing`
- `/writing/:slug`
- `/about`
- `/contact`

Private route: `/studio`.

## Analytics & Privacy

The repository integrates Vercel Web Analytics for public portfolio traffic.

- `/studio` and nested Studio paths are excluded before analytics events are sent.
- Public analytics URLs have query strings and fragments removed.
- Analytics data is not backfilled; collection starts only after the Vercel project has Web Analytics enabled and an instrumented production build is deployed.
- Supabase/Vercel backend request counts are operational telemetry, not a substitute for verified unique-visitor metrics.

See [docs/ANALYTICS.md](docs/ANALYTICS.md) for the analytics contract, activation, and verification procedure.

## Security Boundaries

- Supabase Auth protects authenticated access.
- An admin allowlist restricts Studio authorization.
- RLS enforces database access boundaries.
- Studio retains `noindex, nofollow` metadata.
- Public contact access is limited to validated inserts; message reading and management remain admin-only.

These are implemented controls, not a security certification.

## Local Development

Required runtime variable names:

```text
SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY
```

Keep all environment values local; never commit secret values.

```bash
npm install
npm run dev
npm run build
npm run lint
npm run typecheck
npm run format:check
```

The repository also retains a Bun lockfile for the connected development workflow. TypeScript-native tests and the full verification command use Bun:

```bash
bun test
bun run verify
```

## Deployment

Production releases target the linked Vercel project. Before release:

1. run the repository verification checks;
2. inspect the rendered site on mobile, tablet, and desktop;
3. deploy the verified commit;
4. confirm public routes, private Studio behavior, analytics collection, and error-free production logs.

The current project specification is in [docs/APEX_PRODUCT_SPEC.md](docs/APEX_PRODUCT_SPEC.md).

## Status

**Apex V1.1 — production live.**

## Author

Saurav Kumar Jha  
AI Product Builder
