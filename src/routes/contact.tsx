import { createFileRoute } from "@tanstack/react-router";
import { PoeticAtmosphere } from "@/components/poetic-atmosphere";
import { ProjectEnquiryForm } from "@/components/project-enquiry-form";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/lib/content";
import { useSiteProfile } from "@/lib/site-profile";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact — ${SITE.name}` },
      {
        name: "description",
        content: `Get in touch with ${SITE.name} about AI product work or collaboration.`,
      },
      { property: "og:title", content: `Contact — ${SITE.name}` },
      { property: "og:description", content: "Get in touch about applied AI product work." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const profile = useSiteProfile();
  const socialLinks = [
    { label: SITE.github, href: SITE.githubUrl },
    { label: SITE.linkedin, href: SITE.linkedinUrl },
    { label: SITE.instagram, href: SITE.instagramUrl },
  ] as const;

  return (
    <SiteShell>
      <section className="work-route-intro connect-route-intro animate-rise">
        <PoeticAtmosphere variant="horizon" />
        <div className="container-wide work-route-intro__inner">
          <div className="connect-route-intro__copy">
            <p className="eyebrow text-accent">Contact</p>
            <h1 className="mt-6 max-w-4xl text-[clamp(3.5rem,7vw,6.75rem)] leading-[0.96] tracking-[-0.06em]">
              Connect for work.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-foreground-soft md:text-xl md:leading-9">
              Have a project, collaboration, or opportunity in mind? Send a message through the
              form or use the links below.
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
            <div className="contact-route-details__surface rounded-[var(--radius-card)] border border-border-subtle bg-surface-inset p-6 sm:p-8">
              <p className="eyebrow">Contact details</p>
              <dl className="mt-5 space-y-5 text-sm">
                <div>
                  <dt className="text-muted-foreground">Based in</dt>
                  <dd className="mt-1 text-foreground-soft">{profile.location}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Education</dt>
                  <dd className="mt-1 text-foreground-soft">{profile.degree} · {profile.university} · {profile.graduation_year}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Elsewhere</dt>
                  <dd className="mt-2 flex flex-wrap gap-x-5">
                    {socialLinks.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-ring inline-flex min-h-11 items-center gap-1.5 rounded-md text-foreground-soft transition-[color,transform] hover:text-accent active:translate-y-px"
                      >
                        {item.label}
                        <span aria-hidden>↗</span>
                      </a>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
