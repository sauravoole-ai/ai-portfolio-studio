import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site-shell";
import { listPublishedProjects, type PublishedProject } from "@/lib/projects.functions";

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
          { title: "Project not found — [Your Name]" },
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
            ← Projects
          </Link>
          <h1 className="mt-6 max-w-4xl font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            {project.title ?? "Untitled project"}
          </h1>
          {project.summary ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {project.summary}
            </p>
          ) : null}
        </header>

        <section className="border-t border-border">
          <div className="container-editorial grid gap-12 py-16 md:grid-cols-[16ch_minmax(0,1fr)] md:gap-16 md:py-24">
            <h2 className="eyebrow md:pt-2">Case study</h2>
            <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>[Case study content will appear here once the project detail schema is expanded — problem, approach, outcome, and metrics.]</p>
            </div>
          </div>
        </section>

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
              <span className="text-sm text-muted-foreground">
                {next.summary ?? ""} <span aria-hidden>→</span>
              </span>
            </Link>
          </nav>
        ) : null}
      </article>
    </SiteShell>
  );
}
