import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type CreateOrderPayload = {
  address_id?: string | null;
  shipping_address?: unknown;
  first_name?: string | null;
  second_name?: string | null;
  comany_name?: string | null;
  last_name?: string | null;
  company_name?: string | null;
  email?: string | null;
  promo_code_id?: string | null;
  discount_amount?: number | string | null;
};

type CartRow = {
  id: string;
};

type CartItemRow = {
  variant_id: string | null;
  quantity: number | null;
};

type VariantPriceRow = {
  id: string;
  price: number | string | null;
};


const DELIVERY_BASE_FEE = 1000;
const DELIVERY_FEE_PER_ITEM = 130;

const hasOwn = (obj: object, key: string) =>
  Object.prototype.hasOwnProperty.call(obj, key);

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawPayload = await request.json().catch(() => ({}));
  const payload: CreateOrderPayload =
    rawPayload && typeof rawPayload === "object"
      ? (rawPayload as CreateOrderPayload)
      : {};

  if (
    hasOwn(payload, "address_id") &&
    payload.address_id !== null &&
    typeof payload.address_id !== "string"
  ) {
    return NextResponse.json({ error: "address_id must be a string or null" }, { status: 400 });
  }

  if (
    hasOwn(payload, "promo_code_id") &&
    payload.promo_code_id !== null &&
    typeof payload.promo_code_id !== "string"
  ) {
    return NextResponse.json(
      { error: "promo_code_id must be a string or null" },
      { status: 400 },
    );
  }

  if (
    hasOwn(payload, "shipping_address") &&
    payload.shipping_address !== null &&
    typeof payload.shipping_address !== "object"
  ) {
    return NextResponse.json(
      { error: "shipping_address must be a JSON object or null" },
      { status: 400 },
    );
  }

  if (
    hasOwn(payload, "first_name") &&
    payload.first_name !== null &&
    typeof payload.first_name !== "string"
  ) {
    return NextResponse.json(
      { error: "first_name must be a string or null" },
      { status: 400 },
    );
  }

  if (
    hasOwn(payload, "second_name") &&
    payload.second_name !== null &&
    typeof payload.second_name !== "string"
  ) {
    return NextResponse.json(
      { error: "second_name must be a string or null" },
      { status: 400 },
    );
  }

  if (
    hasOwn(payload, "comany_name") &&
    payload.comany_name !== null &&
    typeof payload.comany_name !== "string"
  ) {
    return NextResponse.json(
      { error: "comany_name must be a string or null" },
      { status: 400 },
    );
  }

  if (
    hasOwn(payload, "last_name") &&
    payload.last_name !== null &&
    typeof payload.last_name !== "string"
  ) {
    return NextResponse.json(
      { error: "last_name must be a string or null" },
      { status: 400 },
    );
  }

  if (
    hasOwn(payload, "company_name") &&
    payload.company_name !== null &&
    typeof payload.company_name !== "string"
  ) {
    return NextResponse.json(
      { error: "company_name must be a string or null" },
      { status: 400 },
    );
  }

  if (
    hasOwn(payload, "email") &&
    payload.email !== null &&
    typeof payload.email !== "string"
  ) {
    return NextResponse.json(
      { error: "email must be a string or null" },
      { status: 400 },
    );
  }

  let parsedDiscountAmount: number | null | undefined;
  if (hasOwn(payload, "discount_amount")) {
    if (payload.discount_amount === null) {
      parsedDiscountAmount = null;
    } else {
      const numericDiscount = Number(payload.discount_amount);
      if (!Number.isFinite(numericDiscount) || numericDiscount < 0) {
        return NextResponse.json(
          { error: "discount_amount must be a non-negative number or null" },
          { status: 400 },
        );
      }
      parsedDiscountAmount = numericDiscount;
    }
  }

  const { data: cartData, error: cartError } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (cartError) {
    return NextResponse.json({ error: cartError.message }, { status: 500 });
  }

  const cart = cartData as CartRow | null;
  if (!cart?.id) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const { data: cartItemsData, error: cartItemsError } = await supabase
    .from("cart_items")
    .select("variant_id,quantity")
    .eq("cart_id", cart.id);

  if (cartItemsError) {
    return NextResponse.json({ error: cartItemsError.message }, { status: 500 });
  }

  const cartItems = (cartItemsData ?? []) as CartItemRow[];
  if (cartItems.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const normalizedItems = cartItems.map((item) => ({
    variantId: item.variant_id,
    quantity: Number(item.quantity ?? 0),
  }));

  if (normalizedItems.some((item) => !item.variantId)) {
    return NextResponse.json(
      { error: "Cart contains invalid items" },
      { status: 400 },
    );
  }

  if (
    normalizedItems.some(
      (item) =>
        !Number.isFinite(item.quantity) ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0,
    )
  ) {
    return NextResponse.json(
      { error: "Cart contains invalid quantities" },
      { status: 400 },
    );
  }

  const variantIds = Array.from(
    new Set(normalizedItems.map((item) => item.variantId as string)),
  );

  const { data: variantsData, error: variantsError } = await supabase
    .from("product_variants")
    .select("id,price")
    .in("id", variantIds);

  if (variantsError) {
    return NextResponse.json({ error: variantsError.message }, { status: 500 });
  }

  const variantPrices = new Map<string, number>();
  for (const row of (variantsData ?? []) as VariantPriceRow[]) {
    const numericPrice = Number(row.price ?? 0);
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return NextResponse.json(
        { error: `Invalid variant price for ${row.id}` },
        { status: 400 },
      );
    }
    variantPrices.set(row.id, numericPrice);
  }

  const missingVariantId = variantIds.find((id) => !variantPrices.has(id));
  if (missingVariantId) {
    return NextResponse.json(
      { error: "Some cart variants are no longer available" },
      { status: 400 },
    );
  }

  const itemsSubtotal = normalizedItems.reduce((sum, item) => {
    const Price = variantPrices.get(item.variantId as string) ?? 0;
    return sum + Price * item.quantity;
  }, 0);
  const totalItemsCount = normalizedItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const deliveryFee =
    totalItemsCount > 0
      ? DELIVERY_BASE_FEE + totalItemsCount * DELIVERY_FEE_PER_ITEM
      : 0;
  const totalAmount = itemsSubtotal + deliveryFee;

  const firstName = payload.first_name ?? null;
  const secondName = payload.second_name ?? payload.last_name ?? null;
  const comanyName = payload.comany_name ?? payload.company_name ?? null;
  const email = payload.email ?? null;

  const orderInsert: Record<string, unknown> = {
    user_id: user.id,
    status: "unpaid",
    total_amount: totalAmount,
    first_name: firstName,
    second_name: secondName,
    comany_name: comanyName,
    email,
  };

  if (hasOwn(payload, "address_id")) {
    orderInsert.address_id = payload.address_id ?? null;
  }
  const rawShippingAddress =
    payload.shipping_address && typeof payload.shipping_address === "object"
      ? (payload.shipping_address as Record<string, unknown>)
      : {};

  const normalizedShippingAddress: Record<string, unknown> = {
    ...rawShippingAddress,
  };

  if (hasOwn(payload, "first_name")) {
    normalizedShippingAddress.first_name = firstName;
  }
  if (hasOwn(payload, "second_name") || hasOwn(payload, "last_name")) {
    normalizedShippingAddress.second_name = secondName;
    normalizedShippingAddress.last_name = secondName;
  }
  if (hasOwn(payload, "comany_name") || hasOwn(payload, "company_name")) {
    normalizedShippingAddress.comany_name = comanyName;
    normalizedShippingAddress.company_name = comanyName;
  }
  if (hasOwn(payload, "email")) {
    normalizedShippingAddress.email = email;
  }

  if (
    hasOwn(payload, "shipping_address") ||
    hasOwn(payload, "first_name") ||
    hasOwn(payload, "second_name") ||
    hasOwn(payload, "last_name") ||
    hasOwn(payload, "comany_name") ||
    hasOwn(payload, "company_name") ||
    hasOwn(payload, "email")
  ) {
    orderInsert.shipping_address =
      Object.keys(normalizedShippingAddress).length > 0
        ? normalizedShippingAddress
        : null;
  }
  if (hasOwn(payload, "promo_code_id")) {
    orderInsert.promo_code_id = payload.promo_code_id ?? null;
  }
  if (typeof parsedDiscountAmount !== "undefined") {
    orderInsert.discount_amount = parsedDiscountAmount;
  }

  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert(orderInsert)
    .select("id,status,total_amount,discount_amount")
    .single();

  if (orderError || !orderData) {
    return NextResponse.json(
      { error: orderError?.message ?? "Failed to create order" },
      { status: 500 },
    );
  }

  const orderItemsInsert = normalizedItems.map((item) => ({
    order_id: orderData.id,
    variant_id: item.variantId,
    quantity: item.quantity,
    price: variantPrices.get(item.variantId as string) ?? 0,
  }));

  const { error: orderItemsError } = await supabase
    .from("order_items")
    .insert(orderItemsInsert);

  if (orderItemsError) {
    // Roll back inserted order if order_items insert fails.
    await supabase
      .from("orders")
      .delete()
      .eq("id", orderData.id)
      .eq("user_id", user.id);

    return NextResponse.json({ error: orderItemsError.message }, { status: 500 });
  }

  return NextResponse.json({
    order_id: orderData.id,
    status: orderData.status,
    total_amount: Number(orderData.total_amount ?? totalAmount),
    discount_amount:
      orderData.discount_amount === null || typeof orderData.discount_amount === "undefined"
        ? null
        : Number(orderData.discount_amount),
  });
}
