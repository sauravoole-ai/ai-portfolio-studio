import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteShell, PageHeader } from "@/components/site-shell";
import { projects } from "@/lib/content";

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
  component: ProjectsLayout,
});

function ProjectsLayout() {
  const matches = useMatches();
  const isChild = matches.some((m) => m.routeId === "/projects/$slug");
  if (isChild) return <Outlet />;

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Projects · 2023–2026"
        title="Selected work, considered."
        lede="A small, curated set of AI products I've designed, engineered or shipped. Each has a short case study — problem, approach, outcome."
      />
      <section className="container-editorial pb-24">
        <ul className="divide-y divide-border border-y border-border">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <Link
                to="/projects/$slug"
                params={{ slug: p.slug }}
                className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 py-8 md:grid-cols-[6ch_minmax(0,1.6fr)_minmax(0,2fr)_10ch_auto] md:gap-8"
              >
                <span className="font-mono text-xs text-muted-foreground md:text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="col-span-2 md:col-span-1 font-display text-2xl leading-tight md:text-3xl">
                  {p.name}
                </span>
                <span className="hidden max-w-md text-sm text-muted-foreground md:block">
                  {p.tagline}
                </span>
                <span className="hidden font-mono text-xs text-muted-foreground md:block">
                  {p.status}
                </span>
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono">{p.year}</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </SiteShell>
  );
}
