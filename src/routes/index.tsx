import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/lib/content";
import { useSiteProfile } from "@/lib/site-profile";

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

          <div className="container-wide relative z-10 flex min-h-full flex-1 items-start pb-20 pt-16 sm:items-center sm:py-24 md:py-28 lg:py-32">
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
      </div>
    </SiteShell>
  );
}
