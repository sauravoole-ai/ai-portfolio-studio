import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site-shell";

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
      <PageHeader
        eyebrow="Writing · Build logs · Notes"
        title="From the workbench."
        lede="Long essays about the craft of applied AI, short build logs from projects in flight, and notes kept in public."
      />
      <section className="container-editorial pb-24">
        <p className="border-y border-border py-16 text-center text-sm text-muted-foreground">
          No essays or build logs have been published yet.
        </p>
      </section>
    </SiteShell>
  );
}
