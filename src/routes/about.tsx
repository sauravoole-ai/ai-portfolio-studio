import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site-shell";
import { SITE } from "@/lib/content";
import { capabilities } from "@/lib/content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — [Your Name]" },
      {
        name: "description",
        content: "About [Your Name] — background and approach as an applied AI product builder.",
      },
      { property: "og:title", content: "About — [Your Name]" },
      { property: "og:description", content: "Background and approach." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="About"
        title="Building software that respects the person using it."
        lede={`${SITE.name} — ${SITE.role}. This page is a structural placeholder ready for a real biography, principles and timeline.`}
      />

      <section className="container-editorial grid gap-8 pb-16 md:grid-cols-[16ch_minmax(0,1fr)] md:gap-16">
        <h2 className="eyebrow md:pt-2">Biography</h2>
        <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>[Short paragraph — who you are, what you build, and what you care about.]</p>
          <p>[Second paragraph — how you work, who you work with, and what you're currently focused on.]</p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container-editorial grid gap-12 py-16 md:grid-cols-[16ch_minmax(0,1fr)] md:gap-16 md:py-24">
          <h2 className="eyebrow md:pt-2">Principles</h2>
          <ol className="max-w-2xl space-y-10">
            {[1, 2, 3].map((i) => (
              <li key={i} className="grid grid-cols-[3ch_1fr] gap-4">
                <span className="pt-2 font-mono text-xs text-muted-foreground">
                  {String(i).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-2xl font-medium leading-snug tracking-[-0.035em]">[Principle {i}]</p>
                  <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                    [Short explanation of this principle and why it matters in your work.]
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border-subtle bg-surface-inset/55">
        <div className="container-editorial grid gap-8 py-16 md:grid-cols-[16ch_minmax(0,1fr)] md:gap-16 md:py-24">
          <h2 className="eyebrow text-mint md:pt-2">Working process</h2>
          <div className="max-w-2xl space-y-8">
            {["Understand", "Shape", "Build", "Learn"].map((stage, index) => (
              <div key={stage} className="grid grid-cols-[3ch_minmax(0,1fr)] gap-4 border-b border-border-subtle pb-8 last:border-0 last:pb-0">
                <span className="pt-1 font-mono text-xs text-quiet-foreground">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-xl font-medium tracking-[-0.03em]">[{stage} — process detail]</h3>
                  <p className="mt-2 text-base leading-7 text-muted-foreground">[Describe how this stage works without adding claims, outcomes, or client details.]</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border-subtle">
        <div className="container-editorial grid gap-8 py-16 md:grid-cols-[16ch_minmax(0,1fr)] md:gap-16 md:py-24">
          <h2 className="eyebrow text-violet md:pt-2">Capabilities</h2>
          <div className="grid max-w-3xl gap-10 sm:grid-cols-3">
            {capabilities.map((group) => (
              <div key={group.heading}>
                <h3 className="text-lg font-medium tracking-[-0.025em]">{group.heading}</h3>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
                  {group.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border-subtle">
        <div className="container-editorial grid gap-8 py-16 md:grid-cols-[16ch_minmax(0,1fr)] md:gap-16 md:py-24">
          <h2 className="eyebrow md:pt-2">Professional journey</h2>
          <div className="max-w-2xl border-y border-border-subtle py-10">
            <h3 className="text-2xl font-medium tracking-[-0.035em]">[Professional journey]</h3>
            <p className="mt-4 text-base leading-7 text-muted-foreground">[Add an honest chronology of roles, transitions, areas of focus, and current direction. No dates or achievements have been assumed.]</p>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container-editorial py-20 text-center md:py-28">
          <h2 className="mx-auto max-w-3xl text-3xl font-medium leading-tight tracking-[-0.045em] md:text-5xl">
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
