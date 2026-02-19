import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// Keep this ordered list in sync with Paymob's processed-callback HMAC docs.
// Edit here only if Paymob changes the required signing fields/order.
const PAYMOB_PROCESSED_HMAC_FIELDS = [
  "amount_cents",
  "created_at",
  "currency",
  "error_occured",
  "has_parent_transaction",
  "id",
  "integration_id",
  "is_3d_secure",
  "is_auth",
  "is_capture",
  "is_refunded",
  "is_standalone_payment",
  "is_voided",
  "order.id",
  "owner",
  "pending",
  "source_data.pan",
  "source_data.sub_type",
  "source_data.type",
  "success",
] as const;

type JsonRecord = Record<string, unknown>;

const asObject = (value: unknown): JsonRecord =>
  value && typeof value === "object" ? (value as JsonRecord) : {};

const asNonEmptyString = (value: unknown): string | null =>
  typeof value === "string" && value.trim() ? value.trim() : null;

const toSignValue = (value: unknown) => {
  if (value === null || typeof value === "undefined") return "";
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
};

const getByPath = (obj: JsonRecord, path: string): unknown => {
  return path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as JsonRecord)[key];
  }, obj);
};

const normalizeId = (value: unknown): string | null => {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
};

const normalizeBoolean = (value: unknown) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    return v === "true" || v === "1";
  }
  return false;
};

const verifyHexHmac = (raw: string, secret: string, received: string) => {
  const expected = createHmac("sha512", secret).update(raw, "utf8").digest("hex");
  const expectedHex = expected.toLowerCase();
  const receivedHex = received.toLowerCase();
  const isHex = (value: string) => /^[a-f0-9]+$/i.test(value);

  if (!isHex(expectedHex) || !isHex(receivedHex)) return false;
  if (expectedHex.length !== receivedHex.length || expectedHex.length % 2 !== 0) {
    return false;
  }

  const expectedBuffer = Buffer.from(expectedHex, "hex");
  const receivedBuffer = Buffer.from(receivedHex, "hex");
  if (expectedBuffer.length !== receivedBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, receivedBuffer);
};

const extractPaymobOrderId = (transactionObj: JsonRecord): string | null => {
  const directOrder = transactionObj.order;
  if (typeof directOrder === "string" || typeof directOrder === "number") {
    return normalizeId(directOrder);
  }

  const nestedOrder = asObject(directOrder);
  return (
    normalizeId(nestedOrder.id) ??
    normalizeId(transactionObj.order_id) ??
    null
  );
};

const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceRoleKey) return null;

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

export async function POST(request: Request) {
  try {
    const payload = asObject(await request.json().catch(() => ({})));
    const wrappedObj = asObject(payload.obj);
    const transactionObj =
      Object.keys(wrappedObj).length > 0 ? wrappedObj : payload;
    const receivedHmac =
      asNonEmptyString(payload.hmac) ?? asNonEmptyString(wrappedObj.hmac);

    if (!receivedHmac) {
      return NextResponse.json({ error: "Missing HMAC" }, { status: 400 });
    }

    const hmacSecret = process.env.PAYMOB_HMAC_SECRET ?? process.env.HMAC;
    if (!hmacSecret) {
      console.error("PAYMOB_HMAC_SECRET is not configured");
      return NextResponse.json(
        { error: "Webhook configuration error" },
        { status: 500 },
      );
    }

    const dataToSign = PAYMOB_PROCESSED_HMAC_FIELDS
      .map((field) => toSignValue(getByPath(transactionObj, field)))
      .join("");

    const isValidHmac = verifyHexHmac(dataToSign, hmacSecret, receivedHmac);
    if (!isValidHmac) {
      console.error("Invalid Paymob HMAC", {
        receivedHmacLength: receivedHmac.length,
      });
      return NextResponse.json({ error: "Invalid HMAC" }, { status: 400 });
    }

    const paymobOrderId = extractPaymobOrderId(transactionObj);
    if (!paymobOrderId) {
      console.error("Processed callback missing Paymob order id", payload);
      return NextResponse.json(
        { ok: true, note: "No paymob_order_id in payload" },
        { status: 200 },
      );
    }

    const supabase = createAdminClient();
    if (!supabase) {
      console.error("Missing Supabase admin env vars");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const { data: order, error: orderLookupError } = await supabase
      .from("orders")
      .select("id")
      .eq("paymob_order_id", paymobOrderId)
      .maybeSingle();

    if (orderLookupError) {
      console.error("Failed to lookup order by paymob_order_id", orderLookupError);
      return NextResponse.json({ error: "Database lookup failed" }, { status: 500 });
    }

    if (!order?.id) {
      return NextResponse.json(
        { ok: true, note: "Order not found for paymob_order_id" },
        { status: 200 },
      );
    }

    const transactionId = normalizeId(transactionObj.id);
    const isSuccess = normalizeBoolean(transactionObj.success);
    const nextStatus = isSuccess ? "paid" : "failed";

    const updates: JsonRecord = {
      status: nextStatus,
      transaction: transactionObj,
      paymob_order_id: paymobOrderId,
    };
    if (transactionId) {
      updates.transaction_id = transactionId;
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", order.id);

    if (updateError) {
      console.error("Failed to update order from processed callback", updateError);
      return NextResponse.json({ error: "Database update failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Unhandled processed callback error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
