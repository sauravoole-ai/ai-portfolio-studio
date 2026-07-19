import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { SITE, capabilities } from "@/lib/content";
import { listPublishedProjects } from "@/lib/projects.functions";

const projectsQueryOptions = queryOptions({
  queryKey: ["projects", "published"],
  queryFn: () => listPublishedProjects(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE.name} — ${SITE.role}` },
      {
        name: "description",
        content:
          "Portfolio, writing and build logs of an applied AI product builder shipping considered software from prototype to production.",
      },
      { property: "og:title", content: `${SITE.name} — ${SITE.role}` },
      {
        property: "og:description",
        content: "Selected AI projects, essays, and build logs.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(projectsQueryOptions),
  component: Home,
});

function Home() {
  const { data: projects } = useSuspenseQuery(projectsQueryOptions);
  const featured = projects.slice(0, 3);

  return (
    <SiteShell>
      {/* Hero */}
      <section className="container-editorial pt-20 pb-16 md:pt-32 md:pb-24 animate-rise">
        <p className="eyebrow">{SITE.role}</p>
        <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
          Designing and shipping AI products that solve real problems.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          I turn complex AI capabilities into useful, reliable products — from
          early prototypes and API integrations to production interfaces people
          actually want to use.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            to="/projects"
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            View Projects
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            to="/writing"
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-foreground px-6 py-3 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
          >
            Read Build Logs
          </Link>
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-8 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--terracotta)]" />
            Deployed AI applications
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--terracotta)]" />
            API integrations
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--terracotta)]" />
            AI-assisted development
          </span>
        </div>
      </section>

      {/* Featured projects */}
      <section className="border-t border-border">
        <div className="container-editorial py-16 md:py-24">
          <div className="flex items-baseline justify-between gap-6">
            <div>
              <p className="eyebrow">Selected projects</p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">
                Recent work.
              </h2>
            </div>
            <Link to="/projects" className="focus-ring hidden shrink-0 rounded-sm text-sm link-underline sm:inline">
              All projects →
            </Link>
          </div>

          {featured.length === 0 ? (
            <p className="mt-12 border-y border-border py-16 text-center text-sm text-muted-foreground">
              Case studies will appear here once projects are published.
            </p>
          ) : (
            <ul className="mt-12 divide-y divide-border border-y border-border">
              {featured.map((p, i) => (
                <li key={p.id}>
                  {p.slug ? (
                    <Link
                      to="/projects/$slug"
                      params={{ slug: p.slug }}
                      className="focus-ring group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-6 rounded-sm py-8 md:grid-cols-[6ch_minmax(0,1.5fr)_minmax(0,2fr)_auto] md:gap-10"
                    >
                      <span className="font-mono text-xs text-muted-foreground md:text-sm">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="col-span-2 font-display text-2xl leading-tight md:col-span-1 md:text-3xl">
                        {p.title ?? "Untitled"}
                      </span>
                      <span className="hidden text-sm text-muted-foreground md:block">
                        {p.summary ?? ""}
                      </span>
                      <span className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-t border-border bg-secondary/40">
        <div className="container-editorial py-16 md:py-24">
          <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
            <div>
              <p className="eyebrow">Capabilities</p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">
                What I bring to a team.
              </h2>
              <p className="mt-4 max-w-sm text-sm text-muted-foreground">
                Most useful somewhere between product, design and applied ML.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              {capabilities.map((group) => (
                <div key={group.heading}>
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-[color:var(--terracotta)]">
                    {group.heading}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {group.items.map((item) => (
                      <li key={item} className="leading-snug">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="container-editorial py-20 md:py-28">
          <div className="grid gap-8 md:grid-cols-[2fr_1fr] md:items-end">
            <h2 className="max-w-3xl font-display text-4xl leading-tight md:text-5xl">
              Working on something ambitious?{" "}
              <span className="text-muted-foreground">
                I'd like to hear about it.
              </span>
            </h2>
            <div className="flex flex-col items-start gap-3 md:items-end">
              <Link
                to="/contact"
                className="focus-ring inline-flex items-center gap-2 rounded-full border border-foreground px-5 py-3 text-sm transition-colors hover:bg-foreground hover:text-background"
              >
                Start a conversation
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
