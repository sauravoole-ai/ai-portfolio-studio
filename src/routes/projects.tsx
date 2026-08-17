import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { listPublishedProjects } from "@/lib/projects.functions";
import { SITE } from "@/lib/content";
import { getProjectHighlights } from "@/lib/apex.logic";

const projectsQueryOptions = queryOptions({
  queryKey: ["projects", "published"],
  queryFn: () => listPublishedProjects(),
});

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: `Projects — ${SITE.name}` },
      {
        name: "description",
        content: `Selected AI product work by ${SITE.name}.`,
      },
      { property: "og:title", content: `Projects — ${SITE.name}` },
      {
        property: "og:description",
        content: "Selected AI product work documented through concise case studies.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(projectsQueryOptions),
  errorComponent: () => (
    <SiteShell>
      <div className="container-editorial py-32 text-center">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="mt-4 font-display text-3xl">We couldn't load projects.</h1>
        <p className="mt-4 text-sm text-muted-foreground">Please try again later.</p>
      </div>
    </SiteShell>
  ),
  notFoundComponent: () => (
    <SiteShell>
      <div className="container-editorial py-32 text-center">
        <h1 className="font-display text-3xl">No projects found.</h1>
      </div>
    </SiteShell>
  ),
  component: ProjectsLayout,
});

function ProjectsLayout() {
  const matches = useMatches();
  const isChild = matches.some((m) => m.routeId === "/projects/$slug");
  if (isChild) return <Outlet />;
  return <ProjectsIndex />;
}

function ProjectsIndex() {
  const { data: projects } = useSuspenseQuery(projectsQueryOptions);

  return (
    <SiteShell>
      <section className="work-route-intro animate-rise">
        <div className="container-editorial work-route-intro__inner">
          <div className="work-route-intro__copy">
            <p className="eyebrow text-accent">Projects</p>
            <h1 className="mt-6 text-5xl leading-[0.98] tracking-[-0.05em] sm:text-6xl md:text-7xl">
              Selected work
            </h1>
            <p className="mt-7 text-lg leading-8 text-foreground-soft md:text-xl md:leading-9">
              AI products documented through the problem, approach, features, and outcome or
              learning from each build.
            </p>
          </div>

          <figure className="work-route-intro__visual">
            <img
              src="/work-route-visual.webp"
              alt="A young boy pauses beside a window overlooking distant woods in a quiet workspace."
              width={1536}
              height={1024}
            />
          </figure>
        </div>
      </section>
      <section className="work-project-index container-editorial pb-8 md:pb-12">
        {projects.length === 0 ? (
          <div className="work-project-empty">
            <p className="eyebrow text-accent">Project index</p>
            <h2 className="mt-4 text-2xl leading-tight tracking-[-0.035em] sm:text-3xl">
              Case studies will appear here once projects are published.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-foreground-soft">
              This index is ready for genuine project work, with space for a clear problem,
              approach, and outcome.
            </p>
          </div>
        ) : (
          <ul className="work-project-grid">
            {projects.map((p, i) => {
              const title = p.title ?? "Untitled";
              const cardStack = getProjectHighlights(title, p.stack);
              const row = (
                <>
                  <span className="work-project-card__number font-mono">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="work-project-card__copy">
                    <span className="work-project-card__title">{title}</span>
                    <span className="work-project-card__meta">
                      <span className="work-project-card__status">{p.status}</span>
                      {cardStack.length ? ` · ${cardStack.join(" · ")}` : null}
                    </span>
                    {p.summary ? (
                      <span className="work-project-card__summary">{p.summary}</span>
                    ) : null}
                  </span>
                  {p.slug ? (
                    <span className="work-project-card__arrow" aria-hidden>
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  ) : null}
                </>
              );

              return (
                <li key={p.id}>
                  {p.slug ? (
                    <Link
                      to="/projects/$slug"
                      params={{ slug: p.slug }}
                      className="work-project-card work-project-card--linked focus-ring group"
                      aria-label={`View project: ${title}`}
                    >
                      {row}
                    </Link>
                  ) : (
                    <article className="work-project-card work-project-card--static">{row}</article>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </SiteShell>
  );
}
