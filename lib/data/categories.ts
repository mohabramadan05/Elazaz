import { createClient } from "@/utils/supabase/server";

export type Category = {
  id: string;
  name: string | null;
};

export async function fetchCategoryById(categoryId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id,name")
    .eq("id", categoryId)
    .single();

  if (error) {
    return null;
  }

  return data as Category;
}

export async function fetchCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id,name")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Category[];
}
