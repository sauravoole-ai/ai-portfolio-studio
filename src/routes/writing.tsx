import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { listPublishedPosts } from "@/lib/posts.functions";
import { SITE } from "@/lib/content";

const postsQueryOptions = queryOptions({
  queryKey: ["posts", "published"],
  queryFn: () => listPublishedPosts(),
});

export const Route = createFileRoute("/writing")({
  head: () => ({
    meta: [
      { title: `Journal — ${SITE.name}` },
      {
        name: "description",
        content: "Writing, experiments, observations, and things learned along the way.",
      },
      { property: "og:title", content: `Journal — ${SITE.name}` },
      {
        property: "og:description",
        content: "Writing, experiments, observations, and things learned along the way.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQueryOptions),
  pendingComponent: JournalPending,
  errorComponent: JournalError,
  component: WritingLayout,
});

function JournalPending() {
  return (
    <SiteShell>
      <div className="container-editorial py-32" aria-busy="true">
        <div className="h-4 w-32 animate-pulse rounded bg-surface-3" />
        <div className="mt-5 h-10 max-w-xl animate-pulse rounded bg-surface-2" />
      </div>
    </SiteShell>
  );
}

function JournalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <SiteShell>
      <div className="container-editorial py-32 text-center">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="mt-4 font-display text-3xl">We couldn't load the Journal.</h1>
        <button type="button" onClick={reset} className="button-secondary mt-8">
          Try again
        </button>
      </div>
    </SiteShell>
  );
}

function WritingLayout() {
  const matches = useMatches();
  if (matches.some((m) => m.routeId === "/writing/$slug")) return <Outlet />;
  return <WritingIndex />;
}

function formatPublicationDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function WritingIndex() {
  const { data: posts } = useSuspenseQuery(postsQueryOptions);

  return (
    <SiteShell>
      <section className="work-route-intro journal-route-intro animate-rise">
        <div className="container-editorial work-route-intro__inner">
          <div className="work-route-intro__copy">
            <p className="eyebrow text-accent">Writing</p>
            <h1 className="mt-6 font-sans text-[clamp(3rem,6vw,5.5rem)] font-medium leading-[0.98] tracking-[-0.05em]">
              Journal
            </h1>
            <p className="mt-7 text-lg leading-8 text-foreground-soft md:text-xl md:leading-9">
              Writing, experiments, observations, and things learned along the way.
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
        {posts.length === 0 ? (
          <div className="journal-empty-notice">
            <h2 className="font-sans text-2xl font-medium leading-tight tracking-[-0.035em] sm:text-3xl">
              Nothing published yet.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-foreground-soft">
              New writing will appear here when it’s ready.
            </p>
          </div>
        ) : (
          <ul className="journal-post-grid">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  to="/writing/$slug"
                  params={{ slug: post.slug }}
                  className="journal-post-card focus-ring group"
                >
                  {post.cover_image_url ? (
                    <span className="journal-post-card__image">
                      <img src={post.cover_image_url} alt="" loading="lazy" />
                    </span>
                  ) : null}
                  <span className="journal-post-card__body">
                    <span className="journal-post-card__meta">
                      {post.category ? <span>{post.category}</span> : null}
                      {post.published_at ? (
                        <time dateTime={post.published_at}>
                          {formatPublicationDate(post.published_at)}
                        </time>
                      ) : null}
                    </span>
                    <span className="journal-post-card__title">{post.title}</span>
                    {post.excerpt ? (
                      <span className="journal-post-card__excerpt">{post.excerpt}</span>
                    ) : null}
                    <ArrowRight className="journal-post-card__arrow" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </SiteShell>
  );
}
