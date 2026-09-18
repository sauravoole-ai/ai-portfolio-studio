import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { BookingCTA } from "@/components/booking-cta";
import { ServicePathways } from "@/components/service-pathways";
import { SiteShell } from "@/components/site-shell";
import { listPublishedProjects } from "@/lib/projects.functions";
import { selectLauncherProducts } from "@/lib/projects.logic";
import { useSiteProfile } from "@/lib/site-profile";
import { buildPublicPageHead, HOME_DESCRIPTION, HOME_TITLE } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => {
    const publicPageHead = buildPublicPageHead({ path: "/", title: HOME_TITLE, description: HOME_DESCRIPTION });

    return {
      ...publicPageHead,
      links: [
        ...publicPageHead.links,
        { rel: "preload", href: "/home-studio-master-hq.webp", as: "image", type: "image/webp", fetchPriority: "high" },
      ],
    };
  },
  component: Home,
});

function Home() {
  const profile = useSiteProfile();
  const [productsOpen, setProductsOpen] = useState(false);
  const projects = useQuery({
    queryKey: ["projects", "published"],
    queryFn: () => listPublishedProjects(),
  });
  const launcherProducts = selectLauncherProducts(projects.data ?? []);
  const launcherPanelId = "homepage-product-launcher";
  return (
    <SiteShell>
      <div className="home-page">
        <div className="home-page__backdrop" aria-hidden />
        <section className="home-entry relative isolate flex min-h-[calc(100svh-5.25rem)] overflow-hidden">
          <div className="home-entry__wash absolute inset-0" aria-hidden />

          <div className="home-entry__inner container-wide relative z-10 flex min-h-full flex-1 items-start pb-20 pt-16 sm:items-center sm:py-24 md:py-28 lg:py-32">
            <div className="home-entry__copy animate-rise w-full max-w-[42rem]">
              <h1 className="max-w-[13ch] font-sans text-[clamp(2.35rem,5vw,4.5rem)] font-medium leading-[1.04] tracking-[-0.045em] text-foreground/92">
                {profile.hero_tagline}
              </h1>
              <p className="mt-6 max-w-[30rem] text-sm leading-6 text-foreground-soft/82 sm:mt-7 sm:text-base sm:leading-7">
                {profile.hero_supporting}
              </p>
              <div className="mt-8 sm:mt-9">
                <button
                  type="button"
                  className="home-entry__primary-action button-primary focus-ring group"
                  aria-expanded={productsOpen}
                  aria-controls={launcherPanelId}
                  onClick={() => setProductsOpen((open) => !open)}
                >
                  View products
                  <ChevronDown className={`h-4 w-4 transition-transform${productsOpen ? " rotate-180" : ""}`} aria-hidden />
                </button>
                {productsOpen ? (
                  <div id={launcherPanelId} className="home-product-launcher" aria-live="polite">
                    <p className="home-product-launcher__label">Live products</p>
                    {projects.isPending ? <p className="home-product-launcher__status">Loading products…</p> : null}
                    {projects.isError ? (
                      <p className="home-product-launcher__status">
                        Products are temporarily unavailable. <Link to="/projects">Explore Work</Link>
                      </p>
                    ) : null}
                    {projects.isSuccess && launcherProducts.length === 0 ? (
                      <p className="home-product-launcher__status">No live products are available right now.</p>
                    ) : null}
                    {launcherProducts.length > 0 ? (
                      <div className="home-product-launcher__links">
                        {launcherProducts.map((project) => (
                          <a
                            key={project.id}
                            className="home-product-launcher__link focus-ring group"
                            href={project.live_url!}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>{project.title ?? "Untitled product"}</span>
                            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

        </section>

        <section className="home-bridge relative isolate overflow-hidden">
          <div className="home-bridge__wash absolute inset-0" aria-hidden />
          <div className="home-bridge__inner container-wide relative z-10 py-20 sm:py-24 md:py-28">
            <p className="home-bridge__statement max-w-3xl font-sans text-[clamp(1.45rem,2.7vw,2.35rem)] font-medium leading-[1.3] tracking-[-0.035em] text-foreground-soft">
              {profile.home_bridge_text}
            </p>
            <div className="home-bridge__paths mt-14 grid gap-10 border-t border-border-subtle pt-9 sm:grid-cols-2 sm:gap-12 md:mt-16 md:pt-10">
              <Link to="/projects" className="home-bridge__path home-bridge__path--work focus-ring group rounded-md">
                <span className="text-xl font-semibold tracking-[-0.025em] text-foreground">Work</span>
                <span className="mt-3 block max-w-md text-sm leading-6 text-foreground-soft sm:text-base sm:leading-7">{profile.home_work_blurb}</span>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent">Explore work <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden /></span>
              </Link>
              <Link to="/writing" className="home-bridge__path focus-ring group rounded-md">
                <span className="text-lg font-medium tracking-[-0.02em] text-foreground-soft">Journal</span>
                <span className="mt-3 block max-w-md text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">{profile.home_journal_blurb}</span>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground-soft">Read journal <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden /></span>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-border-subtle bg-surface-inset/45">
          <div className="container-wide section-rhythm">
            <div className="grid gap-12 lg:grid-cols-[0.62fr_1.38fr] lg:gap-24">
              <div>
                <p className="eyebrow text-mint">Ways to collaborate</p>
                <h2 className="mt-5 max-w-lg text-[clamp(2.35rem,5vw,4.25rem)] leading-[1.03] tracking-[-0.05em]">
                  Different paths into the work.
                </h2>
                <p className="mt-6 max-w-md text-base leading-7 text-foreground-soft sm:text-lg sm:leading-8">
                  Broad directions for exploring product, workflow, and creative digital ideas together.
                </p>
              </div>
              <ServicePathways />
            </div>
          </div>
        </section>

        <section className="border-t border-border-subtle">
          <div className="container-wide section-rhythm">
            <BookingCTA variant="collaboration" />
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
