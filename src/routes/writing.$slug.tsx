import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { posts } from "@/lib/content";

export const Route = createFileRoute("/writing/$slug")({
  loader: ({ params }) => {
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Not found — [Your Name]" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { post } = loaderData;
    return {
      meta: [
        { title: `${post.title} — [Your Name]` },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "article:published_time", content: post.date },
      ],
    };
  },
  notFoundComponent: NotFound,
  component: PostPage,
});

function NotFound() {
  return (
    <SiteShell>
      <div className="container-editorial py-32 text-center">
        <p className="eyebrow">Missing post</p>
        <h1 className="mt-4 font-display text-4xl">This entry has moved or been unpublished.</h1>
        <Link to="/writing" className="mt-8 inline-block link-underline">
          Back to all writing
        </Link>
      </div>
    </SiteShell>
  );
}

const paragraphs = [
  "This is placeholder body copy for the essay. In production, this route would render markdown or MDX pulled from a content store — but the shape and typographic rhythm below are how the reading surface behaves.",
  "The best AI product decisions I've made rarely came from the model. They came from a stubborn insistence that the surface make sense without one. A well-drawn empty state, a good keyboard shortcut, a shape that reads at a glance — these outlast any given foundation model.",
  "There is a version of this argument that becomes precious. That is not the argument I want to make. Rather: treat models as ingredients, and treat product as the meal. Then decide, deliberately, how much of the meal is model.",
];

function PostPage() {
  const { post } = Route.useLoaderData();
  return (
    <SiteShell>
      <article className="animate-rise">
        <header className="container-editorial pt-16 pb-10 md:pt-24 md:pb-14">
          <Link to="/writing" className="eyebrow link-underline">
            ← Writing
          </Link>
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.14em] text-[color:var(--terracotta)]">
            {post.kind}
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            {post.title}
          </h1>
          <p className="mt-8 text-sm text-muted-foreground">
            {post.date} · {post.readingTime} · [Your Name]
          </p>
        </header>

        <div className="container-editorial pb-24">
          <div className="mx-auto max-w-2xl">
            <p className="font-display text-2xl leading-snug md:text-3xl">
              {post.excerpt}
            </p>
            <div className="mt-10 space-y-6 text-lg leading-relaxed">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <blockquote className="border-l-2 border-[color:var(--terracotta)] pl-6 font-display text-2xl italic leading-snug text-foreground/90">
                "The interface, not the model, is the bottleneck."
              </blockquote>
              {paragraphs.map((p, i) => (
                <p key={`b-${i}`}>{p}</p>
              ))}
            </div>

            <div className="mt-16 border-t border-border pt-8 text-sm text-muted-foreground">
              Filed under {post.kind.toLowerCase()}. If this resonated,{" "}
              <Link to="/contact" className="link-underline text-foreground">
                say hello
              </Link>
              .
            </div>
          </div>
        </div>
      </article>
    </SiteShell>
  );
}
