type JournalNavigationItem = {
  title: string;
  slug: string;
};

export function selectJournalPreviousDirection(
  posts: readonly JournalNavigationItem[],
  currentSlug: string,
) {
  const currentIndex = posts.findIndex((post) => post.slug === currentSlug);
  const previousPost = currentIndex > 0 ? posts[currentIndex - 1] : undefined;
  const previousSlug = previousPost?.slug.trim();

  return previousSlug
    ? {
        to: `/writing/${encodeURIComponent(previousSlug)}`,
        label: `Previous: ${previousPost.title.trim() || "Untitled post"}`,
      }
    : { to: "/writing", label: "Back to Journal" };
}
