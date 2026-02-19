import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

type BillingData = {
  apartment?: string;
  first_name?: string;
  last_name?: string;
  street?: string;
  building?: string;
  phone_number?: string;
  city?: string;
  country?: string;
  email?: string;
  floor?: string;
  state?: string;
};

type Payload = {
  order_id?: string | number;
  amount?: number;
  currency?: string;
  payment_methods?: number[];
  items?: Array<{
    name?: string;
    amount?: number;
    description?: string;
    quantity?: number;
  }>;
  billing_data?: BillingData;
  extras?: Record<string, unknown>;
  special_reference?: string;
  expiration?: number;
  notification_url?: string;
  redirection_url?: string;
};

type OrderRow = {
  id: string;
  user_id: string;
  total_amount: number | string | null;
  discount_amount: number | string | null;
};

type OrderItemRow = {
  variant_id: string | null;
  quantity: number | null;
  price: number | string | null;
};

type VariantNameRow = {
  id: string;
  products?: { name?: string | null } | { name?: string | null }[] | null;
};

const parseNumber = (value: number | string | null | undefined) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toMinorAmount = (value: number | string | null | undefined) =>
  Math.max(0, Math.round(parseNumber(value) * 100));

const normalizeQuantity = (value: unknown) => {
  const parsed = Number(value ?? 1);
  if (!Number.isFinite(parsed) || parsed <= 0) return 1;
  return Math.max(1, Math.round(parsed));
};

const asObject = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

const asNonEmptyString = (value: unknown): string | null =>
  typeof value === "string" && value.trim() ? value : null;

const normalizeId = (value: unknown): string | null => {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
};

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) return null;

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const db = adminClient ?? supabase;
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawPayload = await request.json().catch(() => ({}));
  const payload = asObject(rawPayload) as Payload;
  const orderIdRaw = payload.order_id;
  const orderId =
    typeof orderIdRaw === "string" && orderIdRaw.trim()
      ? orderIdRaw.trim()
      : typeof orderIdRaw === "number" && Number.isFinite(orderIdRaw)
        ? String(orderIdRaw)
        : "";

  if (!orderId) {
    return NextResponse.json(
      { error: "order_id is required" },
      { status: 400 },
    );
  }

  const paymobToken = process.env.SK_TEST;
  if (!paymobToken) {
    return NextResponse.json(
      { error: "PAYMOB_SECRET_TOKEN is not configured" },
      { status: 500 },
    );
  }

  let order: OrderRow | null = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { data: orderData, error: orderError } = await db
      .from("orders")
      .select("id,user_id,total_amount,discount_amount")
      .eq("id", orderId)
      .maybeSingle();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    const fetchedOrder = orderData as OrderRow | null;
    if (fetchedOrder?.user_id === user.id) {
      order = fetchedOrder;
      break;
    }

    if (attempt < 2) {
      // Retry briefly in case order creation and read happen back-to-back.
      await sleep(120 * (attempt + 1));
    }
  }

  if (!order) {
    return NextResponse.json(
      { error: "Order not found", order_id: orderId },
      { status: 404 },
    );
  }

  const { data: orderItemsData, error: orderItemsError } = await db
    .from("order_items")
    .select("variant_id,quantity,price")
    .eq("order_id", order.id);

  if (orderItemsError) {
    return NextResponse.json(
      { error: orderItemsError.message },
      { status: 500 },
    );
  }

  const orderItems = (orderItemsData ?? []) as OrderItemRow[];
  if (orderItems.length === 0) {
    return NextResponse.json({ error: "Order has no items" }, { status: 400 });
  }

  const variantIds = Array.from(
    new Set(
      orderItems
        .map((item) => item.variant_id)
        .filter((id): id is string => Boolean(id)),
    ),
  );

  const variantNames = new Map<string, string>();
  if (variantIds.length > 0) {
    const { data: variantsData, error: variantsError } = await db
      .from("product_variants")
      .select("id,products(name)")
      .in("id", variantIds);

    if (variantsError) {
      return NextResponse.json(
        { error: variantsError.message },
        { status: 500 },
      );
    }

    for (const row of (variantsData ?? []) as VariantNameRow[]) {
      const rawProduct = row.products ?? null;
      const product = Array.isArray(rawProduct) ? rawProduct[0] : rawProduct;
      const name = product?.name?.trim();
      if (name) {
        variantNames.set(row.id, name);
      }
    }
  }

  const subtotal = parseNumber(order.total_amount);
  const discount = Math.max(0, parseNumber(order.discount_amount));
  const payableAmount = Math.max(0, subtotal - discount);
  const paymobAmountMajor =
    typeof payload.amount === "number" && Number.isFinite(payload.amount)
      ? Math.max(0, payload.amount)
      : payableAmount;
  const paymobAmountMinor = toMinorAmount(paymobAmountMajor);

  const derivedItems = orderItems.map((item, index) => {
    const itemUnitPrice = Math.max(0, parseNumber(item.price));
    const quantity = normalizeQuantity(item.quantity);
    const variantId = item.variant_id ?? `unknown-${index + 1}`;
    const itemName = variantNames.get(variantId) ?? `Item ${index + 1}`;

    return {
      name: itemName,
      amount: toMinorAmount(itemUnitPrice),
      description: `variant:${variantId}`,
      quantity,
    };
  });

  const customItems =
    Array.isArray(payload.items) && payload.items.length > 0
      ? payload.items
          .map((item, index) => {
            const amount =
              typeof item.amount === "number" && Number.isFinite(item.amount)
                ? toMinorAmount(item.amount)
                : null;
            const quantity = normalizeQuantity(item.quantity);
            const name =
              typeof item.name === "string" && item.name.trim()
                ? item.name.trim()
                : `Item ${index + 1}`;
            const description =
              typeof item.description === "string" && item.description.trim()
                ? item.description.trim()
                : "Checkout item";

            if (amount === null) return null;

            return {
              name,
              amount,
              description,
              quantity,
            };
          })
          .filter(
            (
              value,
            ): value is {
              name: string;
              amount: number;
              description: string;
              quantity: number;
            } => Boolean(value),
          )
      : [];

  const items = customItems.length > 0 ? customItems : derivedItems;

  const billing = payload.billing_data ?? {};
  const billingData = {
    apartment: billing.apartment ?? "N/A",
    first_name: billing.first_name ?? "N/A",
    last_name: billing.last_name ?? "N/A",
    street: billing.street ?? "N/A",
    building: billing.building ?? "N/A",
    phone_number: billing.phone_number ?? "N/A",
    city: billing.city ?? "N/A",
    country: billing.country ?? "N/A",
    email: billing.email ?? "N/A",
    floor: billing.floor ?? "N/A",
    state: billing.state ?? "N/A",
  };



  const requestBody = {
    amount: paymobAmountMinor,
    currency: payload.currency ?? "EGP",
    payment_methods:[4357822],
    items,
    billing_data: billingData,
    extras: {
      ...(payload.extras ?? {}),
      order_id: order.id,
    },
    special_reference: payload.special_reference ?? `order-${order.id}`,
    expiration:
      typeof payload.expiration === "number" &&
      Number.isFinite(payload.expiration)
        ? payload.expiration
        : 3600,
    notification_url: payload.notification_url ,
    redirection_url: payload.redirection_url,
  };

  const paymobResponse = await fetch(
    "https://accept.paymob.com/v1/intention/",
    {
      method: "POST",
      headers: {
        Authorization: `Token ${paymobToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      redirect: "follow",
    },
  );

  const responseText = await paymobResponse.text();
  let paymobPayload: unknown = responseText;
  try {
    paymobPayload = JSON.parse(responseText);
  } catch {
    // Keep raw text when response is not valid JSON.
  }

  if (!paymobResponse.ok) {
    return NextResponse.json(
      { error: "Failed to create Paymob intention", details: paymobPayload },
      { status: paymobResponse.status },
    );
  }

  const paymobObj = asObject(paymobPayload);
  const intentionDetail = asObject(paymobObj.intention_detail);
  const rootOrder = asObject(paymobObj.order);
  const detailOrder = asObject(intentionDetail.order);
  const transactionIdRaw = paymobObj.id;
  const transactionId =
    typeof transactionIdRaw === "string" || typeof transactionIdRaw === "number"
      ? String(transactionIdRaw)
      : null;
  const paymobOrderId =
    normalizeId(rootOrder.id) ??
    normalizeId(paymobObj.order) ??
    normalizeId(paymobObj.order_id) ??
    normalizeId(detailOrder.id) ??
    normalizeId(intentionDetail.order_id);
  const clientSecret =
    asNonEmptyString(paymobObj.client_secret) ??
    asNonEmptyString(intentionDetail.client_secret);
  const publicKey = asNonEmptyString(process.env.PK_TEST);
  const unifiedCheckoutUrl =
    clientSecret && publicKey
      ? `https://accept.paymob.com/unifiedcheckout/?publicKey=${encodeURIComponent(
          publicKey,
        )}&clientSecret=${encodeURIComponent(clientSecret)}`
      : null;

  const { error: updateError } = await db
    .from("orders")
    .update({
      transaction_id: transactionId,
      transaction: paymobPayload,
    })
    .eq("id", order.id)
    .eq("user_id", user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  if (paymobOrderId) {
    const { error: orderIdUpdateError } = await db
      .from("orders")
      .update({ paymob_order_id: paymobOrderId })
      .eq("id", order.id)
      .eq("user_id", user.id);

    if (orderIdUpdateError) {
      // Keep checkout flow successful even if DB schema is not yet migrated.
      console.error("Failed to persist paymob_order_id", orderIdUpdateError);
    }
  }

  return NextResponse.json({
    order_id: order.id,
    amount: paymobAmountMajor,
    amount_minor: paymobAmountMinor,
    paymob_order_id: paymobOrderId,
    client_secret: clientSecret,
    public_key: publicKey,
    unified_checkout_url: unifiedCheckoutUrl,
    paymob: paymobPayload,
  });
}
