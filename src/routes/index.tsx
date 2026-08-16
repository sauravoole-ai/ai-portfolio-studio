import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/lib/content";
import { listPublishedProjects } from "@/lib/projects.functions";
import { listPublishedPosts } from "@/lib/posts.functions";
import { getProjectHighlights, selectFeaturedProjects, selectLatestGenuinePost } from "@/lib/apex.logic";

const projectsQueryOptions = queryOptions({
  queryKey: ["projects", "published"],
  queryFn: () => listPublishedProjects(),
});
const postsQueryOptions = queryOptions({ queryKey: ["posts", "published"], queryFn: () => listPublishedPosts() });

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE.name} — ${SITE.role}` },
      {
        name: "description",
        content: `${SITE.name}, ${SITE.role}. ${SITE.tagline}`,
      },
      { property: "og:title", content: `${SITE.name} — ${SITE.role}` },
      {
        property: "og:description",
        content: SITE.tagline,
      },
    ],
  }),
  loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(projectsQueryOptions), context.queryClient.ensureQueryData(postsQueryOptions)]),
  component: Home,
});

function Home() {
  const { data: projects } = useSuspenseQuery(projectsQueryOptions);
  const { data: posts } = useSuspenseQuery(postsQueryOptions);
  const featuredProjects = selectFeaturedProjects(projects);
  const latestPost = selectLatestGenuinePost(posts);
  return (
    <SiteShell>
      <div className="home-page">
        <div className="home-page__backdrop" aria-hidden />
        <section className="home-entry relative isolate flex min-h-[calc(100svh-5.25rem)] overflow-hidden">
          <div className="home-entry__wash absolute inset-0" aria-hidden />

          <div className="container-wide relative z-10 flex min-h-full flex-1 items-start pb-20 pt-16 sm:items-center sm:py-24 md:py-28 lg:py-32">
            <div className="home-entry__copy animate-rise w-full max-w-[42rem]">
              <h1 className="max-w-[12.5ch] text-[clamp(2.35rem,5.2vw,4.75rem)] font-normal leading-[1.01] tracking-[-0.045em] text-foreground/92">
                {SITE.tagline}
              </h1>
              <p className="mt-6 max-w-[30rem] text-sm leading-6 text-foreground-soft/82 sm:mt-7 sm:text-base sm:leading-7">
                A personal space for products, writing, experiments, and ideas in progress.
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
              <p className="eyebrow text-mint md:pt-2">Projects and notes</p>
              <div className="max-w-3xl">
                <h2 className="text-[clamp(2.35rem,5.5vw,5rem)] leading-[1.02] tracking-[-0.052em]">
                  Projects, writing,{" "}
                  <span className="font-display font-normal italic text-foreground-soft">
                    and experiments.
                  </span>
                </h2>
                <p className="mt-7 max-w-2xl text-base leading-7 text-foreground-soft sm:text-lg sm:leading-8">
                  A growing home for case studies, notes, observations, and occasional creative
                  work alongside the products themselves.
                </p>
              </div>
            </div>
          </div>
        </section>

        {featuredProjects.length ? <section className="home-index-section border-t border-border-subtle">
          <div className="container-editorial py-20 md:py-28">
            <div className="home-index-section__heading"><div><p className="eyebrow text-accent">Featured Work</p><h2 className="mt-4 text-3xl tracking-[-0.04em] md:text-4xl">Selected products.</h2></div><Link to="/projects" className="link-underline focus-ring rounded-md">View all work</Link></div>
            <ul className="home-featured-work mt-10">
              {featuredProjects.map((project, index) => {
                const title = project.title ?? "Untitled";
                const highlights = getProjectHighlights(title, project.stack);
                return <li key={project.id}><Link to="/projects/$slug" params={{ slug: project.slug ?? "" }} className="home-featured-work__item focus-ring group"><span className="font-mono text-xs text-quiet-foreground">{String(index + 1).padStart(2, "0")}</span><span><strong>{title}</strong>{project.summary ? <span>{project.summary}</span> : null}<small><b>{project.status}</b>{highlights.length ? ` · ${highlights.join(" · ")}` : ""}</small></span><ArrowRight className="h-4 w-4" aria-hidden /></Link></li>;
              })}
            </ul>
          </div>
        </section> : null}

        {latestPost ? <section className="home-index-section border-t border-border-subtle">
          <div className="container-editorial py-20 md:py-28">
            <div className="home-index-section__heading"><div><p className="eyebrow text-mint">Latest Journal</p><h2 className="mt-4 text-3xl tracking-[-0.04em] md:text-4xl">From the notebook.</h2></div><Link to="/writing" className="link-underline focus-ring rounded-md">Open Journal</Link></div>
            <Link to="/writing/$slug" params={{ slug: latestPost.slug }} className="home-latest-post focus-ring group mt-10"><div><p className="text-2xl font-medium tracking-[-0.035em] md:text-3xl">{latestPost.title}</p><p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">{latestPost.excerpt}</p></div><ArrowRight className="h-5 w-5" aria-hidden /></Link>
          </div>
        </section> : null}
      </div>
    </SiteShell>
  );
}
