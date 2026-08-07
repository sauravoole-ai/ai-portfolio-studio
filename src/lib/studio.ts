import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { createStudioData } from "@/lib/studio.data";

export type StudioPost = Tables<"posts">;
export type StudioProject = Tables<"projects">;
export type StudioPostInsert = TablesInsert<"posts">;
export type StudioPostUpdate = TablesUpdate<"posts">;
export type StudioProjectInsert = TablesInsert<"projects">;
export type StudioProjectUpdate = TablesUpdate<"projects">;

const studioData = createStudioData(supabase);

export async function isStudioAdmin(userId: string) {
  return studioData.isAdmin(userId);
}

export async function listStudioPosts() {
  return studioData.listPosts();
}

export async function createStudioPost(values: StudioPostInsert) {
  return studioData.createPost(values);
}

export async function updateStudioPost(id: string, values: StudioPostUpdate) {
  return studioData.updatePost(id, values);
}

export async function deleteStudioPost(id: string) {
  return studioData.deletePost(id);
}

export async function listStudioProjects() {
  return studioData.listProjects();
}

export async function createStudioProject(values: StudioProjectInsert) {
  return studioData.createProject(values);
}

export async function updateStudioProject(id: number, values: StudioProjectUpdate) {
  return studioData.updateProject(id, values);
}

export async function deleteStudioProject(id: number) {
  return studioData.deleteProject(id);
}
