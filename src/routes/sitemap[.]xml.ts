import { createFileRoute } from "@tanstack/react-router";
import { listPublishedProjects } from "@/lib/projects.functions";
import { listPublishedPosts } from "@/lib/posts.functions";
import { buildSitemapXml } from "@/lib/seo";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const [projects, posts] = await Promise.all([listPublishedProjects(), listPublishedPosts()]);
          return new Response(buildSitemapXml(projects, posts), {
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
              "Cache-Control": "public, max-age=300",
            },
          });
        } catch {
          return new Response("Sitemap temporarily unavailable.", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        }
      },
    },
  },
});
