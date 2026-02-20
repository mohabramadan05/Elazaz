import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Keep this ordered list in sync with Paymob's TRANSACTION processed-callback HMAC docs.
 * Edit here only if Paymob changes the required signing fields/order.
 */
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
type OrderLookupRow = { id: string; status?: string | null };

const asObject = (value: unknown): JsonRecord =>
  value && typeof value === "object" ? (value as JsonRecord) : {};

const asNonEmptyString = (value: unknown): string | null =>
  typeof value === "string" && value.trim() ? value.trim() : null;

const toSignValue = (value: unknown) => {
  if (value === null || typeof value === "undefined") return "";
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
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

/**
 * Fix: sometimes Paymob sends `order` as primitive (number/string) in some callbacks,
 * while the signing fields use `order.id`. If `order` is primitive, use it.
 */
const getByPath = (obj: JsonRecord, path: string): unknown => {
  if (path === "order.id") {
    const orderVal = obj["order"];
    if (typeof orderVal === "string" || typeof orderVal === "number") return orderVal;
  }

  return path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as JsonRecord)[key];
  }, obj);
};

const verifyHexHmac = (raw: string, secret: string, received: string) => {
  const expected = createHmac("sha512", secret).update(raw, "utf8").digest("hex");
  const expectedHex = expected.toLowerCase();
  const receivedHex = received.toLowerCase();

  const isHex = (value: string) => /^[a-f0-9]+$/i.test(value);
  if (!isHex(expectedHex) || !isHex(receivedHex)) return false;
  if (expectedHex.length !== receivedHex.length || expectedHex.length % 2 !== 0) return false;

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
    normalizeId(transactionObj.order) ??
    null
  );
};

const stripOrderPrefix = (v: string) => (v.startsWith("order-") ? v.slice(6) : v);

/**
 * Best internal order mapping for your payload:
 * obj.data.payment_key_claims.extra.order_id is your internal UUID
 * Also support merchant_order_id that looks like "order-<uuid>".
 */
const extractMerchantOrderId = (transactionObj: JsonRecord): string | null => {
  const nestedOrder = asObject(transactionObj.order);
  const rootExtras = asObject(transactionObj.extras);
  const orderExtras = asObject(nestedOrder.extras);

  const data = asObject(transactionObj.data);
  const claims = asObject(data.payment_key_claims);
  const extra = asObject(claims.extra);

  const candidate =
    normalizeId(extra.order_id) ??
    normalizeId(transactionObj.merchant_order_id) ??
    normalizeId(nestedOrder.merchant_order_id) ??
    normalizeId(rootExtras.order_id) ??
    normalizeId(rootExtras.merchant_order_id) ??
    normalizeId(orderExtras.order_id) ??
    normalizeId(orderExtras.merchant_order_id) ??
    null;

  if (!candidate) return null;
  return stripOrderPrefix(candidate);
};

async function parseIncomingPayload(request: Request): Promise<JsonRecord> {
  const contentType = request.headers.get("content-type") ?? "";
  const raw = await request.text();

  // Try JSON first
  try {
    const parsed = JSON.parse(raw);
    return asObject(parsed);
  } catch {
    // ignore
  }

  // Fallback for x-www-form-urlencoded
  if (contentType.includes("application/x-www-form-urlencoded") || raw.includes("=")) {
    const params = new URLSearchParams(raw);
    const out: JsonRecord = {};
    for (const [k, v] of params.entries()) out[k] = v;
    return out;
  }

  return {};
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);

    // 1) Parse body safely (body can be read once)
    const payload = await parseIncomingPayload(request);

    // 2) Paymob often wraps actual transaction under `obj`
    const wrappedObj = asObject(payload.obj);
    const transactionObj: JsonRecord =
      Object.keys(wrappedObj).length > 0 ? wrappedObj : payload;

    // 3) HMAC can be in body or in URL query (?hmac=...)
    const hmacFromQuery = url.searchParams.get("hmac");
    const receivedHmac =
      asNonEmptyString(payload.hmac) ??
      asNonEmptyString(wrappedObj.hmac) ??
      asNonEmptyString(hmacFromQuery);

    if (!receivedHmac) {
      return NextResponse.json({ error: "Missing HMAC" }, { status: 400 });
    }

    const hmacSecret = process.env.PAYMOB_HMAC_SECRET ?? process.env.HMAC;
    if (!hmacSecret) {
      console.error("PAYMOB_HMAC_SECRET is not configured");
      return NextResponse.json({ error: "Webhook configuration error" }, { status: 500 });
    }

    // 4) Build signing string and verify HMAC
    const dataToSign = PAYMOB_PROCESSED_HMAC_FIELDS
      .map((field) => toSignValue(getByPath(transactionObj, field)))
      .join("");

    const isValidHmac = verifyHexHmac(dataToSign, hmacSecret, receivedHmac);
    if (!isValidHmac) {
      console.error("Invalid Paymob HMAC", {
        receivedHmacLength: receivedHmac.length,
        txnId: normalizeId(transactionObj.id),
        paymobOrderId: extractPaymobOrderId(transactionObj),
      });
      return NextResponse.json({ error: "Invalid HMAC" }, { status: 400 });
    }

    // 5) Extract identifiers for mapping
    const paymobOrderId = extractPaymobOrderId(transactionObj); // e.g. obj.order.id (473079104)
    const merchantOrderId = extractMerchantOrderId(transactionObj); // e.g. internal UUID
    const transactionId = normalizeId(transactionObj.id); // e.g. 416406323

    // 6) Use Supabase admin client (service role) to bypass RLS
    const supabase = createAdminClient();
    if (!supabase) {
      console.error("Missing Supabase admin env vars");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    let order: OrderLookupRow | null = null;

    // Prefer internal order UUID mapping
    if (merchantOrderId) {
      const { data, error } = await supabase
        .from("orders")
        .select("id,status")
        .eq("id", merchantOrderId)
        .maybeSingle();

      if (error) {
        console.error("Failed to lookup order by internal order id", error);
        return NextResponse.json({ error: "Database lookup failed" }, { status: 500 });
      }
      order = (data as OrderLookupRow | null) ?? null;
    }

    // Fallback to paymob_order_id mapping if you store it
    if (!order && paymobOrderId) {
      const { data, error } = await supabase
        .from("orders")
        .select("id,status")
        .eq("paymob_order_id", paymobOrderId)
        .maybeSingle();

      if (error) {
        console.error("Failed to lookup order by paymob_order_id", error);
        return NextResponse.json({ error: "Database lookup failed" }, { status: 500 });
      }
      order = (data as OrderLookupRow | null) ?? null;
    }

    // Last resort: transaction_id mapping (idempotency)
    if (!order && transactionId) {
      const { data, error } = await supabase
        .from("orders")
        .select("id,status")
        .eq("transaction_id", transactionId)
        .maybeSingle();

      if (error) {
        console.error("Failed to lookup order by transaction_id", error);
        return NextResponse.json({ error: "Database lookup failed" }, { status: 500 });
      }
      order = (data as OrderLookupRow | null) ?? null;
    }

    if (!order?.id) {
      console.error("Processed callback order mapping miss", {
        paymobOrderId,
        merchantOrderId,
        transactionId,
      });
      // return 200 to avoid Paymob retry storms
      return NextResponse.json(
        { ok: true, note: "Order not found for callback references" },
        { status: 200 },
      );
    }

    // Idempotency: don't downgrade if already paid
    if (order.status === "paid") {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // 7) Update order status based on success flag
    const isSuccess = normalizeBoolean(transactionObj.success);
    const nextStatus = isSuccess ? "paid" : "failed";

    const updates: JsonRecord = {
      status: nextStatus,
      transaction: transactionObj, // make sure orders.transaction is json/jsonb
    };
    if (paymobOrderId) updates.paymob_order_id = paymobOrderId;
    if (transactionId) updates.transaction_id = transactionId;

    const { error: updateError } = await supabase.from("orders").update(updates).eq("id", order.id);

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