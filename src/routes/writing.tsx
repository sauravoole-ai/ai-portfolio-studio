import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/writing")({
  head: () => ({
    meta: [
      { title: "Writing & Build Logs — [Your Name]" },
      {
        name: "description",
        content: "Essays, notes and build logs on applied AI, product craft and shipping.",
      },
      { property: "og:title", content: "Writing & Build Logs — [Your Name]" },
      {
        property: "og:description",
        content: "Essays, notes and build logs on applied AI and product craft.",
      },
    ],
  }),
  component: WritingLayout,
});

function WritingLayout() {
  const matches = useMatches();
  if (matches.some((m) => m.routeId === "/writing/$slug")) return <Outlet />;

  return (
    <SiteShell>
      <section className="work-route-intro journal-route-intro animate-rise">
        <div className="container-editorial work-route-intro__inner">
          <div className="work-route-intro__copy">
            <p className="eyebrow text-accent">Writing · Build logs · Notes</p>
            <h1 className="mt-6 text-5xl leading-[0.98] tracking-[-0.05em] sm:text-6xl md:text-7xl">
              From the workbench.
            </h1>
            <p className="mt-7 text-lg leading-8 text-foreground-soft md:text-xl md:leading-9">
              Long essays about the craft of applied AI, short build logs from projects in flight,
              and notes kept in public.
            </p>
          </div>

          <figure className="work-route-intro__visual">
            <img
              src="/journal-route-visual.webp"
              alt="A young boy sits beside a forest pond in soft rain."
              width={1536}
              height={1024}
            />
          </figure>
        </div>
      </section>
      <section className="journal-empty-index container-editorial pb-16 md:pb-24">
        <div className="journal-empty-notice">
          <p className="eyebrow text-accent">Publishing index</p>
          <h2 className="mt-4 text-2xl leading-tight tracking-[-0.035em] sm:text-3xl">
            Essays, build logs, and notes will appear here when they are ready.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-foreground-soft">
            This space is reserved for genuine writing from the workbench; nothing has been
            published yet.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
