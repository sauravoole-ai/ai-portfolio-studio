import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site-shell";
import { SITE } from "@/lib/content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — [Your Name]" },
      {
        name: "description",
        content: "About [Your Name] — background, approach and current work as an applied AI product builder.",
      },
      { property: "og:title", content: "About — [Your Name]" },
      { property: "og:description", content: "Background, approach and current work." },
    ],
  }),
  component: About,
});

const timeline = [
  { year: "Now", title: "Independent, applied AI product work", body: "Advising and building for a small set of teams; open-source maintainer of [Project Name] Grove Agents." },
  { year: "2023", title: "Founding designer & engineer, an early-stage AI startup", body: "Shaped the product from research prototype to first paying customers. Led design engineering across web and desktop." },
  { year: "2020", title: "Product lead, developer tools", body: "Built tools used by internal engineering teams at a mid-sized fintech. Fell in love with interfaces that respect their users." },
  { year: "Earlier", title: "Design and journalism", body: "Studied design and worked briefly as a features writer. It shows in the writing." },
];

const principles = [
  { title: "Interface first, model second.", body: "Most AI products are bottlenecked by their surface, not their weights. Design the interaction first; choose the ingredient after." },
  { title: "Small teams, deep taste.", body: "I work best with two or three collaborators who care visibly about the details." },
  { title: "Ship, but respect the reader.", body: "Speed matters. So do typography, copy and defaults. They are the same craft." },
];

export default function About() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow={`About · ${SITE.location}`}
        title="I make software that respects the person using it."
        lede="I'm [Your Name] — a product builder working on applied AI. This is the long version of a very short story: I design, engineer and write about tools that treat their users like adults."
      />

      <section className="container-editorial grid gap-12 pb-16 md:grid-cols-[16ch_minmax(0,1fr)] md:gap-16">
        <h2 className="eyebrow md:pt-2">In one paragraph</h2>
        <div className="max-w-2xl space-y-6 text-lg leading-relaxed">
          <p>
            I've spent the last decade somewhere between design, engineering and
            research. The through-line has been building interfaces that feel
            considered — the kind you can hand a stranger without an onboarding
            tour. Applied AI is the most interesting design problem of the
            decade, precisely because most AI products are boring to use.
          </p>
          <p>
            I'm currently independent, taking on one or two collaborations per
            quarter and writing publicly about what I learn. When I'm not
            working I read too many long essays, cook, and take badly-composed
            photographs on a small camera.
          </p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container-editorial grid gap-12 py-16 md:grid-cols-[16ch_minmax(0,1fr)] md:gap-16 md:py-24">
          <h2 className="eyebrow md:pt-2">Principles</h2>
          <ol className="max-w-2xl space-y-8">
            {principles.map((p, i) => (
              <li key={p.title} className="grid grid-cols-[3ch_1fr] gap-4">
                <span className="font-mono text-xs text-muted-foreground pt-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-display text-2xl leading-snug">{p.title}</p>
                  <p className="mt-2 text-base text-muted-foreground leading-relaxed">
                    {p.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="container-editorial py-16 md:py-24">
          <p className="eyebrow">Timeline</p>
          <ul className="mt-10 space-y-8">
            {timeline.map((t) => (
              <li key={t.title} className="grid grid-cols-[8ch_minmax(0,1fr)] gap-6 md:grid-cols-[12ch_minmax(0,1fr)] md:gap-10">
                <span className="font-mono text-sm text-[color:var(--terracotta)]">{t.year}</span>
                <div className="max-w-2xl">
                  <p className="font-display text-xl md:text-2xl">{t.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container-editorial py-20 text-center md:py-28">
          <h2 className="mx-auto max-w-3xl font-display text-3xl leading-tight md:text-5xl">
            If any of this rhymes with a problem you're working on,{" "}
            <Link to="/contact" className="text-[color:var(--terracotta)] link-underline">
              I'd like to hear from you
            </Link>
            .
          </h2>
        </div>
      </section>
    </SiteShell>
  );
}
