import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type JsonRecord = Record<string, unknown>;

const asNonEmptyString = (value: string | null): string | null =>
  typeof value === "string" && value.trim() ? value.trim() : null;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Response callback query params from Paymob:
    // prefer merchant_order_id (internal), fallback to Paymob order id mapping.
    const merchantOrderId = asNonEmptyString(searchParams.get("merchant_order_id"));
    const paymobOrderId =
      asNonEmptyString(searchParams.get("order")) ??
      asNonEmptyString(searchParams.get("order_id"));

    if (!merchantOrderId && !paymobOrderId) {
      return NextResponse.json(
        { error: "Missing merchant_order_id/order reference" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();
    if (!supabase) {
      console.error("Missing Supabase admin env vars for paymob response callback");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    let order: JsonRecord | null = null;

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

      order = (data as JsonRecord | null) ?? null;
    }

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

      order = (data as JsonRecord | null) ?? null;
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const orderId = order.id;
    const status = order.status;
    const transactionId = order.transaction_id;

    return NextResponse.json({
      order_id: typeof orderId === "string" ? orderId : String(orderId ?? ""),
      status: typeof status === "string" ? status : String(status ?? "unpaid"),
      transaction_id:
        typeof transactionId === "string" || typeof transactionId === "number"
          ? String(transactionId)
          : null,
    });
  } catch (error) {
    console.error("Unhandled paymob response callback error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
