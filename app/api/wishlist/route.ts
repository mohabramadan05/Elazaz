import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => ({}))) as {
    variant_id?: string;
  };

  if (!payload.variant_id) {
    return NextResponse.json({ error: "variant_id is required" }, { status: 400 });
  }

  const { data: existing, error: selectError } = await supabase
    .from("wishlist_variants")
    .select("id")
    .eq("user_id", user.id)
    .eq("variant_id", payload.variant_id)
    .maybeSingle();

  if (selectError) {
    return NextResponse.json({ error: selectError.message }, { status: 500 });
  }

  if (existing) {
    const { error: deleteError } = await supabase
      .from("wishlist_variants")
      .delete()
      .eq("id", existing.id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ wishlisted: false });
  }

  const { error: insertError } = await supabase
    .from("wishlist_variants")
    .insert({ user_id: user.id, variant_id: payload.variant_id });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ wishlisted: true });
}
