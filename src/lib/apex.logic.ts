export type RouteDirection = { to: string; label: string };

export function getRouteDirections(pathname: string): {
  previous: RouteDirection | null;
  next: RouteDirection;
} {
  if (pathname.startsWith("/projects/")) {
    return { previous: null, next: { to: "/writing", label: "Next: Journal" } };
  }
  if (pathname.startsWith("/writing/")) {
    return { previous: null, next: { to: "/about", label: "Next: About" } };
  }
  if (pathname === "/") return { previous: null, next: { to: "/projects", label: "Next: Work" } };
  if (pathname.startsWith("/projects")) return { previous: { to: "/", label: "Previous: Home" }, next: { to: "/writing", label: "Next: Journal" } };
  if (pathname.startsWith("/writing")) return { previous: { to: "/projects", label: "Previous: Work" }, next: { to: "/about", label: "Next: About" } };
  if (pathname.startsWith("/about")) return { previous: { to: "/writing", label: "Previous: Journal" }, next: { to: "/contact", label: "Next: Contact" } };
  return { previous: { to: "/about", label: "Previous: About" }, next: { to: "/", label: "Next: Home" } };
}

const PROJECT_HIGHLIGHTS: Record<string, readonly string[]> = {
  "AI Internship Match Assistant": ["Embeddings", "Vector Retrieval", "pypdf"],
  "AI Health Advisory Assistant": ["Groq API", "Sensor Integration", "ESP32 Prototyping"],
  "AI Poetry Chatbot": ["Mood-Conditioned Generation", "ReportLab", "Flask"],
};

export function getProjectHighlights(title: string, stack: readonly string[]) {
  return PROJECT_HIGHLIGHTS[title] ?? stack.slice(0, 3);
}

export function selectFeaturedProjects<T extends { sort_order: number; title: string | null }>(projects: readonly T[]) {
  return [...projects]
    .sort((a, b) => a.sort_order - b.sort_order || (a.title ?? "").localeCompare(b.title ?? ""))
    .slice(0, 2);
}

export function isTemporaryQaPost(post: { title: string; slug: string }) {
  return post.title === "Journal QA Test" || post.slug === "journal-qa-test";
}

export function selectLatestGenuinePost<T extends { title: string; slug: string }>(posts: readonly T[]) {
  return posts.find((post) => !isTemporaryQaPost(post)) ?? null;
}
