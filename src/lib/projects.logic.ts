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
    ...project,
    key_features: project.key_features ?? [],
    stack: project.stack ?? [],
    status: project.status ?? "Live",
    sort_order: project.sort_order ?? 0,
  };
}
