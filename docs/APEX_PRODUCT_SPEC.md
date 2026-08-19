# Apex Personal Website — Product Specification

## Product purpose

- Personal AI portfolio and publishing platform.
- Professional identity anchored in AI Product Builder work.
- Work provides evidence through published project case studies.
- Journal supports publishing writing, observations, and experiments.
- About presents identity, capabilities, and the tool ecosystem.
- Contact supports structured work enquiries.
- Studio provides private content and enquiry management.

## Public routes

- `/`
- `/projects`
- `/projects/$slug`
- `/writing`
- `/writing/$slug`
- `/about`
- `/contact`

## Private route

- `/studio`
- Authenticated, admin-only access.
- Must retain `noindex, nofollow` metadata.

## Navigation contract

- Home: no previous route; next → Work.
- Work: previous → Home; next → Journal.
- Journal: previous → Work; next → About.
- About: previous → Journal; next → Contact.
- Contact: previous → About; next → Home.
- Detail routes use contextual in-content Back links without redundant previous-route controls.

## Responsive contract

- Mobile, tablet, and desktop must each be intentionally composed.
- The Home hero uses the same approved 2400×1800 image with responsive art direction.
- Mobile uses side-edge route navigation that must not obscure content.
- Major interactive targets should be approximately 44px.
- There must be no breakpoint where intended navigation disappears.
- Major Home and Footer sections must not be reordered with CSS.
- Preserve natural DOM and document flow: Home content before Footer.

## Visual identity constraints

- Preserve the Obsidian Signal visual identity.
- The experience is premium, editorial, and cinematic.
- Avoid a SaaS-dashboard aesthetic, unnecessary black slabs, and glass-card excess.
- Do not use calligraphic typography or badge/skill-rating walls.
- Prefer hierarchy, whitespace, and typography over decoration.

## Content constraints

- Personal claims must remain factual and restrained.
- Do not add unsupported SDE, full-stack engineer, or ML engineer claims.
- Dynamic Site Profile data manages mutable personal-branding content.
- Route, layout, and security labels remain code-managed.
- Do not add fake Journal content or duplicate the Connect CTA.

## Work contract

- Only published projects are publicly visible.
- Published projects support the complete case-study structure.
- Technology descriptions and technical highlights must remain truthful and factual.

## Contact contract

- Contact is a structured enquiry flow stored in Supabase `contact_messages`.
- Preserve validation and honeypot protection.
- Public users have insert-only access.
- Studio admins may read and manage messages.
- Do not add checkout or pricing claims.

## Studio contract

- Studio is a private publishing and administration interface.
- Security relies on Supabase Auth, the admin allowlist, and RLS.
- Studio manages profile, project, post, and message records.
- Hiding the route is not a security control.

## Deployment

- TanStack Start with Vite.
- Nitro targets the Cloudflare module preset.
- Production runs as a Cloudflare Worker with a Supabase backend.
- Required runtime binding names:
  - `SUPABASE_URL`
  - `SUPABASE_PUBLISHABLE_KEY`
- Never place secret values in this specification.

## Change discipline

- Avoid feature creep.
- Do not integrate sponsor or free APIs without a demonstrated product need.
- Tests and builds do not replace rendered visual verification.
- Responsive changes require manual mobile, tablet, and desktop inspection before production.
- Prefer small, coherent changes over broad redesigns.
