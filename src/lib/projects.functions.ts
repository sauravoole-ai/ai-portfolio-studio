import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { normalizePublishedProject } from "@/lib/projects.logic";

export type PublishedProject = {
  id: number;
  title: string | null;
  slug: string | null;
  summary: string | null;
  problem: string | null;
  approach: string | null;
  key_features: string[];
  stack: string[];
  outcome: string | null;
  status: string;
  live_url: string | null;
  github_url: string | null;
  cover_image_url: string | null;
  sort_order: number;
};

export const listPublishedProjects = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublishedProject[]> => {
    const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const supabase = createClient<Database>(process.env.SUPABASE_URL!, key, {
      auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const { data, error } = await supabase
      .from("projects")
      .select("id, title, slug, summary, problem, approach, key_features, stack, outcome, status, live_url, github_url, cover_image_url, sort_order")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Published project listing failed.", error);
      throw new Error("Projects could not be loaded.");
    }
    return (data ?? []).map(normalizePublishedProject);
  },
);
