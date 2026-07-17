import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site-shell";
import { posts } from "@/lib/content";

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
  component: WritingIndex,
});

function WritingIndex() {
  const matches = useMatches();
  if (matches.some((m) => m.routeId === "/writing/$slug")) return <Outlet />;

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Writing · Build logs · Notes"
        title="From the workbench."
        lede="Long essays about the craft of applied AI, short build logs from projects in flight, and half-formed notes I'd rather keep in public than lose."
      />
      <section className="container-editorial pb-24">
        <ul className="divide-y divide-border border-y border-border">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                to="/writing/$slug"
                params={{ slug: post.slug }}
                className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 py-8 md:grid-cols-[12ch_minmax(0,1fr)_14ch] md:gap-10"
              >
                <div className="col-span-2 md:col-span-1 flex items-center gap-3">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--terracotta)]" />
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {post.kind}
                  </span>
                </div>
                <div>
                  <p className="font-display text-2xl leading-snug md:text-3xl group-hover:text-[color:var(--terracotta)] transition-colors">
                    {post.title}
                  </p>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground md:text-right">
                  {post.date}
                  <span className="mx-2">·</span>
                  {post.readingTime}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </SiteShell>
  );
}
