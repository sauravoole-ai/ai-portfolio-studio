import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type StudioDataClient = Pick<SupabaseClient<Database>, "from">;

function fail(operation: string, error: { message: string }) {
  console.error(`[Studio] ${operation}`, error);
  throw new Error("The operation could not be completed.");
}

export function createStudioData(client: StudioDataClient, now = () => new Date()) {
  return {
    async isAdmin(userId: string) {
      const { data, error } = await client
        .from("admin_users")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) fail("Admin authorization failed.", error);
      return Boolean(data);
    },
    async listPosts() {
      const { data, error } = await client.from("posts").select("*").order("updated_at", { ascending: false });
      if (error) fail("Post listing failed.", error);
      return data ?? [];
    },
    async createPost(values: TablesInsert<"posts">) {
      const { data, error } = await client.from("posts").insert(values).select().single();
      if (error) fail("Post creation failed.", error);
      return data;
    },
    async updatePost(id: string, values: TablesUpdate<"posts">) {
      const { data, error } = await client
        .from("posts")
        .update({ ...values, updated_at: now().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) fail("Post update failed.", error);
      return data;
    },
    async deletePost(id: string) {
      const { error } = await client.from("posts").delete().eq("id", id);
      if (error) fail("Post deletion failed.", error);
    },
    async listProjects() {
      const { data, error } = await client
        .from("projects")
        .select("id, title, slug, summary, published, created_at")
        .order("created_at", { ascending: false });
      if (error) fail("Project listing failed.", error);
      return data ?? [];
    },
    async createProject(values: TablesInsert<"projects">) {
      const { data, error } = await client.from("projects").insert(values).select().single();
      if (error) fail("Project creation failed.", error);
      return data;
    },
    async updateProject(id: number, values: TablesUpdate<"projects">) {
      const { data, error } = await client.from("projects").update(values).eq("id", id).select().single();
      if (error) fail("Project update failed.", error);
      return data;
    },
    async deleteProject(id: number) {
      const { error } = await client.from("projects").delete().eq("id", id);
      if (error) fail("Project deletion failed.", error);
    },
  };
}
