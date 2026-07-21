import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { PoeticAtmosphere } from "@/components/poetic-atmosphere";
import { ProjectEnquiryForm } from "@/components/project-enquiry-form";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/lib/content";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — [Your Name]" },
      {
        name: "description",
        content: "Get in touch with [Your Name] about applied AI product work, collaborations or writing.",
      },
      { property: "og:title", content: "Contact — [Your Name]" },
      { property: "og:description", content: "Get in touch about applied AI product work." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden">
        <PoeticAtmosphere variant="horizon" />
        <div className="container-wide relative z-10 pb-16 pt-20 md:pb-24 md:pt-32">
          <p className="eyebrow text-accent">Contact</p>
          <h1 className="mt-6 max-w-4xl text-[clamp(3.5rem,7vw,6.75rem)] leading-[0.96] tracking-[-0.06em]">
            Begin with the shape of an idea.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-foreground-soft md:text-xl md:leading-9">
            Use the project pathway to structure a potential brief, or reach out directly for a general conversation.
          </p>
        </div>
      </section>

      <section className="container-wide pb-24 md:pb-36">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.62fr)] lg:items-start lg:gap-12">
          <ProjectEnquiryForm />

          <aside className="space-y-6" aria-label="General contact">
            <div className="surface-card p-6 sm:p-8">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-accent-muted/40 bg-accent/5 text-accent" aria-hidden>
                <Mail className="h-5 w-5" />
              </span>
              <p className="eyebrow mt-6 text-mint">General contact</p>
              <h2 className="mt-4 text-2xl tracking-[-0.035em]">Prefer a simple note?</h2>
              <p className="mt-4 text-base leading-7 text-foreground-soft">
                For collaborations, writing, or a conversation that does not need a project brief, use the direct email pathway.
              </p>
              <a href={`mailto:${SITE.email}`} className="button-secondary focus-ring mt-7 w-full break-all">
                {SITE.email}
              </a>
            </div>

            <div className="rounded-[var(--radius-card)] border border-border-subtle bg-surface-inset p-6 sm:p-8">
              <p className="eyebrow">Contact details</p>
              <dl className="mt-5 space-y-5 text-sm">
                <div>
                  <dt className="text-muted-foreground">Based in</dt>
                  <dd className="mt-1 text-foreground-soft">{SITE.location}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Elsewhere</dt>
                  <dd className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                    <a href="#" className="focus-ring rounded-md text-foreground-soft transition-colors hover:text-accent">{SITE.github}</a>
                    <a href="#" className="focus-ring rounded-md text-foreground-soft transition-colors hover:text-accent">{SITE.twitter}</a>
                    <a href="#" className="focus-ring rounded-md text-foreground-soft transition-colors hover:text-accent">{SITE.linkedin}</a>
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
