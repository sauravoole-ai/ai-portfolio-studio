import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { getPublishedPostBySlug } from "@/lib/posts.functions";
import { SITE } from "@/lib/content";

const postQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["posts", "published", slug],
    queryFn: () => getPublishedPostBySlug({ data: slug }),
  });

export const Route = createFileRoute("/writing/$slug")({
  loader: async ({ params, context }) => {
    const post = await context.queryClient.ensureQueryData(postQueryOptions(params.slug));
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.post.title} — Journal` },
            { name: "description", content: loaderData.post.excerpt },
          ],
        }
      : {
          meta: [
            { title: `Not found — ${SITE.name}` },
            { name: "robots", content: "noindex" },
          ],
        },
  notFoundComponent: NotFound,
  component: PostPage,
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

function formatPublicationDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function PostPage() {
  const { post } = Route.useLoaderData();
  useSuspenseQuery(postQueryOptions(post.slug));
  const paragraphs = post.content.split(/\r?\n\s*\r?\n/).filter((paragraph) => paragraph.trim());

  return (
    <SiteShell>
      <article className="journal-article animate-rise">
        <header className="container-editorial pt-16 pb-12 md:pt-24 md:pb-16">
          <Link to="/writing" className="eyebrow link-underline">
            Back to Journal
          </Link>
          <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {post.category ? <span>{post.category}</span> : null}
            {post.published_at ? (
              <time dateTime={post.published_at}>{formatPublicationDate(post.published_at)}</time>
            ) : null}
          </div>
          <h1 className="mt-5 max-w-4xl font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground-soft">
              {post.excerpt}
            </p>
          ) : null}
        </header>

        <section className="border-t border-border">
          <div className="journal-article__prose container-editorial py-14 md:py-20">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>
      </article>
    </SiteShell>
  );
}
