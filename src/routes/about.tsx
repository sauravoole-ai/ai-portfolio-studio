import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site-shell";
import { SITE } from "@/lib/content";

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

      <section className="container-editorial grid gap-12 pb-16 md:grid-cols-[16ch_minmax(0,1fr)] md:gap-16">
        <h2 className="eyebrow md:pt-2">Biography</h2>
        <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>[Short paragraph — who you are, what you build, and what you care about.]</p>
          <p>[Second paragraph — how you work, who you work with, and what you're currently focused on.]</p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container-editorial grid gap-12 py-16 md:grid-cols-[16ch_minmax(0,1fr)] md:gap-16 md:py-24">
          <h2 className="eyebrow md:pt-2">Principles</h2>
          <ol className="max-w-2xl space-y-8">
            {[1, 2, 3].map((i) => (
              <li key={i} className="grid grid-cols-[3ch_1fr] gap-4">
                <span className="pt-2 font-mono text-xs text-muted-foreground">
                  {String(i).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-display text-2xl leading-snug">[Principle {i}]</p>
                  <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                    [Short explanation of this principle and why it matters in your work.]
                  </p>
                </div>
              </li>
            ))}
          </ol>
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
