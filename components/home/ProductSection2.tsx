"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "../shared/ProductCard";

type ApiProduct = {
  product_id?: string;
  product_name?: string;
  product_description?: string;
  product_is_active?: boolean;
  product_created_at?: string;
  category_id?: string;
  category_name?: string;
  variant_id?: string;
  variant_price?: number;
  variant_discount_price?: number;
  variant_sku?: string | null;
  color_id?: string;
  color_name?: string;
  size_id?: string;
  size_name?: string;
  main_image_url?: string;
  images?: string[];
  is_wishlisted?: boolean;
};

export default function ProductSection() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadProducts = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const response = await fetch("/api/products", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Failed to load products.");
        const data = (await response.json()) as ApiProduct[];
        if (!isMounted) return;
        const list = Array.isArray(data) ? data : [];
        const discounted = list.filter(
          (item) => (item.variant_discount_price ?? 0) > 0
        );
        setProducts(discounted.slice(0, 8));
      } catch (error) {
        if (!isMounted) return;
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLoadError(
          error instanceof Error ? error.message : "Failed to load products."
        );
        setProducts([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <section className="bg-[#F8F8F8] py-8" dir="rtl">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 2xl:px-14 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-1">
              منتجات خاصة{" "}
            </h2>
            <p className="text-[#666666] text-sm sm:text-base">
              تسوق احدث المنتجات المميزة المضافة جديد{" "}
            </p>
          </div>

          <Link
            href="/shop/offers"
            className="
              flex items-center gap-2
              border border-[#B47720]
              text-[#B47720]
              rounded-md
              px-3 py-2
              text-sm
              hover:bg-[#B47720]/10
              transition
              shrink-0
              self-start sm:self-auto
            "
          >
            <span>عرض الكل</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.6409 14.0002C10.4644 14.0002 10.2879 13.9322 10.1521 13.7961L4.87035 8.50352C4.74815 8.38107 4.66669 8.20419 4.66669 8.01371C4.66669 7.83684 4.73458 7.61915 4.87035 7.4967L10.1521 2.20409C10.4236 1.93197 10.8581 1.93197 11.1297 2.20409C11.4012 2.4762 11.4012 2.91158 11.1297 3.18369L6.30959 8.00011L11.1297 12.8301C11.4012 13.1022 11.4012 13.5376 11.1297 13.8097C10.9939 13.9322 10.8174 14.0002 10.6409 14.0002Z"
                fill="#B47720"
              />
            </svg>
          </Link>
        </div>

        {isLoading ? (
          <p className="text-sm text-[#666666]">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-[#666666]">
            {loadError ?? "No discounted products available."}
          </p>
        ) : (
          <div
            className="
              grid
              grid-cols-2
              gap-4
              sm:gap-5
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
            "
          >
            {products.map((product, index) => (
              <div
                key={product.variant_id ?? product.variant_id ?? index}
                className="h-full"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
