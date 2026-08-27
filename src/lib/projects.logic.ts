import type { PublishedProject } from "./projects.functions";

export function normalizePublishedProject(project: Partial<PublishedProject> & Pick<PublishedProject, "id">): PublishedProject {
  return {
    title: null,
    slug: null,
    summary: null,
    problem: null,
    approach: null,
    key_features: [],
    stack: [],
    outcome: null,
    status: "Live",
    live_url: null,
    github_url: null,
    cover_image_url: null,
    sort_order: 0,
    show_in_product_launcher: false,
    product_sort_order: 0,
    ...project,
    key_features: project.key_features ?? [],
    stack: project.stack ?? [],
    status: project.status ?? "Live",
    sort_order: project.sort_order ?? 0,
    show_in_product_launcher: project.show_in_product_launcher ?? false,
    product_sort_order: project.product_sort_order ?? 0,
  };
}

export function selectLauncherProducts(projects: readonly PublishedProject[]): PublishedProject[] {
  return projects
    .filter((project) => project.show_in_product_launcher && Boolean(project.live_url?.trim()))
    .slice()
    .sort(
      (a, b) =>
        a.product_sort_order - b.product_sort_order ||
        a.sort_order - b.sort_order ||
        (a.title ?? "").localeCompare(b.title ?? ""),
    );
}

export function selectProjectDetailDirections(projects: readonly PublishedProject[], currentSlug: string) {
  const currentIndex = projects.findIndex((project) => project.slug === currentSlug);
  const previousProject = currentIndex > 0 ? projects[currentIndex - 1] : undefined;
  const previousSlug = previousProject?.slug?.trim();
  const nextProject = currentIndex >= 0 ? projects[currentIndex + 1] : undefined;
  const nextSlug = nextProject?.slug?.trim();

  return {
    previous: previousSlug
      ? {
          to: `/projects/${encodeURIComponent(previousSlug)}`,
          label: `Previous: ${previousProject?.title?.trim() || "Untitled project"}`,
        }
      : { to: "/projects", label: "Back to Work" },
    next: nextSlug
      ? {
          to: `/projects/${encodeURIComponent(nextSlug)}`,
          label: `Next: ${nextProject?.title?.trim() || "Untitled project"}`,
        }
      : null,
  };
}
