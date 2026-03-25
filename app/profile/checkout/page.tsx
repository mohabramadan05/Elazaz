"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type CartItem = {
  id: string;
  quantity: number;
  variant_price?: number | null;
  variant_discount_price?: number | null;
};

type CartResponse = {
  items: CartItem[];
};

type PromoValidationResponse = {
  promoCodeId: string;
  code: string;
  discountPercent: number;
  maxUsesPerUser: number | null;
  usedCount: number;
};

type CreateOrderResponse = {
  order_id: string;
  status: string;
  total_amount: number;
  discount_amount: number | null;
  error?: string;
};

type PaymobIntentionResponse = {
  order_id: string;
  amount: number;
  client_secret?: string | null;
  public_key?: string | null;
  unified_checkout_url?: string | null;
  paymob: unknown;
  error?: string;
  details?: unknown;
};

type AddressRow = {
  id: string;
  country: string | null;
  city: string | null;
  street: string | null;
  postal_code: string | null;
  phone: string | null;
  is_default: boolean | null;
  created_at?: string | null;
};

type CheckoutForm = {
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  country: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  shipToDifferentAddress: boolean;
};

type AppliedPromo = {
  promoCodeId: string;
  code: string;
  discountPercent: number;
};

type FormField = Exclude<keyof CheckoutForm, "shipToDifferentAddress">;
type FormErrors = Partial<Record<FormField, string>>;

const getUnitPrice = (item: CartItem) => {
  const base = item.variant_price ?? 0;
  const discount = item.variant_discount_price ?? 0;
  if (discount > 0 && discount < base) return discount;
  return base;
};

const formatPrice = (value: number) => {
  return value.toLocaleString("en-US");
};

const formatAddressOption = (address: AddressRow) => {
  const parts = [address.street, address.city, address.country].filter(
    (value): value is string => Boolean(value && value.trim()),
  );
  if (parts.length === 0) return "عنوان محفوظ";
  return parts.join(" - ");
};

const extractPaymobRedirectUrl = (payload: unknown): string | null => {
  if (!payload || typeof payload !== "object") return null;
  const root = payload as Record<string, unknown>;

  const directCandidates = [
    root.redirect_url,
    root.redirection_url,
    root.payment_url,
    root.client_url,
    root.url,
  ];
  for (const candidate of directCandidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }

  if (root.intention_detail && typeof root.intention_detail === "object") {
    const detail = root.intention_detail as Record<string, unknown>;
    const nestedCandidates = [
      detail.redirect_url,
      detail.redirection_url,
      detail.payment_url,
      detail.client_url,
      detail.url,
    ];
    for (const candidate of nestedCandidates) {
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate;
      }
    }
  }

  return null;
};

const countryOptions = ["مصر", "السعودية", "الإمارات", "الكويت", "قطر"];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\-\s()]{7,20}$/;

const validateCheckoutForm = (
  form: CheckoutForm,
  options: { hasSavedAddresses: boolean; selectedAddressId: string },
): FormErrors => {
  const errors: FormErrors = {};

  if (!form.firstName.trim()) errors.firstName = "الاسم الأول مطلوب";
  if (!form.lastName.trim()) errors.lastName = "اسم العائلة مطلوب";

  const email = form.email.trim();
  if (!email) {
    errors.email = "البريد الإلكتروني مطلوب";
  } else if (!emailRegex.test(email)) {
    errors.email = "صيغة البريد الإلكتروني غير صحيحة";
  }

  if (options.hasSavedAddresses) {
    if (!options.selectedAddressId.trim()) {
      errors.address = "اختر عنوانًا محفوظًا";
    }
  } else if (!form.address.trim()) {
    errors.address = "العنوان مطلوب";
  }

  if (!form.country.trim()) errors.country = "البلد مطلوب";
  if (!form.city.trim()) errors.city = "المدينة مطلوبة";

  const phone = form.phone.trim();
  if (!phone) {
    errors.phone = "رقم الهاتف مطلوب";
  } else if (!phoneRegex.test(phone)) {
    errors.phone = "رقم الهاتف غير صحيح";
  }

  return errors;
};

export default function CheckoutPage() {
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<AddressRow[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isAddressesLoading, setIsAddressesLoading] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<CheckoutForm>({
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    country: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
    shipToDifferentAddress: false,
  });

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/cart");
        const payload = (await response.json()) as CartResponse;
        setItems(payload.items ?? []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchAddresses = async () => {
      setIsAddressesLoading(true);
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          if (!isMounted) return;
          setSavedAddresses([]);
          setSelectedAddressId("");
          return;
        }

        const { data, error } = await supabase
          .from("addresses")
          .select("id,country,city,street,postal_code,phone,is_default,created_at")
          .eq("user_id", user.id)
          .order("is_default", { ascending: false })
          .order("created_at", { ascending: false });

        if (!isMounted) return;
        if (error) {
          setSavedAddresses([]);
          setSelectedAddressId("");
          return;
        }

        const rows = (data ?? []) as AddressRow[];
        setSavedAddresses(rows);

        if (rows.length === 0) {
          setSelectedAddressId("");
          return;
        }

        const defaultAddress = rows.find((row) => row.is_default) ?? rows[0];
        setSelectedAddressId(defaultAddress.id);
        setForm((prev) => ({
          ...prev,
          address: defaultAddress.street ?? prev.address,
          country: defaultAddress.country ?? prev.country,
          city: defaultAddress.city ?? prev.city,
          postalCode: defaultAddress.postal_code ?? prev.postalCode,
          phone: defaultAddress.phone ?? prev.phone,
        }));
      } finally {
        if (isMounted) setIsAddressesLoading(false);
      }
    };

    fetchAddresses();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      const price = getUnitPrice(item);
      return total + price * (item.quantity ?? 1);
    }, 0);
  }, [items]);

  const totalItemsCount = useMemo(() => {
    return items.reduce((count, item) => count + (item.quantity ?? 1), 0);
  }, [items]);

// to edit 
  const deliveryFee = useMemo(() => {
    if (totalItemsCount <= 0) return 0;
    return 1000 + totalItemsCount * 130;
  }, [totalItemsCount]);

  const total = subtotal ;
  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    return Math.round((subtotal * appliedPromo.discountPercent) / 100);
  }, [appliedPromo, subtotal]);
  const payableTotal = Math.max(0, total - discountAmount);
  const isCartEmpty = totalItemsCount <= 0;

  const countrySelectOptions = useMemo(() => {
    if (!form.country || countryOptions.includes(form.country)) {
      return countryOptions;
    }
    return [form.country, ...countryOptions];
  }, [form.country]);

  const handleFieldChange =
    (field: Exclude<keyof CheckoutForm, "shipToDifferentAddress">) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
      setFieldErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    };

  const handleAddressSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextAddressId = event.target.value;
    setSelectedAddressId(nextAddressId);

    const selectedAddress = savedAddresses.find(
      (address) => address.id === nextAddressId,
    );
    if (!selectedAddress) return;

    setForm((prev) => ({
      ...prev,
      address: selectedAddress.street ?? "",
      country: selectedAddress.country ?? "",
      city: selectedAddress.city ?? "",
      postalCode: selectedAddress.postal_code ?? "",
      phone: selectedAddress.phone ?? prev.phone,
    }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.address;
      delete next.country;
      delete next.city;
      delete next.phone;
      return next;
    });
  };

  const handleCouponCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextCode = event.target.value;
    setCouponCode(nextCode);
    setPromoError(null);
    setPromoSuccess(null);

    if (
      appliedPromo &&
      appliedPromo.code.toLowerCase() !== nextCode.trim().toLowerCase()
    ) {
      setAppliedPromo(null);
    }
  };

  const handleApplyPromo = async () => {
    const code = couponCode.trim();
    if (!code) {
      setAppliedPromo(null);
      setPromoSuccess(null);
      setPromoError("الرجاء إدخال كود الخصم");
      return;
    }

    setIsApplyingPromo(true);
    setPromoError(null);
    setPromoSuccess(null);

    try {
      const response = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const payload = (await response.json().catch(() => ({}))) as Partial<
        PromoValidationResponse
      > & {
        error?: string;
      };

      if (!response.ok) {
        setAppliedPromo(null);
        setPromoError(payload.error ?? "تعذر التحقق من كود الخصم");
        return;
      }

      if (
        !payload.promoCodeId ||
        !payload.code ||
        typeof payload.discountPercent !== "number"
      ) {
        setAppliedPromo(null);
        setPromoError("تعذر تطبيق كود الخصم");
        return;
      }

      setAppliedPromo({
        promoCodeId: payload.promoCodeId,
        code: payload.code,
        discountPercent: payload.discountPercent,
      });
      setCouponCode(payload.code);
      setPromoSuccess(`تم تطبيق كود الخصم (${payload.discountPercent}%)`);
    } catch {
      setAppliedPromo(null);
      setPromoError("حدث خطأ أثناء تطبيق كود الخصم");
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleShipToggle = (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      shipToDifferentAddress: event.target.checked,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || isLoading || isCartEmpty) return;

    const validationErrors = validateCheckoutForm(form, {
      hasSavedAddresses: savedAddresses.length > 0,
      selectedAddressId,
    });
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setSubmitError("يرجى تصحيح الحقول المطلوبة");
      setSubmitSuccess(null);
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const shippingAddress = {
        first_name: form.firstName || null,
        second_name: form.lastName || null,
        comany_name: form.company || null,
        email: form.email || null,
        street: form.address || null,
        city: form.city || null,
        country: form.country || null,
        postal_code: form.postalCode || null,
        phone: form.phone || null,
      };
      const orderResponse = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address_id: selectedAddressId || null,
          shipping_address: shippingAddress,
          first_name: form.firstName || null,
          second_name: form.lastName || null,
          comany_name: form.company || null,
          email: form.email || null,
          promo_code_id: appliedPromo?.promoCodeId ?? null,
          discount_amount: discountAmount > 0 ? discountAmount : null,
        }),
      });

      const orderPayload = (await orderResponse.json().catch(() => ({}))) as
        | CreateOrderResponse
        | { error?: string };

      if (!orderResponse.ok || !('order_id' in orderPayload) || !orderPayload.order_id) {
        setSubmitError(
          (orderPayload as { error?: string }).error ??
            "تعذر إنشاء الطلب",
        );
        return;
      }

      const paymobResponse = await fetch("/api/paymob/intention", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderPayload.order_id,
          amount: Math.round(payableTotal),
          currency: "EGP",
          payment_methods: [158],
          items: [
            {
              name: "Order Items",
              amount: Math.round(payableTotal),
              description: "Checkout order",
              quantity: 1,
            },
          ],
          billing_data: {
            apartment: "dumy",
            first_name: form.firstName || "N/A",
            last_name: form.lastName || "N/A",
            street: form.address || "N/A",
            building: "dumy",
            phone_number: form.phone || "N/A",
            city: form.city || "N/A",
            country: form.country || "N/A",
            email: form.email || "N/A",
            floor: "dumy",
            state: form.city || "N/A",
          },
          extras: { ee: 22, order_id: orderPayload.order_id },
          special_reference: `order-${orderPayload.order_id}`,
          expiration: 3600,
          notification_url: "https://elazaz.site/api/paymob/processed",
          redirection_url:  "https://elazaz.site/paymob/response",
        }),
      });

      const paymobRaw = await paymobResponse.clone().text();
      const paymobPayload = (await paymobResponse
        .json()
        .catch(() => ({ error: paymobRaw }))) as
        | PaymobIntentionResponse
        | { error?: string; details?: unknown };

      if (!paymobResponse.ok) {
        console.error("Paymob intention request failed", {
          status: paymobResponse.status,
          payload: paymobPayload,
        });
        const serverError =
          typeof (paymobPayload as { error?: unknown }).error === "string"
            ? ((paymobPayload as { error?: string }).error ?? "").trim()
            : "";
        setSubmitError(
          serverError ||
            "تعذر إنشاء رابط الدفع",
        );
        return;
      }

      const paymobResult = paymobPayload as PaymobIntentionResponse;
      const unifiedCheckoutUrl =
        typeof paymobResult.unified_checkout_url === "string" &&
        paymobResult.unified_checkout_url.trim()
          ? paymobResult.unified_checkout_url
          : null;
      if (unifiedCheckoutUrl) {
        window.location.href = unifiedCheckoutUrl;
        return;
      }

      const clientSecret =
        typeof paymobResult.client_secret === "string" &&
        paymobResult.client_secret.trim()
          ? paymobResult.client_secret
          : null;
      const publicKey =
        (typeof paymobResult.public_key === "string" &&
          paymobResult.public_key.trim()
          ? paymobResult.public_key
          : null) ?? process.env.NEXT_PUBLIC_PAYMOB_PUBLIC_KEY ?? null;

      if (clientSecret && publicKey) {
        const fallbackUnifiedCheckoutUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=${encodeURIComponent(
          publicKey,
        )}&clientSecret=${encodeURIComponent(clientSecret)}`;
        window.location.href = fallbackUnifiedCheckoutUrl;
        return;
      }

      const paymobData =
        "paymob" in paymobPayload ? paymobPayload.paymob : null;
      const redirectUrl = extractPaymobRedirectUrl(paymobData);
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }

      setSubmitSuccess("تم إنشاء الطلب بنجاح، لكن لم يتم العثور على رابط تحويل للدفع.");
    } catch {
      setSubmitError("حدث خطأ أثناء إتمام الطلب. حاول مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[#F5F5F5] py-10" dir="rtl">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="text-xs text-[#888888] flex flex-wrap items-center justify-end gap-2">
          <Link href="/" className="hover:text-[#B47720]">
            الرئيسية
          </Link>
          <span>/</span>
          <Link href="/profile/cart" className="hover:text-[#B47720]">
            سلة المشتريات
          </Link>
          <span>/</span>
          <span className="text-[#B47720]">إتمام الطلب</span>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <aside className="h-fit rounded-sm border border-[#E5E5E5] bg-white p-5 shadow-sm lg:order-2">
            <h3 className="text-lg font-semibold text-[#333333]">ملخص الطلب</h3>
            <div className="mt-4 space-y-3 text-sm text-[#666666]">
              <div className="flex items-center justify-between">
                <span>مجموع المنتجات</span>
                <span>
                  {isLoading ? "..." : `${formatPrice(subtotal)} ج.م`}
                </span>
              </div>

              <div className="space-y-2">
                <p>هل لديك كود خصم</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={handleCouponCodeChange}
                    placeholder="أدخل كود الخصم"
                    className="w-full rounded-sm border border-[#E5E5E5] px-3 py-2 text-sm text-[#333333] focus:border-[#B47720] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={isApplyingPromo || isLoading || !couponCode.trim()}
                    className="rounded-sm border border-[#B47720] px-4 py-2 text-sm font-semibold text-[#B47720] hover:bg-[#B47720] hover:text-white"
                  >
                    {isApplyingPromo ? "جاري..." : "إضافة"}
                  </button>
                </div>
                {promoError ? (
                  <p className="text-xs text-[#D14343]">{promoError}</p>
                ) : null}
                {promoSuccess ? (
                  <p className="text-xs text-[#008C56]">{promoSuccess}</p>
                ) : null}
              </div>

              <div className="flex items-center justify-between">
                <span>التوصيل</span>
                <span>
                  {isLoading ? "..." : `${formatPrice(deliveryFee)} ج.م`}
                </span>
              </div>

              {appliedPromo ? (
                <div className="flex items-center justify-between text-[#008C56]">
                  <span>{`خصم (${appliedPromo.discountPercent}%)`}</span>
                  <span>{`- ${formatPrice(discountAmount)} ج.م`}</span>
                </div>
              ) : null}

              <div className="border-t border-[#EEEEEE]" />

              <div className="flex items-center justify-between text-base font-semibold text-[#333333]">
                <span>الإجمالي</span>
                <span>{isLoading ? "..." : `${formatPrice(payableTotal)} ج.م`}</span>
              </div>

              <p className="text-xs text-[#999999]">
                <span className="text-[#D14343]">*</span> الأسعار شاملة للضريبة
              </p>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={isCartEmpty || isSubmitting || isLoading}
              className="mt-6 w-full rounded-sm bg-[#B47720] px-4 py-3 text-sm font-semibold text-white hover:bg-[#9F6418] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "جاري إتمام الطلب..." : "إتمام الطلب"}
            </button>
            {submitError ? (
              <p className="mt-2 text-xs text-[#D14343]">{submitError}</p>
            ) : null}
            {submitSuccess ? (
              <p className="mt-2 text-xs text-[#008C56]">{submitSuccess}</p>
            ) : null}
          </aside>

          <div className="rounded-sm border border-[#E5E5E5] bg-white p-6 shadow-sm lg:order-1">
            <h2 className="text-3xl font-bold text-[#333333]">معلومات الفاتورة</h2>
            <p className="mt-1 text-sm text-[#888888]">
              أضف البيانات المطلوبة لإتمام الطلب
            </p>

            <form
              id="checkout-form"
              className="mt-6 space-y-5"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="grid gap-4 lg:grid-cols-3">
                <div>
                  <label
                    htmlFor="first-name"
                    className="mb-2 block text-sm text-[#555555]"
                  >
                    الاسم الأول
                  </label>
                  <input
                    id="first-name"
                    type="text"
                    value={form.firstName}
                    onChange={handleFieldChange("firstName")}
                    className={`w-full rounded-sm border px-3 py-2 text-sm text-[#333333] focus:outline-none ${
                      fieldErrors.firstName
                        ? "border-[#D14343] focus:border-[#D14343]"
                        : "border-[#E5E5E5] focus:border-[#B47720]"
                    }`}
                  />
                  {fieldErrors.firstName ? (
                    <p className="mt-1 text-xs text-[#D14343]">{fieldErrors.firstName}</p>
                  ) : null}
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="mb-2 block text-sm text-[#555555]"
                  >
                    اسم العائلة
                  </label>
                  <input
                    id="last-name"
                    type="text"
                    value={form.lastName}
                    onChange={handleFieldChange("lastName")}
                    className={`w-full rounded-sm border px-3 py-2 text-sm text-[#333333] focus:outline-none ${
                      fieldErrors.lastName
                        ? "border-[#D14343] focus:border-[#D14343]"
                        : "border-[#E5E5E5] focus:border-[#B47720]"
                    }`}
                  />
                  {fieldErrors.lastName ? (
                    <p className="mt-1 text-xs text-[#D14343]">{fieldErrors.lastName}</p>
                  ) : null}
                </div>
                <div>
                  <label
                    htmlFor="company"
                    className="mb-2 block text-sm text-[#555555]"
                  >
                    اسم الشركة (اختياري)
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={form.company}
                    onChange={handleFieldChange("company")}
                    className="w-full rounded-sm border border-[#E5E5E5] px-3 py-2 text-sm text-[#333333] focus:border-[#B47720] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm text-[#555555]">
                  بريد إلكتروني
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleFieldChange("email")}
                  className={`w-full rounded-sm border px-3 py-2 text-sm text-[#333333] focus:outline-none ${
                    fieldErrors.email
                      ? "border-[#D14343] focus:border-[#D14343]"
                      : "border-[#E5E5E5] focus:border-[#B47720]"
                  }`}
                />
                {fieldErrors.email ? (
                  <p className="mt-1 text-xs text-[#D14343]">{fieldErrors.email}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="address" className="mb-2 block text-sm text-[#555555]">
                  العنوان
                </label>
                {savedAddresses.length > 0 ? (
                  <select
                    id="address"
                    value={selectedAddressId}
                    onChange={handleAddressSelect}
                    disabled={isAddressesLoading}
                    className={`w-full rounded-sm border bg-white px-3 py-2 text-sm text-[#333333] focus:outline-none disabled:cursor-not-allowed disabled:bg-[#F8F8F8] ${
                      fieldErrors.address
                        ? "border-[#D14343] focus:border-[#D14343]"
                        : "border-[#E5E5E5] focus:border-[#B47720]"
                    }`}
                  >
                    <option value="">
                      {isAddressesLoading
                        ? "جاري تحميل العناوين..."
                        : "اختر عنوانًا محفوظًا"}
                    </option>
                    {savedAddresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {formatAddressOption(address)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="address"
                    type="text"
                    value={form.address}
                    onChange={handleFieldChange("address")}
                    className={`w-full rounded-sm border px-3 py-2 text-sm text-[#333333] focus:outline-none ${
                      fieldErrors.address
                        ? "border-[#D14343] focus:border-[#D14343]"
                        : "border-[#E5E5E5] focus:border-[#B47720]"
                    }`}
                  />
                )}
                {fieldErrors.address ? (
                  <p className="mt-1 text-xs text-[#D14343]">{fieldErrors.address}</p>
                ) : null}
                {savedAddresses.length === 0 && !isAddressesLoading ? (
                  <p className="mt-2 text-xs text-[#999999]">
                    لا توجد عناوين محفوظة. أضف عنوانًا من صفحة حسابي.
                  </p>
                ) : null}
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <div>
                  <label htmlFor="country" className="mb-2 block text-sm text-[#555555]">
                    البلد
                  </label>
                  <select
                    id="country"
                    value={form.country}
                    onChange={handleFieldChange("country")}
                    className={`w-full rounded-sm border bg-white px-3 py-2 text-sm text-[#666666] focus:outline-none ${
                      fieldErrors.country
                        ? "border-[#D14343] focus:border-[#D14343]"
                        : "border-[#E5E5E5] focus:border-[#B47720]"
                    }`}
                  >
                    <option value="">اختر...</option>
                    {countrySelectOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.country ? (
                    <p className="mt-1 text-xs text-[#D14343]">{fieldErrors.country}</p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="city" className="mb-2 block text-sm text-[#555555]">
                    المدينة
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={form.city}
                    onChange={handleFieldChange("city")}
                    className={`w-full rounded-sm border px-3 py-2 text-sm text-[#333333] focus:outline-none ${
                      fieldErrors.city
                        ? "border-[#D14343] focus:border-[#D14343]"
                        : "border-[#E5E5E5] focus:border-[#B47720]"
                    }`}
                  />
                  {fieldErrors.city ? (
                    <p className="mt-1 text-xs text-[#D14343]">{fieldErrors.city}</p>
                  ) : null}
                </div>
                <div>
                  <label
                    htmlFor="postal-code"
                    className="mb-2 block text-sm text-[#555555]"
                  >
                    الرمز البريدي
                  </label>
                  <input
                    id="postal-code"
                    type="text"
                    value={form.postalCode}
                    onChange={handleFieldChange("postalCode")}
                    className="w-full rounded-sm border border-[#E5E5E5] px-3 py-2 text-sm text-[#333333] focus:border-[#B47720] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm text-[#555555]">
                  رقم الهاتف
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleFieldChange("phone")}
                  className={`w-full rounded-sm border px-3 py-2 text-sm text-[#333333] focus:outline-none ${
                    fieldErrors.phone
                      ? "border-[#D14343] focus:border-[#D14343]"
                      : "border-[#E5E5E5] focus:border-[#B47720]"
                  }`}
                />
                {fieldErrors.phone ? (
                  <p className="mt-1 text-xs text-[#D14343]">{fieldErrors.phone}</p>
                ) : null}
              </div>

              <div className="flex items-center justify-end gap-2 text-sm text-[#555555]">
                <label htmlFor="ship-address-toggle">الشحن إلى عنوان مختلف</label>
                <input
                  id="ship-address-toggle"
                  type="checkbox"
                  checked={form.shipToDifferentAddress}
                  onChange={handleShipToggle}
                  className="h-4 w-4 rounded border-[#D7D7D7] text-[#B47720] focus:ring-[#B47720]"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
