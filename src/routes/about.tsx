import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/lib/content";
import { capabilities } from "@/lib/content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About — ${SITE.name}` },
      {
        name: "description",
        content: `About ${SITE.name} — background and approach as an AI Product Builder.`,
      },
      { property: "og:title", content: `About — ${SITE.name}` },
      { property: "og:description", content: "Background and approach." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteShell>
      <section className="work-route-intro about-route-intro animate-rise">
        <div className="container-editorial work-route-intro__inner">
          <div className="work-route-intro__copy">
            <p className="eyebrow text-accent">About</p>
            <h1 className="mt-6 text-5xl leading-[0.98] tracking-[-0.05em] sm:text-6xl md:text-7xl">
              {SITE.role}
            </h1>
            <p className="mt-7 text-lg leading-8 text-foreground-soft md:text-xl md:leading-9">
              {SITE.name} — {SITE.role}. {SITE.tagline}
            </p>
          </div>

          <figure className="work-route-intro__visual">
            <img
              src="/about-route-visual.webp"
              alt="A young boy follows a winding rural road beneath diffused moonlight."
              width={1536}
              height={1024}
            />
          </figure>
        </div>
      </section>

      <section className="about-editorial-section about-biography container-editorial grid gap-8 pb-16 md:grid-cols-[16ch_minmax(0,1fr)] md:gap-16">
        <h2 className="eyebrow md:pt-2">Biography</h2>
        <div className="about-biography__copy max-w-2xl space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>I’m Saurav Kumar Jha, an AI Product Builder focused on turning ideas into functional AI products.</p>
          <p>My work currently spans AI applications, workflow-driven systems, and AIoT projects, with an emphasis on building complete products rather than isolated experiments.</p>
          <p>I’m currently pursuing a B.Tech in Electronics and Communication Engineering at Tezpur University, with interests spanning AI, software, and connected systems.</p>
          <p>I’m particularly interested in the product side of AI—how an idea moves from a use case to a working interface, backend, and deployed experience.</p>
          <p>I use AI tools and APIs pragmatically, focusing on the product around the AI—not just the model output.</p>
          <p>I like turning ideas—whether driven by practical needs or creative exploration—from rough sketches into usable applications.</p>
          <p>I’m still learning and refining that process, with each project helping me understand better what makes an AI product useful, usable, and worth building.</p>
        </div>
      </section>

      <section className="about-editorial-section about-principles border-t border-border">
        <div className="about-editorial-section__grid container-editorial grid gap-12 py-16 md:grid-cols-[16ch_minmax(0,1fr)] md:gap-16 md:py-24">
          <h2 className="eyebrow md:pt-2">Principles</h2>
          <ol className="max-w-2xl space-y-10">
            {[
              ["Clarity before complexity", "Start with what the product actually needs to do before adding tools, layers, or features."],
              ["Function before flourish", "Visual polish matters, but it should support usability rather than distract from it."],
              ["Build, test, refine", "Treat the first version as a working starting point and improve it through use, feedback, and iteration."],
            ].map(([title, description], index) => (
              <li key={title} className="about-principles__item grid grid-cols-[3ch_1fr] gap-4">
                <span className="pt-2 font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-2xl font-medium leading-snug tracking-[-0.035em]">{title}</p>
                  <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="about-editorial-section about-process border-t border-border-subtle bg-surface-inset/55">
        <div className="about-editorial-section__grid container-editorial grid gap-8 py-16 md:grid-cols-[16ch_minmax(0,1fr)] md:gap-16 md:py-24">
          <h2 className="eyebrow text-mint md:pt-2">Working process</h2>
          <div className="max-w-2xl space-y-8">
            {[
              ["Understand", "Clarify the idea, user need, and what the product should actually do."],
              ["Build", "Turn that into a working version using the tools and stack that fit the problem."],
              ["Refine", "Test the product, remove friction, and improve what matters."],
            ].map(([stage, description], index) => (
              <div key={stage} className="about-process__stage grid grid-cols-[3ch_minmax(0,1fr)] gap-4 border-b border-border-subtle pb-8 last:border-0 last:pb-0">
                <span className="pt-1 font-mono text-xs text-quiet-foreground">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-xl font-medium tracking-[-0.03em]">{stage}</h3>
                  <p className="mt-2 text-base leading-7 text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-editorial-section about-capabilities border-t border-border-subtle">
        <div className="about-editorial-section__grid container-editorial grid gap-8 py-16 md:grid-cols-[16ch_minmax(0,1fr)] md:gap-16 md:py-24">
          <h2 className="eyebrow text-violet md:pt-2">Capabilities</h2>
          <div className="about-capabilities__grid grid max-w-3xl gap-10 sm:grid-cols-3">
            {capabilities.map((group) => (
              <div key={group.heading}>
                <h3 className="text-lg font-medium tracking-[-0.025em]">{group.heading}</h3>
                <p className="mt-5 text-sm leading-6 text-muted-foreground">{group.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-editorial-section about-journey border-t border-border-subtle">
        <div className="about-editorial-section__grid container-editorial grid gap-8 py-16 md:grid-cols-[16ch_minmax(0,1fr)] md:gap-16 md:py-24">
          <h2 className="eyebrow md:pt-2">Professional journey</h2>
          <div className="about-journey__record max-w-2xl space-y-10 border-y border-border-subtle py-10">
            {[
              ["B.Tech — Electronics & Communication Engineering", "Tezpur University. Academic foundation in electronics and communication, alongside a growing focus on AI product development."],
              ["AI Web Development Internship — InAmigos Foundation", "Worked on AI-assisted web development tasks and digital product exercises in an NGO environment."],
              ["Independent AI Product Work", "Building and deploying AI applications across LLM integration, retrieval, AI-assisted development, and AIoT-oriented projects."],
            ].map(([title, description]) => (
              <div key={title}>
                <h3 className="text-2xl font-medium tracking-[-0.035em]">{title}</h3>
                <p className="mt-4 text-base leading-7 text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-contact-cta border-t border-border">
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
