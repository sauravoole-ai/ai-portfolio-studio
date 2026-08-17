import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site-shell";
import { listPublishedProjects, type PublishedProject } from "@/lib/projects.functions";
import { SITE } from "@/lib/content";

const projectsQueryOptions = queryOptions({
  queryKey: ["projects", "published"],
  queryFn: () => listPublishedProjects(),
});

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params, context }) => {
    const projects = await context.queryClient.ensureQueryData(projectsQueryOptions);
    const project = projects.find((p: PublishedProject) => p.slug === params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: `Project not found — ${SITE.name}` },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { project } = loaderData;
    const title = project.title ?? "Untitled project";
    const summary = project.summary ?? "";
    return {
      meta: [
        { title: `${title} — Case study` },
        { name: "description", content: summary },
        { property: "og:title", content: `${title} — Case study` },
        { property: "og:description", content: summary },
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
  const { data: projects } = useSuspenseQuery(projectsQueryOptions);
  const idx = projects.findIndex((p: PublishedProject) => p.slug === project.slug);
  const next = projects.length > 1 ? projects[(idx + 1) % projects.length] : null;

  return (
    <SiteShell>
      <article className="animate-rise">
        <header className="container-editorial pt-16 pb-12 md:pt-24 md:pb-16">
          <Link to="/projects" className="eyebrow link-underline">
            ← Back to Work
          </Link>
          <h1 className="mt-6 max-w-4xl font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            {project.title ?? "Untitled project"}
          </h1>
          {project.summary ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {project.summary}
            </p>
          ) : null}
          <div className="project-detail-meta mt-7 flex flex-wrap items-baseline gap-x-5 gap-y-2 text-[0.9375rem] leading-7 text-foreground-soft">
            <span className="font-medium text-mint">{project.status}</span>
            {project.stack.length ? <span className="max-w-2xl">{project.stack.join(" · ")}</span> : null}
          </div>
        </header>

        {project.cover_image_url ? <figure className="container-editorial pb-12 md:pb-16"><div className="aspect-video overflow-hidden rounded-[var(--radius-card)] border border-border-subtle"><img className="h-full w-full object-cover" src={project.cover_image_url} alt="" /></div></figure> : null}

        {[project.problem && ["Problem", project.problem], project.approach && ["Approach", project.approach], project.outcome && ["Outcome / Learning", project.outcome]].filter(Boolean).map((section) => {
          const [heading, copy] = section as [string, string];
          return <section key={heading} className="border-t border-border"><div className="container-editorial grid gap-8 py-12 md:grid-cols-[16ch_minmax(0,1fr)] md:gap-16 md:py-16"><h2 className="eyebrow md:pt-2">{heading}</h2><p className="max-w-2xl whitespace-pre-line text-lg leading-relaxed text-muted-foreground">{copy}</p></div></section>;
        })}

        {project.key_features.length ? <section className="border-t border-border"><div className="container-editorial grid gap-8 py-12 md:grid-cols-[16ch_minmax(0,1fr)] md:gap-16 md:py-16"><h2 className="eyebrow md:pt-2">Key Features</h2><ul className="max-w-2xl space-y-4 text-lg leading-relaxed text-muted-foreground">{project.key_features.map((feature) => <li key={feature} className="border-b border-border-subtle pb-4 last:border-0">{feature}</li>)}</ul></div></section> : null}

        {project.live_url || project.github_url ? <section className="border-t border-border"><div className="container-editorial flex flex-wrap gap-4 py-12 md:py-16">{project.live_url ? <a className="button-primary focus-ring" href={project.live_url} target="_blank" rel="noopener noreferrer">View live product</a> : null}{project.github_url ? <a className="focus-ring inline-flex min-h-11 items-center rounded-md px-4 link-underline" href={project.github_url} target="_blank" rel="noopener noreferrer">View on GitHub</a> : null}</div></section> : null}

        {next && next.slug ? (
          <nav className="border-t border-border">
            <Link
              to="/projects/$slug"
              params={{ slug: next.slug }}
              className="group container-editorial flex flex-col justify-between gap-4 py-12 md:flex-row md:items-end md:py-16"
            >
              <div>
                <p className="eyebrow">Next project</p>
                <p className="mt-3 font-display text-3xl transition-colors group-hover:text-[color:var(--terracotta)] md:text-4xl">
                  {next.title ?? "Untitled"}
                </p>
              </div>
              <span className="max-w-md text-sm leading-6 text-muted-foreground md:text-right">
                {next.summary ?? ""} <span aria-hidden>→</span>
              </span>
            </Link>
          </nav>
        ) : null}
      </article>
    </SiteShell>
  );
}
