import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert } from "@/integrations/supabase/types";

export type ContactDataClient = Pick<SupabaseClient<Database>, "from">;

export async function submitContactMessage(client: ContactDataClient, values: TablesInsert<"contact_messages">) {
  const { error } = await client.from("contact_messages").insert(values);
  if (error) {
    console.error("Contact message submission failed.");
    throw new Error("Your message could not be sent. Please try again.");
  }
}
