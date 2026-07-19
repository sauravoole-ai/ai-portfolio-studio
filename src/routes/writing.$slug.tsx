import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/writing/$slug")({
  loader: () => {
    // No writing store wired in yet — every slug is a not-found until
    // articles are published.
    throw notFound();
  },
  head: () => ({
    meta: [
      { title: "Not found — [Your Name]" },
      { name: "robots", content: "noindex" },
    ],
  }),
  notFoundComponent: NotFound,
  component: () => null,
});

function NotFound() {
  return (
    <SiteShell>
      <div className="container-editorial py-32 text-center">
        <p className="eyebrow">Not found</p>
        <h1 className="mt-4 font-display text-4xl">This entry hasn't been published.</h1>
        <Link to="/writing" className="mt-8 inline-block link-underline">
          Back to writing
        </Link>
      </div>
    </SiteShell>
  );
}
