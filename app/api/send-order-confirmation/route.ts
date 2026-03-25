import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  buildOrderConfirmationEmailHTML,
  type OrderConfirmationEmailItem,
  type OrderConfirmationEmailPayload,
} from "@/lib/email/orderConfirmation";

export const runtime = "nodejs";

type JsonRecord = Record<string, unknown>;

type SendOrderConfirmationRequest = {
  toEmail: string;
  customerName: string;
  orderNumber: string;
  orderDate: string;
  paymentMethod: string;
  shipName: string;
  shipPhone: string;
  shipAddress: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  currency: string;
  orderUrl: string;
  items: OrderConfirmationEmailItem[];
};

const asObject = (value: unknown): JsonRecord =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as JsonRecord) : {};

const asTrimmedString = (value: unknown): string | null => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return null;
};

const asFiniteNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};

const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isValidHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const validateItems = (value: unknown): { items: OrderConfirmationEmailItem[]; errors: string[] } => {
  if (!Array.isArray(value)) {
    return { items: [], errors: ["items is required and must be an array"] };
  }

  if (value.length === 0) {
    return { items: [], errors: ["items must contain at least one item"] };
  }

  const errors: string[] = [];
  const items: OrderConfirmationEmailItem[] = [];

  value.forEach((rawItem, index) => {
    const item = asObject(rawItem);
    const name = asTrimmedString(item.name);
    const quantity = asFiniteNumber(item.quantity);
    const unitPrice = asFiniteNumber(item.unit_price);

    if (!name) {
      errors.push(`items[${index}].name is required`);
    }
    if (quantity === null) {
      errors.push(`items[${index}].quantity must be a number`);
    } else if (quantity <= 0) {
      errors.push(`items[${index}].quantity must be greater than 0`);
    }
    if (unitPrice === null) {
      errors.push(`items[${index}].unit_price must be a number`);
    } else if (unitPrice < 0) {
      errors.push(`items[${index}].unit_price must be >= 0`);
    }

    if (name && quantity !== null && quantity > 0 && unitPrice !== null && unitPrice >= 0) {
      items.push({
        name,
        quantity,
        unit_price: unitPrice,
      });
    }
  });

  return { items, errors };
};

const validateRequestBody = (
  rawBody: unknown,
): { data: SendOrderConfirmationRequest | null; errors: string[] } => {
  const body = asObject(rawBody);
  const errors: string[] = [];

  const toEmail = asTrimmedString(body.toEmail);
  const customerName = asTrimmedString(body.customerName);
  const orderNumber = asTrimmedString(body.orderNumber);
  const orderDate = asTrimmedString(body.orderDate);
  const paymentMethod = asTrimmedString(body.paymentMethod);
  const shipName = asTrimmedString(body.shipName);
  const shipPhone = asTrimmedString(body.shipPhone);
  const shipAddress = asTrimmedString(body.shipAddress);
  const subtotal = asFiniteNumber(body.subtotal);
  const discount = asFiniteNumber(body.discount);
  const shipping = asFiniteNumber(body.shipping);
  const total = asFiniteNumber(body.total);
  const currency = asTrimmedString(body.currency);
  const orderUrl = asTrimmedString(body.orderUrl);
  const { items, errors: itemErrors } = validateItems(body.items);

  if (!toEmail) errors.push("toEmail is required");
  if (toEmail && !isValidEmail(toEmail)) errors.push("toEmail must be a valid email address");
  if (!customerName) errors.push("customerName is required");
  if (!orderNumber) errors.push("orderNumber is required");
  if (!orderDate) errors.push("orderDate is required");
  if (!paymentMethod) errors.push("paymentMethod is required");
  if (!shipName) errors.push("shipName is required");
  if (!shipPhone) errors.push("shipPhone is required");
  if (!shipAddress) errors.push("shipAddress is required");
  if (subtotal === null) errors.push("subtotal is required and must be a number");
  if (discount === null) errors.push("discount is required and must be a number");
  if (shipping === null) errors.push("shipping is required and must be a number");
  if (total === null) errors.push("total is required and must be a number");
  if (!currency) errors.push("currency is required");
  if (!orderUrl) errors.push("orderUrl is required");
  if (orderUrl && !isValidHttpUrl(orderUrl)) errors.push("orderUrl must be a valid http(s) URL");

  if (subtotal !== null && subtotal < 0) errors.push("subtotal must be >= 0");
  if (discount !== null && discount < 0) errors.push("discount must be >= 0");
  if (shipping !== null && shipping < 0) errors.push("shipping must be >= 0");
  if (total !== null && total < 0) errors.push("total must be >= 0");

  errors.push(...itemErrors);

  if (errors.length > 0) {
    return { data: null, errors };
  }

  return {
    data: {
      toEmail: toEmail as string,
      customerName: customerName as string,
      orderNumber: orderNumber as string,
      orderDate: orderDate as string,
      paymentMethod: paymentMethod as string,
      shipName: shipName as string,
      shipPhone: shipPhone as string,
      shipAddress: shipAddress as string,
      subtotal: subtotal as number,
      discount: discount as number,
      shipping: shipping as number,
      total: total as number,
      currency: (currency as string).toUpperCase(),
      orderUrl: orderUrl as string,
      items,
    },
    errors: [],
  };
};

const toEmailBuilderPayload = (
  payload: SendOrderConfirmationRequest,
): OrderConfirmationEmailPayload => ({
  customerName: payload.customerName,
  orderNumber: payload.orderNumber,
  orderDate: payload.orderDate,
  paymentMethod: payload.paymentMethod,
  shipName: payload.shipName,
  shipPhone: payload.shipPhone,
  shipAddress: payload.shipAddress,
  subtotal: payload.subtotal,
  discount: payload.discount,
  shipping: payload.shipping,
  total: payload.total,
  currency: payload.currency,
  orderUrl: payload.orderUrl,
  items: payload.items,
});

export async function POST(request: Request) {
  try {
    const rawBody = await request.json().catch(() => null);
    if (!rawBody) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { data, errors } = validateRequestBody(rawBody);
    if (!data) {
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json({ error: "Email provider is not configured" }, { status: 500 });
    }

    const html = buildOrderConfirmationEmailHTML(toEmailBuilderPayload(data));
    const resend = new Resend(resendApiKey);
    const from = process.env.EMAIL_FROM?.trim() || "ELAZAZ <noreply@elazaz.site>";
    const subject = `تم تأكيد الدفع - طلب رقم #${data.orderNumber}`;

    const { data: resendData, error: resendError } = await resend.emails.send({
      from,
      to: [data.toEmail],
      subject,
      html,
    });

    if (resendError) {
      console.error("Resend send error (order confirmation)", resendError);
      return NextResponse.json({ error: "Failed to send email" }, { status: 502 });
    }

    return NextResponse.json(
      {
        ok: true,
        id: resendData?.id ?? null,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Unhandled send-order-confirmation error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

