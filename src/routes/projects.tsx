import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
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
      <section className="container-editorial pb-24">
        {projects.length === 0 ? (
          <p className="border-y border-border py-16 text-center text-muted-foreground">
            No published projects yet.
          </p>
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {projects.map((p, i) => {
              const row = (
                <>
                  <span className="font-mono text-xs text-muted-foreground md:text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="col-span-2 md:col-span-1 font-display text-2xl leading-tight md:text-3xl">
                    {p.title ?? "Untitled"}
                  </span>
                  <span className="hidden max-w-md text-sm text-muted-foreground md:block">
                    {p.summary ?? ""}
                  </span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </>
              );

              const gridClass =
                "group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 py-8 md:grid-cols-[6ch_minmax(0,1.6fr)_minmax(0,2fr)_auto] md:gap-8";

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
