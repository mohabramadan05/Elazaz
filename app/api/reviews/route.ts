import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Payload = {
  product_id?: string;
  rating?: number;
  comment?: string;
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => ({}))) as Payload;
  const rating = Number(payload.rating);

  if (!payload.product_id) {
    return NextResponse.json({ error: "product_id is required" }, { status: 400 });
  }

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "rating must be between 1 and 5" }, { status: 400 });
  }

  const { error: insertError } = await supabase.from("reviews").insert({
    product_id: payload.product_id,
    user_id: user.id,
    rating,
    comment: (payload.comment ?? "").trim() || null,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
