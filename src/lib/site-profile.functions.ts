import { createServerFn } from "@tanstack/react-start";
import type { Tables } from "@/integrations/supabase/types";

export const getSiteProfile = createServerFn({ method: "GET" }).handler(async (): Promise<Tables<"site_profile"> | null> => {
  const { supabase } = await import("@/integrations/supabase/client");
  const { data, error } = await supabase.from("site_profile").select("*").eq("id", true).maybeSingle();
  if (error) {
    console.error("[Profile] Public profile loading failed.");
    return null;
  }
  return data;
});
