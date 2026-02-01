import { createClient } from "@/utils/supabase/server";

export type Color = {
  id: string;
  name: string | null;
  hex_code: string | null;
};

export async function fetchColors() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("colors")
    .select("id,name,hex_code")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Color[];
}
