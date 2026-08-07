import { createServerFn } from "@tanstack/react-start";

export type PublishedPostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  created_at: string;
};

export type PublishedPost = PublishedPostSummary & {
  content: string;
};

export const listPublishedPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublishedPostSummary[]> => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, slug, excerpt, category, cover_image_url, published_at, created_at")
      .eq("published", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Journal] Failed to list published posts.", error);
      throw new Error("Unable to load journal entries.");
    }

    return data ?? [];
  },
);

export const getPublishedPostBySlug = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<PublishedPost | null> => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase
      .from("posts")
      .select(
        "id, title, slug, excerpt, content, category, cover_image_url, published_at, created_at",
      )
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error) {
      console.error("[Journal] Failed to load a published post.", error);
      throw new Error("Unable to load this journal entry.");
    }

    return data;
  });
