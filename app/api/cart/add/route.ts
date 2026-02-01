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

  const payload = (await request.json().catch(() => null)) as
    | { variant_id?: string; qty?: number }
    | null;

  if (!payload?.variant_id) {
    return NextResponse.json(
      { error: "variant_id is required" },
      { status: 400 }
    );
  }

  const qty =
    typeof payload.qty === "number" && Number.isFinite(payload.qty)
      ? Math.max(1, Math.floor(payload.qty))
      : 1;

  const { data, error } = await supabase.rpc("add_to_cart", {
    p_variant_id: payload.variant_id,
    p_qty: qty,
  });

  if (error) {
    const status =
      error.message?.toLowerCase().includes("not authenticated") ? 401 : 400;
    console.error("add_to_cart rpc failed", error);
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json(data);
}
