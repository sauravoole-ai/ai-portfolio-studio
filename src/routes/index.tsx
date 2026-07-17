import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { SITE, projects, posts, skills } from "@/lib/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "[Your Name] — Applied AI Product Builder" },
      {
        name: "description",
        content:
          "Portfolio and writing of [Your Name], an applied AI product builder shipping considered software from prototype to production.",
      },
      { property: "og:title", content: "[Your Name] — Applied AI Product Builder" },
      {
        property: "og:description",
        content: "Selected AI projects, essays, and build logs.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = projects.slice(0, 3);
  const recent = posts.slice(0, 3);
  return (
    <SiteShell>
      {/* Hero */}
      <section className="container-editorial pt-20 pb-16 md:pt-32 md:pb-24 animate-rise">
        <p className="eyebrow">Portfolio · {SITE.location}</p>
        <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
          Building AI products that feel{" "}
          <em className="italic text-[color:var(--terracotta)]">considered</em>,
          not conjured.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          I'm [Your Name] — a product builder working on the interface layer of
          applied AI. I design, engineer and ship end-to-end: research through
          production surface. Currently taking a small number of collaborations
          for {new Date().getFullYear()}.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm">
          <Link to="/projects" className="link-underline">Selected work</Link>
          <Link to="/writing" className="link-underline">Writing & build logs</Link>
          <Link to="/contact" className="link-underline">Get in touch</Link>
        </div>
      </section>

      {/* Featured projects */}
      <section className="border-t border-border">
        <div className="container-editorial py-16 md:py-24">
          <div className="flex items-baseline justify-between gap-6">
            <div>
              <p className="eyebrow">Selected projects</p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">
                A few things I've shipped recently.
              </h2>
            </div>
            <Link to="/projects" className="hidden shrink-0 text-sm link-underline sm:inline">
              All projects →
            </Link>
          </div>

          <ul className="mt-12 divide-y divide-border border-y border-border">
            {featured.map((p, i) => (
              <li key={p.slug}>
                <Link
                  to="/projects/$slug"
                  params={{ slug: p.slug }}
                  className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-6 py-8 md:grid-cols-[6ch_minmax(0,1.5fr)_minmax(0,2fr)_auto] md:gap-10"
                >
                  <span className="font-mono text-xs text-muted-foreground md:text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="col-span-2 md:col-span-1 font-display text-2xl leading-tight md:text-3xl">
                    {p.name}
                  </span>
                  <span className="hidden text-sm text-muted-foreground md:block">
                    {p.tagline}
                  </span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">{p.year}</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Skills */}
      <section className="border-t border-border bg-secondary/40">
        <div className="container-editorial py-16 md:py-24">
          <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
            <div>
              <p className="eyebrow">Capabilities</p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">
                What I bring to a team.
              </h2>
              <p className="mt-4 max-w-sm text-sm text-muted-foreground">
                I'm most useful somewhere between product, design and ML —
                usually as an early hire or a trusted collaborator.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              {skills.map((group) => (
                <div key={group.heading}>
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-[color:var(--terracotta)]">
                    {group.heading}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {group.items.map((item) => (
                      <li key={item} className="leading-snug">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recent writing */}
      <section className="border-t border-border">
        <div className="container-editorial py-16 md:py-24">
          <div className="flex items-baseline justify-between gap-6">
            <div>
              <p className="eyebrow">Recent writing</p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">
                Notes from the workbench.
              </h2>
            </div>
            <Link to="/writing" className="hidden shrink-0 text-sm link-underline sm:inline">
              All writing →
            </Link>
          </div>
          <ul className="mt-12 divide-y divide-border border-y border-border">
            {recent.map((post) => (
              <li key={post.slug} className="py-6">
                <Link
                  to="/writing/$slug"
                  params={{ slug: post.slug }}
                  className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 md:grid-cols-[10ch_minmax(0,1fr)_auto] md:gap-10"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    {post.kind}
                  </span>
                  <span className="col-span-2 md:col-span-1 font-display text-xl leading-snug md:text-2xl">
                    {post.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {post.date} · {post.readingTime}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="container-editorial py-20 md:py-28">
          <div className="grid gap-8 md:grid-cols-[2fr_1fr] md:items-end">
            <h2 className="max-w-3xl font-display text-4xl leading-tight md:text-5xl">
              Working on something ambitious?{" "}
              <span className="text-muted-foreground">
                I'd like to hear about it.
              </span>
            </h2>
            <div className="flex flex-col items-start gap-3 md:items-end">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-foreground px-5 py-3 text-sm transition-colors hover:bg-foreground hover:text-background"
              >
                Start a conversation
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <span className="text-xs text-muted-foreground">
                Booking Q3–Q4 · Remote or NYC
              </span>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
