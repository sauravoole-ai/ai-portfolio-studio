import { createFileRoute } from "@tanstack/react-router";
import { PoeticAtmosphere } from "@/components/poetic-atmosphere";
import { ProjectEnquiryForm } from "@/components/project-enquiry-form";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/lib/content";
import { useSiteProfile } from "@/lib/site-profile";
import { buildPublicPageHead } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => buildPublicPageHead({
    path: "/contact",
    title: `Contact — ${SITE.name}`,
    description: "Share what you’re looking to build, or send a general message.",
  }),
  component: Contact,
});

function Contact() {
  const profile = useSiteProfile();
  return (
    <SiteShell>
      <section className="work-route-intro connect-route-intro animate-rise">
        <PoeticAtmosphere variant="horizon" />
        <div className="container-wide work-route-intro__inner">
          <div className="connect-route-intro__copy">
            <h1 className="max-w-4xl font-sans text-[clamp(3rem,6vw,5.5rem)] font-medium leading-[0.98] tracking-[-0.05em]">
              Contact
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-foreground-soft md:text-xl md:leading-9">
              Share what you’re looking to build, or send a general message.
            </p>
          </div>

          <figure className="work-route-intro__visual">
            <img
              src="/connect-route-visual.webp"
              alt="A young boy holds a phone on a quiet rooftop overlooking a moonlit meadow."
              width={1536}
              height={1024}
            />
          </figure>
        </div>
      </section>

      <section className="contact-route-body container-wide pb-24 md:pb-36">
        <div className="contact-route-body__layout grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.62fr)] lg:items-start lg:gap-12">
          <ProjectEnquiryForm />

          <aside className="contact-route-details" aria-label="General contact">
            <p className="eyebrow">Based in</p>
            <p className="mt-3 text-sm leading-6 text-foreground-soft">{profile.location}</p>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
