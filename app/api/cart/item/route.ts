import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as
    | { itemId?: string; action?: "increment" | "decrement" }
    | null;

  if (!payload?.itemId || !payload.action) {
    return NextResponse.json(
      { error: "itemId and action are required" },
      { status: 400 },
    );
  }

  const { data: cartData, error: cartError } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (cartError || !cartData?.id) {
    return NextResponse.json({ error: "Cart not found" }, { status: 404 });
  }

  const { data: item, error: itemError } = await supabase
    .from("cart_items")
    .select("id,quantity")
    .eq("id", payload.itemId)
    .eq("cart_id", cartData.id)
    .maybeSingle();

  if (itemError || !item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const currentQty = item.quantity ?? 1;
  const delta = payload.action === "increment" ? 1 : -1;
  const nextQty = Math.max(1, currentQty + delta);

  if (nextQty === currentQty) {
    return NextResponse.json({ id: item.id, quantity: currentQty });
  }

  const { data: updated, error: updateError } = await supabase
    .from("cart_items")
    .update({ quantity: nextQty })
    .eq("id", item.id)
    .eq("cart_id", cartData.id)
    .select("id,quantity")
    .maybeSingle();

  if (updateError || !updated) {
    return NextResponse.json(
      { error: updateError?.message ?? "Update failed" },
      { status: 400 },
    );
  }

  return NextResponse.json({ id: updated.id, quantity: updated.quantity });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as
    | { itemId?: string }
    | null;

  if (!payload?.itemId) {
    return NextResponse.json({ error: "itemId is required" }, { status: 400 });
  }

  const { data: cartData, error: cartError } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (cartError || !cartData?.id) {
    return NextResponse.json({ error: "Cart not found" }, { status: 404 });
  }

  const { error: deleteError } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", payload.itemId)
    .eq("cart_id", cartData.id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
