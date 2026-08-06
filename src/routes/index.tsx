import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/lib/content";
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
          "A creative product studio where applied AI, thoughtful craft, and useful digital work meet.",
      },
      { property: "og:title", content: `${SITE.name} — ${SITE.role}` },
      {
        property: "og:description",
        content: "Applied AI, product craft, and creative practice brought together with care.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(projectsQueryOptions),
  component: Home,
});

function Home() {
  return (
    <SiteShell>
      <div className="home-page">
        <div className="home-page__backdrop" aria-hidden />
        <section className="home-entry relative isolate flex min-h-[calc(100svh-5.25rem)] overflow-hidden">
          <div className="home-entry__wash absolute inset-0" aria-hidden />

          <div className="container-wide relative z-10 flex min-h-full flex-1 items-start pb-20 pt-16 sm:items-center sm:py-24 md:py-28 lg:py-32">
            <div className="home-entry__copy animate-rise w-full max-w-[42rem]">
              <p className="eyebrow text-foreground-soft/85">{SITE.role}</p>
              <h1 className="mt-5 max-w-[12.5ch] text-[clamp(2.35rem,5.2vw,4.75rem)] font-normal leading-[1.01] tracking-[-0.045em] text-foreground/92 sm:mt-6">
                Modern work, shaped with{" "}
                <span className="font-display font-normal italic tracking-[-0.02em] text-accent/78">
                  quieter intelligence.
                </span>
              </h1>
              <p className="mt-6 max-w-[30rem] text-sm leading-6 text-foreground-soft/82 sm:mt-7 sm:text-base sm:leading-7">
                Applied AI, product craft, and creative practice—brought together with care.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 sm:mt-9">
                <Link to="/projects" className="home-entry__primary-action button-primary focus-ring group">
                  View work
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>

          <div
            className="home-entry__cue pointer-events-none absolute bottom-5 right-[var(--gutter)] z-10 hidden items-center gap-3 text-quiet-foreground sm:flex"
            aria-hidden
          >
            <span className="h-px w-10 bg-current" />
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em]">Continue</span>
          </div>
        </section>

        <section className="home-studio-note relative isolate overflow-hidden">
          <div className="container-wide relative z-10 pb-20 pt-28 sm:pb-28 sm:pt-36 lg:pb-32 lg:pt-44">
            <div className="grid gap-8 md:grid-cols-[minmax(10rem,0.42fr)_minmax(0,1fr)] md:gap-16 lg:gap-24">
              <p className="eyebrow text-mint md:pt-2">A studio between worlds</p>
              <div className="max-w-3xl">
                <h2 className="text-[clamp(2.35rem,5.5vw,5rem)] leading-[1.02] tracking-[-0.052em]">
                  Rooted enough to listen.{" "}
                  <span className="font-display font-normal italic text-foreground-soft">
                    Modern enough to make.
                  </span>
                </h2>
                <p className="mt-7 max-w-2xl text-base leading-7 text-foreground-soft sm:text-lg sm:leading-8">
                  The work begins with attention—to context, to people, and to what is genuinely
                  worth bringing into the world. Technology follows that direction, not the other
                  way around.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
