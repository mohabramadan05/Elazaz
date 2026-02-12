"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type CartItem = {
  id: string;
  quantity: number;
  variant_id?: string | null;
  product_name?: string | null;
  color_name?: string | null;
  size_name?: string | null;
  variant_price?: number | null;
  variant_discount_price?: number | null;
  main_image_url?: string | null;
};

type CartResponse = {
  items: CartItem[];
};

const getUnitPrice = (item: CartItem) => {
  const base = item.variant_price ?? 0;
  const discount = item.variant_discount_price ?? 0;
  if (discount > 0 && discount < base) return discount;
  return base;
};

const formatPrice = (value: number) => {
  return value.toLocaleString("en-US");
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      const price = getUnitPrice(item);
      return total + price * (item.quantity ?? 1);
    }, 0);
  }, [items]);

  const handleQuantityChange = async (
    itemId: string,
    action: "increment" | "decrement",
  ) => {
    if (updatingId) return;
    setUpdatingId(itemId);
    try {
      const response = await fetch("/api/cart/item", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, action }),
      });
      if (!response.ok) return;
      const payload = (await response.json()) as {
        id: string;
        quantity: number;
      };
      setItems((prev) =>
        prev.map((item) =>
          item.id === payload.id
            ? { ...item, quantity: payload.quantity }
            : item,
        ),
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (deletingId) return;
    setDeletingId(itemId);
    try {
      const response = await fetch("/api/cart/item", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });
      if (!response.ok) return;
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="bg-[#FFFFFF] py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="text-xs text-[#888888] flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-[#B47720]">
            الرئيسية
          </Link>
          <span>/</span>
          <span className="text-[#B47720]">سلة التسوق</span>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {isLoading ? (
              <div className="rounded-sm border border-[#EEEEEE] bg-white p-6 text-sm text-[#666666]">
                جاري تحميل السلة...
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-sm border border-[#EEEEEE] bg-white p-6 text-sm text-[#666666]">
                لا توجد منتجات في السلة حالياً.
              </div>
            ) : (
              items.map((item) => {
                const unitPrice = getUnitPrice(item);
                const lineTotal = unitPrice * (item.quantity ?? 1);
                const image = item.main_image_url || "/assets/logo.png";
                return (
                  <div
                    key={item.id}
                    className="rounded-sm border border-[#EEEEEE] bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <Image
                          src={image}
                          alt={item.product_name ?? "Product"}
                          width={80}
                          height={80}
                          className="h-20 w-20 rounded-sm border border-[#EEEEEE] object-cover"
                        />
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#333333]">
                            {item.product_name ?? "منتج"} {item.color_name ? item.color_name : ""} , {item.size_name ? item.size_name : ""}
                          </p>
                          {/* {(item.color_name || item.size_name) && (
                            <p className="text-xs text-[#888888]">
                              {item.color_name ? `اللون: ${item.color_name}` : ""}
                              {item.size_name ? `المقاس: ${item.size_name}` : ""}
                            </p>
                          )} */}
                          <p className="text-xs text-[#888888] mt-1">
                            {formatPrice(unitPrice)} ج.م
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-8 md:gap-12 justify-end items-center">
                        <div className="flex items-center rounded-sm border border-[#EEEEEE] px-3 py-2 text-sm text-[#666666]">
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(item.id, "increment")
                            }
                            disabled={updatingId === item.id}
                            className="px-2 text-lg text-[#999999] disabled:opacity-60"
                            aria-label="زيادة الكمية"
                          >
                            +
                          </button>
                          <span className=" border border-[#EEEEEE] py-3 mx-2"></span>

                          <span className="min-w-8 text-center text-sm text-[#333333]">
                            {item.quantity ?? 1}
                          </span>

                          <span className=" border border-[#EEEEEE] py-3 mx-2"></span>
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(item.id, "decrement")
                            }
                            disabled={
                              updatingId === item.id || item.quantity <= 1
                            }
                            className="px-2 text-lg text-[#999999] disabled:opacity-60"
                            aria-label="تقليل الكمية"
                          >
                            −
                          </button>
                        </div>
                        <div className="text-sm md:text-base font-semibold text-[#333333]">
                          {formatPrice(lineTotal)} ج.م
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="h-8 w-8 rounded-full flex justify-center items-center bg-[#F8F8F8] text-[#444444] hover:bg-[#B47720] hover:text-[#FFFFFF] disabled:opacity-60"
                          aria-label="حذف المنتج"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-current"
                          >
                            <path
                              d="M2.19526 3.13807C1.93491 2.87772 1.93491 2.45561 2.19526 2.19526C2.45562 1.93491 2.87772 1.93491 3.13807 2.19526L5.99999 5.05718L8.86189 2.19526C9.12225 1.93491 9.54438 1.93491 9.80473 2.19526C10.0651 2.45561 10.0651 2.87772 9.80473 3.13807L6.94279 5.99999L9.80473 8.86189C10.0651 9.12225 10.0651 9.54438 9.80473 9.80473C9.54438 10.0651 9.12225 10.0651 8.86189 9.80473L5.99999 6.94279L3.13807 9.80473C2.87772 10.0651 2.45562 10.0651 2.19526 9.80473C1.93491 9.54438 1.93491 9.12225 2.19526 8.86189L5.05718 5.99999L2.19526 3.13807Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <aside className="h-fit rounded-sm border border-[#EEEEEE] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#333333]">ملخص الطلب</h3>
            <div className="mt-4 space-y-3 text-sm text-[#666666]">
              <div className="flex items-center justify-between">
                <span>مجموع المنتجات</span>
                <span>{formatPrice(subtotal)} ج.م</span>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-[#666666]">هل لديك كود خصم</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="أدخل كود الخصم"
                    className="w-full rounded-sm border border-[#EEEEEE] px-3 py-2 text-sm text-[#666666] focus:border-[#B47720] focus:outline-none"
                  />
                  <button
                    type="button"
                    className="rounded-sm border border-[#B47720] px-4 py-2 text-sm font-semibold text-[#B47720] hover:bg-[#B47720] hover:text-white"
                  >
                    إضافة
                  </button>
                </div>
              </div>

              <div className="border-t border-[#EEEEEE]" />

              <div className="flex items-center justify-between text-base font-semibold text-[#333333]">
                <span>الإجمالي</span>
                <span>{formatPrice(subtotal)} ج.م</span>
              </div>

              <p className="text-xs text-[#999999]">* الأسعار شاملة للضريبة</p>
            </div>

            <button
              type="button"
              className="mt-6 w-full rounded-sm bg-[#B47720] px-4 py-3 text-sm font-semibold text-white hover:bg-[#9F6418]"
            >
              إتمام الطلب
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}
