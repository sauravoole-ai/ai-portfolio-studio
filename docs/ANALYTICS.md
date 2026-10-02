# Portfolio Analytics Contract

## Purpose

Use Vercel Web Analytics to measure public portfolio usage without treating private Studio activity or backend request volume as public visitor traffic.

## Collection Boundary

Tracked:

- public route page views;
- Vercel's standard privacy-preserving Web Analytics dimensions when available.

Not tracked by this integration:

- `/studio`;
- nested Studio paths such as `/studio/messages`;
- query strings;
- URL fragments.

The filtering policy lives in `src/lib/analytics.ts` and is covered by `src/lib/analytics.test.ts`.

## Deployment Trigger

For a Git-connected Vercel project, a normal push to the production branch can trigger a production deployment when automatic Git deployments are enabled. This provides a dashboard-free release path while preserving Git history and CI.

## Activation

The code integration alone does not create historical analytics data.

For production collection:

1. enable Web Analytics for the Vercel project;
2. deploy a production build containing `@vercel/analytics`;
3. visit at least one public route from a non-Studio session;
4. verify that page views appear in Vercel Analytics;
5. open `/studio` and confirm it is not reported.

Vercel CLI equivalent:

```bash
vercel project web-analytics
```

## Interpretation

Use Vercel Analytics for visitor and page-view reporting after activation.

Do not report Supabase REST requests, SSR data fetches, deployment checks, crawler traffic, or admin activity as exact unique visitors. Historical traffic estimates made before analytics activation must remain explicitly labeled as estimates.

## Release Verification

A production analytics release is complete only when:

- the deployed commit matches the intended GitHub commit;
- public pages render normally;
- Studio remains private and excluded from analytics;
- analytics events appear for public pages;
- no new production errors are introduced.
