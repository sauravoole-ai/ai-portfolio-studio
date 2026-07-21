import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { PremiumEmptyState } from "@/components/premium-empty-state";
import { SiteShell, PageHeader } from "@/components/site-shell";
import { listPublishedProjects } from "@/lib/projects.functions";

const projectsQueryOptions = queryOptions({
  queryKey: ["projects", "published"],
  queryFn: () => listPublishedProjects(),
});

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — [Your Name]" },
      {
        name: "description",
        content: "Selected AI product work by [Your Name] — case studies and shipped surfaces.",
      },
      { property: "og:title", content: "Projects — [Your Name]" },
      {
        property: "og:description",
        content: "Selected AI product work — case studies and shipped surfaces.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(projectsQueryOptions),
  errorComponent: ({ error }) => (
    <SiteShell>
      <div className="container-editorial py-32 text-center">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="mt-4 font-display text-3xl">We couldn't load projects.</h1>
        <p className="mt-4 text-sm text-muted-foreground">{error.message}</p>
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
      <PageHeader
        eyebrow="Projects · 2023–2026"
        title="Selected work, considered."
        lede="A small, curated set of AI products I've designed, engineered or shipped. Each has a short case study — problem, approach, outcome."
      />
      <section className="container-editorial pb-16 md:pb-24">
        {projects.length === 0 ? (
          <PremiumEmptyState
            eyebrow="Project index"
            heading="Case studies will appear here once projects are published."
            explanation="This index is ready for genuine project work, with space for a clear problem, approach, and outcome."
            action={{ label: "Start a conversation", to: "/contact" }}
            atmosphere="mist"
          />
        ) : (
          <ul className="space-y-3">
            {projects.map((p, i) => {
              const row = (
                <>
                  <span className="font-mono text-xs text-quiet-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xl font-medium leading-tight tracking-[-0.03em] text-foreground sm:text-2xl">
                    {p.title ?? "Untitled"}
                  </span>
                  <span className="col-span-2 col-start-2 text-sm leading-6 text-muted-foreground md:col-span-1 md:col-start-auto md:max-w-md">
                    {p.summary ?? ""}
                  </span>
                  <span className="col-start-3 row-start-1 inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-inset text-foreground-soft transition-[border-color,color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-accent-muted group-hover:text-accent md:col-start-auto md:row-start-auto">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </>
              );

              const gridClass =
                "focus-ring group grid min-h-28 grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-4 rounded-[var(--radius-card)] border border-border bg-surface-1 px-5 py-6 shadow-[var(--shadow-xs)] transition-[border-color,background-color,transform,box-shadow] hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-2 hover:shadow-[var(--shadow-sm)] md:grid-cols-[3rem_minmax(12rem,0.9fr)_minmax(16rem,1.1fr)_auto] md:gap-8 md:px-8";

              return (
                <li key={p.id}>
                  {p.slug ? (
                    <Link to="/projects/$slug" params={{ slug: p.slug }} className={gridClass}>
                      {row}
                    </Link>
                  ) : (
                    <div className={gridClass}>{row}</div>
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
