# AI Portfolio Studio

A personal AI portfolio and publishing platform for showcasing products, writing, experiments, and professional work enquiries.

## Live Demo

https://sauravoole-ai-ai-portfolio-studio.sauravkrjha.workers.dev

## What It Includes

- **Home:** An editorial introduction with responsive navigation into the portfolio.
- **Work:** Published projects presented as structured case studies.
- **Journal:** Publishing for writing, observations, and experiments.
- **About:** A dynamic personal profile, capabilities, and tool ecosystem.
- **Contact:** A validated, structured professional enquiry flow.
- **Studio:** A private administration interface for profile, project, post, and message management.
- **Responsive experience:** Purposefully composed mobile, tablet, and desktop layouts.
- **Discoverability:** Canonical URLs, social metadata, sitemap, robots directives, and structured profile data.

## Key Product Features

- Supabase-driven published projects and case studies
- Journal publishing
- Private Studio administration
- Dynamic Site Profile content
- Structured Contact enquiries and admin message management
- Responsive route navigation
- Open Graph and Twitter metadata
- Canonical URLs
- Dynamic `sitemap.xml`
- `robots.txt`
- Structured `ProfilePage` metadata

## Architecture / Stack

### Frontend / App

- React
- TypeScript
- TanStack Start, Router, and Query
- Vite
- Tailwind CSS

### Backend / Data

- Supabase
- Postgres
- Supabase Auth
- Row Level Security (RLS)
- Versioned database migrations

### Deployment

- Nitro
- Cloudflare Workers
- Wrangler

### Development

- Git and GitHub
- VS Code
- AI-assisted development workflow

## Architecture Overview

```text
Browser
  → TanStack Start application
  → Supabase for data and authentication
  → Cloudflare Worker for the production runtime
```

Studio is private and protected through Supabase Auth, an admin allowlist, and RLS. Route obscurity is not treated as a security boundary.

## Routes

Public:

- `/`
- `/projects`
- `/projects/:slug`
- `/writing`
- `/writing/:slug`
- `/about`
- `/contact`

Private:

- `/studio`

## Local Development

Required environment variable names:

```text
SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY
```

Available project commands:

```bash
npm run dev
npm run build
npm run build:dev
npm run preview
npm run lint
npm run format
```

Environment values must remain local and must never be committed.

## Deployment

Production uses the existing Nitro → Cloudflare Workers architecture. Wrangler deploys the generated Nitro Worker configuration with the required runtime bindings supplied securely by the deployment environment.

## Security

- Supabase Auth protects authenticated access.
- An admin allowlist restricts Studio authorization.
- RLS enforces database access boundaries.
- Studio retains `noindex, nofollow` metadata.
- Public Contact access is restricted to validated inserts; message reading and management remain admin-only.

This describes the implemented controls and is not a security certification.

## Product Specification

See [docs/APEX_PRODUCT_SPEC.md](docs/APEX_PRODUCT_SPEC.md) for the locked product, responsive, navigation, content, security, deployment, and change-discipline contracts.

## Status

Apex V1.1 — live.

## Author

Saurav Kumar Jha<br>
AI Product Builder
