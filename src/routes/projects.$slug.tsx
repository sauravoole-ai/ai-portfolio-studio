import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { projects } from "@/lib/content";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = projects.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Project not found — [Your Name]" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { project } = loaderData;
    return {
      meta: [
        { title: `${project.name} — Case study` },
        { name: "description", content: project.summary },
        { property: "og:title", content: `${project.name} — Case study` },
        { property: "og:description", content: project.summary },
      ],
    };
  },
  notFoundComponent: NotFound,
  component: ProjectPage,
});

function NotFound() {
  return (
    <SiteShell>
      <div className="container-editorial py-32 text-center">
        <p className="eyebrow">Missing project</p>
        <h1 className="mt-4 font-display text-4xl">We can't find that case study.</h1>
        <Link to="/projects" className="mt-8 inline-block link-underline">
          Back to all projects
        </Link>
      </div>
    </SiteShell>
  );
}

function ProjectPage() {
  const { project } = Route.useLoaderData();
  const idx = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <SiteShell>
      <article className="animate-rise">
        <header className="container-editorial pt-16 pb-12 md:pt-24 md:pb-16">
          <Link to="/projects" className="eyebrow link-underline">
            ← Projects
          </Link>
          <h1 className="mt-6 max-w-4xl font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            {project.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {project.tagline}
          </p>

          <dl className="mt-12 grid grid-cols-2 gap-y-6 border-y border-border py-6 md:grid-cols-4">
            <MetaItem label="Year" value={project.year} />
            <MetaItem label="Role" value={project.role} />
            <MetaItem label="Status" value={project.status} />
            <MetaItem label="Stack" value={project.stack.join(" · ")} />
          </dl>
        </header>

        <section className="container-editorial grid gap-12 pb-20 md:grid-cols-[16ch_minmax(0,1fr)] md:gap-16">
          <h2 className="eyebrow md:pt-2">Overview</h2>
          <p className="max-w-2xl font-display text-2xl leading-snug md:text-3xl">
            {project.summary}
          </p>
        </section>

        <section className="border-t border-border">
          <div className="container-editorial grid gap-12 py-16 md:grid-cols-[16ch_minmax(0,1fr)] md:gap-16 md:py-24">
            <h2 className="eyebrow md:pt-2">The problem</h2>
            <p className="max-w-2xl text-lg leading-relaxed">{project.problem}</p>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="container-editorial grid gap-12 py-16 md:grid-cols-[16ch_minmax(0,1fr)] md:gap-16 md:py-24">
            <h2 className="eyebrow md:pt-2">Approach</h2>
            <ol className="max-w-2xl space-y-6">
              {project.approach.map((step, i) => (
                <li key={i} className="grid grid-cols-[3ch_1fr] gap-4">
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-lg leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-border bg-secondary/40">
          <div className="container-editorial py-16 md:py-24">
            <p className="eyebrow">By the numbers</p>
            <div className="mt-8 grid gap-8 sm:grid-cols-3">
              {project.metrics.map((m) => (
                <div key={m.label} className="border-t border-border pt-6">
                  <p className="font-display text-4xl md:text-5xl">{m.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="container-editorial grid gap-12 py-16 md:grid-cols-[16ch_minmax(0,1fr)] md:gap-16 md:py-24">
            <h2 className="eyebrow md:pt-2">Outcome</h2>
            <ul className="max-w-2xl space-y-4">
              {project.outcome.map((o, i) => (
                <li key={i} className="border-l-2 border-[color:var(--terracotta)] pl-4 text-lg leading-relaxed">
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <nav className="border-t border-border">
          <Link
            to="/projects/$slug"
            params={{ slug: next.slug }}
            className="group container-editorial flex flex-col justify-between gap-4 py-12 md:flex-row md:items-end md:py-16"
          >
            <div>
              <p className="eyebrow">Next project</p>
              <p className="mt-3 font-display text-3xl md:text-4xl group-hover:text-[color:var(--terracotta)] transition-colors">
                {next.name}
              </p>
            </div>
            <span className="text-sm text-muted-foreground">
              {next.tagline} <span aria-hidden>→</span>
            </span>
          </Link>
        </nav>
      </article>
    </SiteShell>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-2 text-sm">{value}</dd>
    </div>
  );
}
