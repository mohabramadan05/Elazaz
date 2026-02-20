import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const asNonEmptyString = (value: string | null): string | null =>
  typeof value === "string" && value.trim() ? value.trim() : null;

const stripOrderPrefix = (v: string) => (v.startsWith("order-") ? v.slice(6) : v);

type OrderRow = { id: string; status: string | null; transaction_id: string | null };

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // From your real redirect URL:
    const merchantOrderIdRaw = asNonEmptyString(searchParams.get("merchant_order_id"));
    const merchantOrderId = merchantOrderIdRaw ? stripOrderPrefix(merchantOrderIdRaw) : null;

    const paymobOrderId = asNonEmptyString(searchParams.get("order")) ?? null;

    // Paymob redirect includes transaction id in `id`
    const trxId =
      asNonEmptyString(searchParams.get("trx_id")) ??
      asNonEmptyString(searchParams.get("id")) ??
      null;

    if (!merchantOrderId && !paymobOrderId && !trxId) {
      return NextResponse.json(
        { error: "Missing order reference (merchant_order_id/order/id)" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    if (!supabase) {
      console.error("Missing Supabase admin env vars for paymob response callback");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    let order: OrderRow | null = null;

    // 1) Prefer internal UUID
    if (merchantOrderId) {
      const { data, error } = await supabase
        .from("orders")
        .select("id,status,transaction_id")
        .eq("id", merchantOrderId)
        .maybeSingle();

      if (error) {
        console.error("Failed to lookup order by merchant_order_id", error);
        return NextResponse.json({ error: "Database lookup failed" }, { status: 500 });
      }
      order = data ?? null;
    }

    // 2) Fallback to transaction id (works great because processed webhook sets transaction_id)
    if (!order && trxId) {
      const { data, error } = await supabase
        .from("orders")
        .select("id,status,transaction_id")
        .eq("transaction_id", trxId)
        .maybeSingle();

      if (error) {
        console.error("Failed to lookup order by transaction_id", error);
        return NextResponse.json({ error: "Database lookup failed" }, { status: 500 });
      }
      order = data ?? null;
    }

    // 3) Fallback to paymob order id mapping (only if you store it in orders.paymob_order_id)
    if (!order && paymobOrderId) {
      const { data, error } = await supabase
        .from("orders")
        .select("id,status,transaction_id")
        .eq("paymob_order_id", paymobOrderId)
        .maybeSingle();

      if (error) {
        console.error("Failed to lookup order by paymob_order_id", error);
        return NextResponse.json({ error: "Database lookup failed" }, { status: 500 });
      }
      order = data ?? null;
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      order_id: order.id,
      status: order.status ?? "pending",
      transaction_id: order.transaction_id ?? null,
    });
  } catch (error) {
    console.error("Unhandled paymob response callback error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}