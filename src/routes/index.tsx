import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { BookingCTA } from "@/components/booking-cta";
import { PoeticAtmosphere } from "@/components/poetic-atmosphere";
import { PremiumEmptyState } from "@/components/premium-empty-state";
import { ServicePathways } from "@/components/service-pathways";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/lib/content";
import { listPublishedProjects } from "@/lib/projects.functions";

const projectsQueryOptions = queryOptions({
  queryKey: ["projects", "published"],
  queryFn: () => listPublishedProjects(),
});

const signals = [
  "Deployed AI applications",
  "API integrations",
  "AI-assisted development",
] as const;

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
      <section className="relative overflow-hidden">
        <PoeticAtmosphere variant="horizon" />
        <div className="container-wide relative z-10 pb-24 pt-20 sm:pt-28 md:pb-36 md:pt-40 lg:pb-44 lg:pt-48">
          <div className="grid items-end gap-14 lg:grid-cols-[minmax(0,1.65fr)_minmax(19rem,0.72fr)] lg:gap-20">
            <div className="animate-rise">
              <div className="inline-flex min-h-9 items-center gap-3 rounded-full border border-accent-muted/40 bg-accent/5 px-4 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_14px_oklch(0.79_0.125_194/0.45)]" aria-hidden />
                <p className="eyebrow text-foreground-soft">{SITE.role}</p>
              </div>
              <h1 className="mt-8 max-w-[12ch] text-[clamp(3.5rem,8vw,7.5rem)] font-medium leading-[0.94] tracking-[-0.065em] text-foreground">
                Designing and shipping{" "}
                <span className="font-display font-normal italic tracking-[-0.035em] text-accent">AI products</span>{" "}
                that solve real problems.
              </h1>
              <p className="mt-9 max-w-2xl text-lg leading-8 text-foreground-soft sm:text-xl sm:leading-9">
                I turn complex AI capabilities into useful, reliable products — from early prototypes and API integrations to production interfaces people actually want to use.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link to="/projects" className="button-primary focus-ring group">
                  View projects
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link to="/contact" className="button-secondary focus-ring group">
                  Discuss a project
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            <aside className="surface-feature relative overflow-hidden p-6 sm:p-8" aria-label="Current focus">
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-4">
                  <p className="eyebrow text-accent">Build signal</p>
                  <span className="rounded-full border border-mint/25 bg-mint/5 px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-mint">
                    Product · AI
                  </span>
                </div>
                <p className="mt-8 max-w-xs text-xl font-medium leading-7 tracking-[-0.025em] text-foreground">
                  From model capability to a product people can trust and use.
                </p>
                <ul className="mt-8 divide-y divide-border-subtle border-y border-border-subtle">
                  {signals.map((signal, index) => (
                    <li key={signal} className="flex min-h-14 items-center gap-4 py-3">
                      <span className="font-mono text-xs text-quiet-foreground">0{index + 1}</span>
                      <span className="text-sm font-medium text-foreground-soft">{signal}</span>
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent-muted" aria-hidden />
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-t border-border-subtle">
        <div className="container-wide section-rhythm">
          <SectionHeading eyebrow="Selected projects" title="Recent work." action="View all projects" to="/projects" />
          {featured.length === 0 ? (
            <div className="mt-12 md:mt-16">
              <PremiumEmptyState
                eyebrow="Project index"
                heading="Case studies will appear here once projects are published."
                explanation="The portfolio is structured for considered product work, with space for the problem, approach, and outcome."
                action={{ label: "Start a conversation", to: "/contact" }}
              />
            </div>
          ) : (
            <ProjectPreview projects={featured} />
          )}
        </div>
      </section>

      <section className="border-t border-border-subtle bg-surface-inset/55">
        <div className="container-wide section-rhythm">
          <div className="grid gap-12 lg:grid-cols-[0.62fr_1.38fr] lg:gap-24">
            <div>
              <p className="eyebrow text-mint">Ways to collaborate</p>
              <h2 className="mt-5 max-w-lg text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] tracking-[-0.05em]">
                Different paths into the work.
              </h2>
              <p className="mt-6 max-w-md text-lg leading-8 text-foreground-soft">
                Broad directions for exploring product, workflow, and creative digital ideas together.
              </p>
            </div>
            <ServicePathways />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-border-subtle">
        <PoeticAtmosphere variant="mist" />
        <div className="container-wide section-rhythm relative z-10">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-24">
            <div>
              <p className="eyebrow text-violet">Writing and creative publishing</p>
              <h2 className="mt-5 max-w-3xl text-[clamp(2.5rem,5vw,4.75rem)] leading-[1.02] tracking-[-0.055em]">
                A place for ideas in more than one form.
              </h2>
            </div>
            <div>
              <p className="text-lg leading-8 text-foreground-soft">
                This is an evolving publishing space for essays, build logs, images, audio, and video. Publications will appear when genuine work is ready to share.
              </p>
              <Link to="/writing" className="focus-ring group mt-6 inline-flex min-h-12 items-center gap-2 rounded-lg text-sm font-medium text-foreground transition-colors hover:text-accent">
                Visit writing
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border-subtle">
        <div className="container-wide section-rhythm">
          <BookingCTA variant="collaboration" />
        </div>
      </section>
    </SiteShell>
  );
}

function SectionHeading({ eyebrow, title, action, to }: { eyebrow: string; title: string; action: string; to: "/projects" }) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="eyebrow text-accent">{eyebrow}</p>
        <h2 className="mt-4 text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-[-0.055em]">{title}</h2>
      </div>
      <Link to={to} className="focus-ring group inline-flex min-h-12 items-center gap-2 self-start rounded-lg text-sm font-medium text-foreground-soft transition-colors hover:text-accent sm:self-auto">
        {action}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

function ProjectPreview({ projects }: { projects: Awaited<ReturnType<typeof listPublishedProjects>> }) {
  return (
    <ul className="mt-12 space-y-3 md:mt-16">
      {projects.map((project, index) => {
        const content = (
          <>
            <span className="font-mono text-xs text-quiet-foreground">{String(index + 1).padStart(2, "0")}</span>
            <span className="text-xl font-medium leading-tight tracking-[-0.03em] text-foreground sm:text-2xl">{project.title ?? "Untitled"}</span>
            <span className="col-span-2 col-start-2 text-sm leading-6 text-muted-foreground md:col-span-1 md:col-start-auto md:max-w-md">{project.summary ?? ""}</span>
            <span className="col-start-3 row-start-1 inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-inset text-foreground-soft transition-[border-color,color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-accent-muted group-hover:text-accent md:col-start-auto md:row-start-auto">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </>
        );
        const className = "focus-ring group grid min-h-28 grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-4 rounded-[var(--radius-card)] border border-border bg-surface-1 px-5 py-6 shadow-[var(--shadow-xs)] transition-[border-color,background-color,transform,box-shadow] hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-2 hover:shadow-[var(--shadow-sm)] md:grid-cols-[3rem_minmax(12rem,0.9fr)_minmax(16rem,1.1fr)_auto] md:gap-8 md:px-8";
        return (
          <li key={project.id}>
            {project.slug ? <Link to="/projects/$slug" params={{ slug: project.slug }} className={className}>{content}</Link> : <div className={className}>{content}</div>}
          </li>
        );
      })}
    </ul>
  );
}
