import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";
import { submitContactMessage } from "@/lib/contact.data";

export function createContactMessage(values: TablesInsert<"contact_messages">) {
  return submitContactMessage(supabase, values);
}
