"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
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
        setProducts(list.slice(0, 8));
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
    <section className="bg-[#F8F8F8] py-8">
      {/* container controls sizing */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 2xl:px-14 flex flex-col gap-6">
        {/* Header */}
        <div className="w-full flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-1">وصل حديثا</h2>
            <p className="text-[#666666] text-sm sm:text-base">
              تسوق احدث المنتجات المميزة المضافة جديد
            </p>
          </div>

          {/* Arrows */}
          <div className="flex gap-2 shrink-0 self-start sm:self-auto">
            <button
              className="product-prev w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-white border border-[#EEEEEE] rounded-full text-[#666666] hover:bg-gray-50 transition"
              aria-label="prev"
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
            <button
              className="product-next w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-white border border-[#EEEEEE] rounded-full text-[#666666] hover:bg-gray-50 transition"
              aria-label="next"
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-[#666666]">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-[#666666]">
            {loadError ?? "No products available."}
          </p>
        ) : (
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".product-next",
              prevEl: ".product-prev",
            }}
            spaceBetween={12}
            slidesPerView={1.3}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="w-full pb-4!"
          >
            {products.map((product, index) => (
              <SwiperSlide
                key={product.variant_id ?? product.variant_id ?? index}
                className="h-auto"
              >
                {/* makes cards equal height inside slide */}
                <div className="h-full">
                  <ProductCard product={product} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
