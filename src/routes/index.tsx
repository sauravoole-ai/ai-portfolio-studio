import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { useSiteProfile } from "@/lib/site-profile";
import { buildPublicPageHead, HOME_DESCRIPTION, HOME_TITLE } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => buildPublicPageHead({ path: "/", title: HOME_TITLE, description: HOME_DESCRIPTION }),
  component: Home,
});

function Home() {
  const profile = useSiteProfile();
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
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 sm:mt-9">
                <Link to="/projects" className="home-entry__primary-action button-primary focus-ring group">
                  View work
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
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
      </div>
    </SiteShell>
  );
}
