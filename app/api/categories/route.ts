import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id,name,image_url,parent_id,products(count)");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows =
    data?.map((row) => ({
      id: row.id,
      name: row.name,
      image_url: row.image_url,
      parent_id: row.parent_id,
      product_count: row.products?.[0]?.count ?? 0,
    })) ?? [];

  return NextResponse.json(rows);
}
