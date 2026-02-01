"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/shared/ProductCard";
import ProductCard_H from "@/components/shared/ProductCard_H";
import type { ShopProduct } from "@/lib/data/products";
import type { Category } from "@/lib/data/categories";
import type { Color } from "@/lib/data/colors";
import Link from "next/link";

type Props = {
  products: ShopProduct[];
  categories: Category[];
  colors: Color[];
  initialCategoryId?: string | null;
};

const getProductPrice = (product: ShopProduct) => {
  const base = product.variant_price ?? 0;
  const discount = product.variant_discount_price ?? 0;
  if (discount > 0 && discount < base) return discount;
  return base;
};

const getProductRating = (product: ShopProduct) => {
  const reviews = product.reviews ?? [];
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, item) => sum + (item.rating ?? 0), 0);
  return total / reviews.length;
};

export default function ShopPageShell({
  products,
  categories,
  colors,
  initialCategoryId,
}: Props) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [categoryId, setCategoryId] = useState(initialCategoryId ?? "all");
  const [colorId, setColorId] = useState("all");
  const [rating, setRating] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 24;

  const priceStats = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 0 };
    const prices = products.map(getProductPrice).filter((v) => v > 0);
    if (prices.length === 0) return { min: 0, max: 0 };
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  const [minPrice, setMinPrice] = useState(priceStats.min);
  const [maxPrice, setMaxPrice] = useState(priceStats.max);

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((product) => {
      const id = product.category_id;
      if (!id) return;
      map.set(id, (map.get(id) ?? 0) + 1);
    });
    return map;
  }, [products]);

  const colorCounts = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((product) => {
      const id = product.color_id;
      if (!id) return;
      map.set(id, (map.get(id) ?? 0) + 1);
    });
    return map;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (categoryId !== "all" && product.category_id !== categoryId) {
          return false;
        }
        if (colorId !== "all" && product.color_id !== colorId) {
          return false;
        }
        const price = getProductPrice(product);
        if (minPrice && price < minPrice) return false;
        if (maxPrice && price > maxPrice) return false;
        if (rating > 0 && getProductRating(product) < rating) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") {
          return getProductPrice(a) - getProductPrice(b);
        }
        if (sortBy === "price_desc") {
          return getProductPrice(b) - getProductPrice(a);
        }
        if (sortBy === "rating_desc") {
          return getProductRating(b) - getProductRating(a);
        }
        const aTime = a.product_created_at
          ? new Date(a.product_created_at).getTime()
          : 0;
        const bTime = b.product_created_at
          ? new Date(b.product_created_at).getTime()
          : 0;
        return bTime - aTime;
      });
  }, [products, categoryId, colorId, minPrice, maxPrice, rating, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage]);

  const handleReset = () => {
    setCategoryId("all");
    setColorId("all");
    setRating(0);
    setMinPrice(priceStats.min);
    setMaxPrice(priceStats.max);
    setSortBy("newest");
    setPage(1);
  };

  const handleCategoryChange = (next: string) => {
    setCategoryId(next);
    setPage(1);
  };

  const handleColorChange = (next: string) => {
    setColorId(next);
    setPage(1);
  };

  const handleRatingChange = (next: number) => {
    setRating(next);
    setPage(1);
  };

  const handleSortChange = (next: string) => {
    setSortBy(next);
    setPage(1);
  };

  const handleMinPriceChange = (next: number) => {
    setMinPrice(next);
    setPage(1);
  };

  const handleMaxPriceChange = (next: number) => {
    setMaxPrice(next);
    setPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages);
    setPage(safePage);
  };

  return (
    <section className="bg-[#FFFFFF] py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="text-xs text-[#888888] flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-[#B47720]">
            الرئيسية
          </Link>
          <span>/</span>
          <span className="text-[#B47720]"> كل المنتجات</span>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-6">
            <div className="rounded-sm border border-[#EEEEEE] bg-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#333333]">الفئة</h3>
                <button
                  type="button"
                  className="text-xs text-[#B47720] accent-[#F5B301] outline-none"
                  onClick={() => setCategoryId("all")}
                >
                  الكل
                </button>
              </div>
              <div className="mt-3 space-y-2 text-sm text-[#666666]">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-3 cursor-pointer select-none"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={categoryId === category.id}
                      onChange={() => handleCategoryChange(category.id ?? null)}
                      className="peer sr-only"
                    />

                    {/* Radio circle */}
                    <span className="h-4 w-4 aspect-square shrink-0 rounded-full border-2 border-[#D9D9D9] peer-checked:border-[#B47720] peer-checked:bg-[#B47720] flex items-center justify-center transition-colors">
                      {/* White inner circle when checked */}
                      <span className="h-2 w-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </span>

                    <div className="flex w-full items-center justify-between">
                      <span className="text-sm text-[#666666]">
                        {category.name ?? "—"}
                      </span>

                      <span className="text-xs text-[#999999]">
                        ({categoryCounts.get(category.id ?? "") ?? 0})
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-sm border border-[#EEEEEE] bg-white p-4">
              <h3 className="text-sm font-semibold text-[#333333]">السعر</h3>
              <div className="mt-3 flex items-center gap-2 text-xs text-[#666666]">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(event) =>
                    handleMinPriceChange(Number(event.target.value))
                  }
                  className="w-20 rounded-sm border border-[#EEEEEE] accent-[#F5B301] px-2 py-1"
                />
                <span>إلى</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(event) =>
                    handleMaxPriceChange(Number(event.target.value))
                  }
                  className="w-20 rounded-sm border border-[#EEEEEE] px-2 py-1"
                />
              </div>
            </div>

            <div className="rounded-sm border border-[#EEEEEE] bg-white p-4">
              <h3 className="text-sm font-semibold text-[#333333]">اللون</h3>
              <div className="mt-3 space-y-2 text-sm text-[#666666]">
                {colors.map((color) => (
                  <label key={color.id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="color"
                      checked={colorId === color.id}
                      onChange={() => handleColorChange(color.id)}
                      className="peer sr-only"
                    />

                    {/* Radio circle */}
                    <span className="h-4 w-4 aspect-square shrink-0 rounded-full border-2 border-[#D9D9D9] peer-checked:border-[#B47720] peer-checked:bg-[#B47720] flex items-center justify-center transition-colors">
                      {/* White inner circle when checked */}
                      <span className="h-2 w-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </span>
                    <span
                      className="inline-block h-5 w-5 aspect-square rounded-full border border-[#DDDDDD]"
                      style={
                        color.hex_code
                          ? { backgroundColor: color.hex_code }
                          : undefined
                      }
                    />
                    <div className="flex flex-row items-center justify-between w-full">
                      <span>{color.name ?? "—"}</span>
                      <span className="text-xs text-[#999999]">
                        ({colorCounts.get(color.id) ?? 0})
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-sm border border-[#EEEEEE] bg-white p-4">
              <h3 className="text-sm font-semibold text-[#333333]">التقييم</h3>
              <div className="mt-3 space-y-2 text-sm text-[#666666]">
                {[5, 4, 3, 2, 1].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleRatingChange(value)}
                    className="flex items-center gap-2 accent-[#F5B301]"
                    aria-label={`${value} نجوم فأعلى`}
                  >
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className={
                            star <= value ? "text-[#F5B301]" : "text-[#E5E5E5]"
                          }
                          aria-hidden="true"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>

                    <span
                      className={
                        rating === value ? "text-[#333333] font-semibold" : ""
                      }
                    >
                      {value} نجوم فأعلى
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full rounded-sm border border-[#B47720] px-4 py-2 text-sm font-semibold text-[#B47720] hover:bg-[#B47720] hover:text-white"
            >
              إعادة ضبط
            </button>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-[#EEEEEE] bg-white px-4 py-3 text-sm text-[#777777]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className={`h-8 w-8 flex justify-center items-center rounded-sm border ${
                    view === "grid"
                      ? "border-[#B47720] bg-[#B47720] text-[#FFFFFF]"
                      : "border-[#EEEEEE] bg-[#FFFFFF] text-[#666666]"
                  }`}
                  aria-label="grid view"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-current"
                  >
                    <path
                      d="M2 7C1.60444 7 1.21776 7.1173 0.888861 7.33706C0.559963 7.55682 0.303617 7.86918 0.152242 8.23463C0.000866562 8.60009 -0.0387401 9.00222 0.0384303 9.39018C0.115601 9.77814 0.306082 10.1345 0.585787 10.4142C0.865492 10.6939 1.22186 10.8844 1.60982 10.9616C1.99778 11.0387 2.39992 10.9991 2.76537 10.8478C3.13082 10.6964 3.44318 10.44 3.66294 10.1111C3.8827 9.78224 4 9.39556 4 9C4 8.46957 3.78929 7.96086 3.41421 7.58579C3.03914 7.21071 2.53043 7 2 7ZM2 14C1.60444 14 1.21776 14.1173 0.888861 14.3371C0.559963 14.5568 0.303617 14.8692 0.152242 15.2346C0.000866562 15.6001 -0.0387401 16.0022 0.0384303 16.3902C0.115601 16.7781 0.306082 17.1345 0.585787 17.4142C0.865492 17.6939 1.22186 17.8844 1.60982 17.9616C1.99778 18.0387 2.39992 17.9991 2.76537 17.8478C3.13082 17.6964 3.44318 17.44 3.66294 17.1111C3.8827 16.7822 4 16.3956 4 16C4 15.4696 3.78929 14.9609 3.41421 14.5858C3.03914 14.2107 2.53043 14 2 14ZM9 4C9.39556 4 9.78224 3.8827 10.1111 3.66294C10.44 3.44318 10.6964 3.13082 10.8478 2.76537C10.9991 2.39992 11.0387 1.99778 10.9616 1.60982C10.8844 1.22186 10.6939 0.865492 10.4142 0.585787C10.1345 0.306082 9.77814 0.115601 9.39018 0.0384303C9.00222 -0.0387401 8.60009 0.000866562 8.23463 0.152242C7.86918 0.303617 7.55682 0.559962 7.33706 0.88886C7.1173 1.21776 7 1.60444 7 2C7 2.53043 7.21071 3.03914 7.58579 3.41421C7.96086 3.78929 8.46957 4 9 4ZM2 0C1.60444 0 1.21776 0.117299 0.888861 0.337062C0.559963 0.556824 0.303617 0.869182 0.152242 1.23463C0.000866562 1.60009 -0.0387401 2.00222 0.0384303 2.39018C0.115601 2.77814 0.306082 3.13451 0.585787 3.41421C0.865492 3.69392 1.22186 3.8844 1.60982 3.96157C1.99778 4.03874 2.39992 3.99914 2.76537 3.84776C3.13082 3.69638 3.44318 3.44004 3.66294 3.11114C3.8827 2.78224 4 2.39556 4 2C4 1.46957 3.78929 0.96086 3.41421 0.585787C3.03914 0.210714 2.53043 0 2 0ZM9 14C8.60444 14 8.21776 14.1173 7.88886 14.3371C7.55996 14.5568 7.30362 14.8692 7.15224 15.2346C7.00087 15.6001 6.96126 16.0022 7.03843 16.3902C7.1156 16.7781 7.30608 17.1345 7.58579 17.4142C7.86549 17.6939 8.22186 17.8844 8.60982 17.9616C8.99778 18.0387 9.39992 17.9991 9.76537 17.8478C10.1308 17.6964 10.4432 17.44 10.6629 17.1111C10.8827 16.7822 11 16.3956 11 16C11 15.4696 10.7893 14.9609 10.4142 14.5858C10.0391 14.2107 9.53043 14 9 14ZM9 7C8.60444 7 8.21776 7.1173 7.88886 7.33706C7.55996 7.55682 7.30362 7.86918 7.15224 8.23463C7.00087 8.60009 6.96126 9.00222 7.03843 9.39018C7.1156 9.77814 7.30608 10.1345 7.58579 10.4142C7.86549 10.6939 8.22186 10.8844 8.60982 10.9616C8.99778 11.0387 9.39992 10.9991 9.76537 10.8478C10.1308 10.6964 10.4432 10.44 10.6629 10.1111C10.8827 9.78224 11 9.39556 11 9C11 8.46957 10.7893 7.96086 10.4142 7.58579C10.0391 7.21071 9.53043 7 9 7Z"
                      fill="currentColor"
                    />
                    <path
                      d="M16 4C16.3956 4 16.7822 3.8827 17.1111 3.66294C17.44 3.44318 17.6964 3.13082 17.8478 2.76537C17.9991 2.39992 18.0387 1.99778 17.9616 1.60982C17.8844 1.22186 17.6939 0.865492 17.4142 0.585787C17.1345 0.306082 16.7781 0.115601 16.3902 0.0384303C16.0022 -0.0387401 15.6001 0.000866562 15.2346 0.152242C14.8692 0.303617 14.5568 0.559962 14.3371 0.88886C14.1173 1.21776 14 1.60444 14 2C14 2.53043 14.2107 3.03914 14.5858 3.41421C14.9609 3.78929 15.4696 4 16 4ZM16 14C15.6044 14 15.2178 14.1173 14.8889 14.3371C14.56 14.5568 14.3036 14.8692 14.1522 15.2346C14.0009 15.6001 13.9613 16.0022 14.0384 16.3902C14.1156 16.7781 14.3061 17.1345 14.5858 17.4142C14.8655 17.6939 15.2219 17.8844 15.6098 17.9616C15.9978 18.0387 16.3999 17.9991 16.7654 17.8478C17.1308 17.6964 17.4432 17.44 17.6629 17.1111C17.8827 16.7822 18 16.3956 18 16C18 15.4696 17.7893 14.9609 17.4142 14.5858C17.0391 14.2107 16.5304 14 16 14ZM16 7C15.6044 7 15.2178 7.1173 14.8889 7.33706C14.56 7.55682 14.3036 7.86918 14.1522 8.23463C14.0009 8.60009 13.9613 9.00222 14.0384 9.39018C14.1156 9.77814 14.3061 10.1345 14.5858 10.4142C14.8655 10.6939 15.2219 10.8844 15.6098 10.9616C15.9978 11.0387 16.3999 10.9991 16.7654 10.8478C17.1308 10.6964 17.4432 10.44 17.6629 10.1111C17.8827 9.78224 18 9.39556 18 9C18 8.46957 17.7893 7.96086 17.4142 7.58579C17.0391 7.21071 16.5304 7 16 7Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => setView("list")}
                  className={`h-8 w-8 flex justify-center items-center rounded-sm border ${
                    view === "list"
                      ? "border-[#B47720] bg-[#B47720] text-[#FFFFFF]"
                      : "border-[#EEEEEE] bg-[#FFFFFF] text-[#666666]"
                  }`}
                  aria-label="list view"
                >
                  <svg
                    width="20"
                    height="16"
                    viewBox="0 0 20 16"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-current"
                  >
                    <path
                      d="M18.8889 2.28571C18.2752 2.28571 17.7778 1.77403 17.7778 1.14286C17.7778 0.51168 18.2752 0 18.8889 0C19.5025 0 20 0.51168 20 1.14286C20 1.77403 19.5025 2.28571 18.8889 2.28571ZM18.8889 9.14286C18.2752 9.14286 17.7778 8.6312 17.7778 8C17.7778 7.3688 18.2752 6.85714 18.8889 6.85714C19.5025 6.85714 20 7.3688 20 8C20 8.6312 19.5025 9.14286 18.8889 9.14286ZM17.7778 14.8571C17.7778 15.4883 18.2752 16 18.8889 16C19.5025 16 20 15.4883 20 14.8571C20 14.2259 19.5025 13.7143 18.8889 13.7143C18.2752 13.7143 17.7778 14.2259 17.7778 14.8571ZM14.4444 0C15.0581 0 15.5556 0.51168 15.5556 1.14286C15.5556 1.77403 15.0581 2.28571 14.4444 2.28571H1.11111C0.497444 2.28571 0 1.77403 0 1.14286C0 0.51168 0.497444 0 1.11111 0H14.4444ZM15.5556 8C15.5556 7.3688 15.0581 6.85714 14.4444 6.85714H1.11111C0.497444 6.85714 0 7.3688 0 8C0 8.6312 0.497444 9.14286 1.11111 9.14286H14.4444C15.0581 9.14286 15.5556 8.6312 15.5556 8ZM14.4444 13.7143C15.0581 13.7143 15.5556 14.2259 15.5556 14.8571C15.5556 15.4883 15.0581 16 14.4444 16H1.11111C0.497444 16 0 15.4883 0 14.8571C0 14.2259 0.497444 13.7143 1.11111 13.7143H14.4444Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span>ترتيب حسب:</span>
                <select
                  value={sortBy}
                  onChange={(event) => handleSortChange(event.target.value)}
                  className=" bg-white px-2 py-1 text-sm text-[#000000] focus:outline-none focus:border-[#B47720]"
                >
                  <option value="newest">الأحدث</option>
                  <option value="price_asc">السعر: الأقل</option>
                  <option value="price_desc">السعر: الأعلى</option>
                  <option value="rating_desc">الأعلى تقييماً</option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="mt-6 flex flex-col justify-center items-center gap-2 bg-white p-6 text-center text-sm text-[#666666]">
                <svg
                  width="135"
                  height="135"
                  viewBox="0 0 135 135"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M66.8359 130.836C101.813 130.836 130.168 102.481 130.168 67.5039C130.168 32.5266 101.813 4.17188 66.8359 4.17188C31.8586 4.17188 3.50391 32.5266 3.50391 67.5039C3.50391 102.481 31.8586 130.836 66.8359 130.836Z"
                    fill="#F8F8F8"
                  />
                  <path
                    d="M16.8339 123.282C17.5238 121.759 16.8276 119.956 15.3045 119.266C13.7814 118.576 11.987 119.251 11.2971 120.775C10.6073 122.298 11.2737 124.113 12.7968 124.802C14.3199 125.492 16.1441 124.805 16.8339 123.282ZM21.3097 129.241C21.7488 128.271 21.3056 127.123 20.3362 126.684C19.3668 126.245 18.2248 126.675 17.7857 127.645C17.3466 128.614 17.7708 129.769 18.7402 130.208C19.7096 130.647 20.8706 130.21 21.3097 129.241ZM122.838 12.2493C123.927 10.9807 123.764 9.05427 122.496 7.96501C121.227 6.87576 119.315 7.02105 118.226 8.28971C117.137 9.55827 117.268 11.4872 118.536 12.5765C119.805 13.6657 121.748 13.5179 122.838 12.2493ZM125.463 19.2238C126.156 18.4164 126.053 17.1903 125.245 16.497C124.438 15.8037 123.221 15.8962 122.528 16.7036C121.835 17.511 121.918 18.7388 122.725 19.432C123.533 20.1253 124.77 20.0313 125.463 19.2238ZM14.6764 18.2539C15.7658 16.9852 15.6032 15.0588 14.3347 13.9695C13.0661 12.8803 11.1543 13.0256 10.065 14.2942C8.97574 15.5628 9.10649 17.4917 10.375 18.581C11.6436 19.6702 13.5872 19.5224 14.6764 18.2539Z"
                    fill="#E6E6E6"
                  />
                  <path
                    d="M115.061 61.7441H13.2578L28.6006 26.8623C30.3765 22.3789 34.6333 19.4844 39.4604 19.4844H88.8589C93.686 19.4844 97.9429 22.3789 99.7188 26.8623L115.061 61.7441ZM20.9189 56.7441H107.4L95.082 28.7344C94.0732 26.1523 91.6304 24.4844 88.8589 24.4844H39.4604C36.689 24.4844 34.2461 26.1523 33.2373 28.7344L33.1973 28.8311L20.9189 56.7441Z"
                    fill="#CCCCCC"
                  />
                  <path
                    d="M82.9043 21.9853C82.9043 24.6967 81.0143 26.9628 78.481 27.5368C78.0654 27.6455 77.63 27.6951 77.1847 27.6951H54.8603C54.415 27.6951 53.9796 27.6455 53.5639 27.5368C51.0208 26.9628 49.1406 24.6967 49.1406 21.9853C49.1406 18.7487 51.7689 16.2656 54.8603 16.2656H77.1847C77.63 16.2656 78.0654 16.3152 78.481 16.4241C81.0143 16.9979 82.9043 19.2739 82.9043 21.9853Z"
                    fill="url(#paint0_linear_161_12654)"
                  />
                  <path
                    d="M55.7434 16.2676V27.697H54.8628C54.4175 27.697 53.9821 27.6475 53.5664 27.5388V16.4261C54.431 16.1994 55.1204 16.2851 55.7434 16.2676Z"
                    fill="url(#paint1_linear_161_12654)"
                  />
                  <path
                    d="M61.4331 16.2656H59.2461V27.6946H61.4331V16.2656Z"
                    fill="url(#paint2_linear_161_12654)"
                  />
                  <path
                    d="M67.1128 16.2656H64.9258V27.6946H67.1128V16.2656Z"
                    fill="url(#paint3_linear_161_12654)"
                  />
                  <path
                    d="M72.7903 16.2656H70.6133V27.6946H72.7903V16.2656Z"
                    fill="url(#paint4_linear_161_12654)"
                  />
                  <path
                    d="M78.4838 16.4241V27.5368C78.0682 27.6455 77.6328 27.6951 77.1875 27.6951H76.2969V16.2656H77.1875C77.6328 16.2656 78.0682 16.3152 78.4838 16.4241Z"
                    fill="url(#paint5_linear_161_12654)"
                  />
                  <path
                    d="M123.299 53.6597V64.703C123.299 66.2468 122.043 67.5036 120.489 67.5036H7.82781C6.2742 67.5036 5.02734 66.2468 5.02734 64.703V53.6597C5.02734 52.1159 6.2742 50.8594 7.82781 50.8594H120.489C122.043 50.8594 123.299 52.1159 123.299 53.6597Z"
                    fill="url(#paint6_linear_161_12654)"
                  />
                  <path
                    d="M116.353 67.5L109.585 103.827C108.605 109.101 103.994 112.931 98.6303 112.931H29.6879C24.3244 112.931 19.723 109.101 18.7334 103.827L11.9648 67.5H116.353Z"
                    fill="url(#paint7_linear_161_12654)"
                  />
                  <path
                    d="M45.4225 79.1937V96.6776C45.4225 99.2915 43.3036 101.41 40.6898 101.41H40.6898C38.076 101.41 35.957 99.2915 35.957 96.6776V79.1937C35.957 76.5799 38.076 74.4609 40.6898 74.4609H40.6898C43.3036 74.4609 45.4225 76.5799 45.4225 79.1937Z"
                    fill="url(#paint8_linear_161_12654)"
                  />
                  <path
                    d="M68.4225 79.1937V96.6776C68.4225 99.2915 66.3036 101.41 63.6898 101.41H63.6898C61.076 101.41 58.957 99.2915 58.957 96.6776V79.1937C58.957 76.5799 61.076 74.4609 63.6898 74.4609H63.6898C66.3036 74.4609 68.4225 76.5799 68.4225 79.1937Z"
                    fill="url(#paint9_linear_161_12654)"
                  />
                  <path
                    d="M91.4225 79.1937V96.6776C91.4225 99.2915 89.3036 101.41 86.6898 101.41H86.6898C84.076 101.41 81.957 99.2915 81.957 96.6776V79.1937C81.957 76.5799 84.076 74.4609 86.6898 74.4609H86.6898C89.3036 74.4609 91.4225 76.5799 91.4225 79.1937Z"
                    fill="url(#paint10_linear_161_12654)"
                  />
                  <path
                    d="M114.474 118.847C123.879 118.847 131.503 111.223 131.503 101.818C131.503 92.4132 123.879 84.7891 114.474 84.7891C105.069 84.7891 97.4453 92.4132 97.4453 101.818C97.4453 111.223 105.069 118.847 114.474 118.847Z"
                    fill="url(#paint11_linear_161_12654)"
                  />
                  <path
                    d="M124.801 102.168V102.168C124.801 104.228 123.131 105.898 121.07 105.898H108.621C106.56 105.898 104.89 104.228 104.89 102.168V102.168C104.89 100.108 106.56 98.4375 108.621 98.4375H121.07C123.131 98.4375 124.801 100.108 124.801 102.168Z"
                    fill="url(#paint12_linear_161_12654)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_161_12654"
                      x1="49.1411"
                      y1="21.9802"
                      x2="82.9041"
                      y2="21.9802"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#BDBDBD" />
                      <stop offset="1" stop-color="#CACACA" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_161_12654"
                      x1="53.5666"
                      y1="21.9811"
                      x2="55.7436"
                      y2="21.9811"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#D6DCE8" />
                      <stop offset="1" stop-color="white" />
                    </linearGradient>
                    <linearGradient
                      id="paint2_linear_161_12654"
                      x1="59.2461"
                      y1="21.9806"
                      x2="61.4331"
                      y2="21.9806"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#E7E7E7" />
                      <stop offset="1" stop-color="white" />
                    </linearGradient>
                    <linearGradient
                      id="paint3_linear_161_12654"
                      x1="64.9258"
                      y1="21.9806"
                      x2="67.1128"
                      y2="21.9806"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#E7E7E7" />
                      <stop offset="1" stop-color="white" />
                    </linearGradient>
                    <linearGradient
                      id="paint4_linear_161_12654"
                      x1="70.6133"
                      y1="21.9806"
                      x2="72.7903"
                      y2="21.9806"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#D6DCE8" />
                      <stop offset="1" stop-color="white" />
                    </linearGradient>
                    <linearGradient
                      id="paint5_linear_161_12654"
                      x1="76.2968"
                      y1="21.9802"
                      x2="78.4838"
                      y2="21.9802"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#D6DCE8" />
                      <stop offset="1" stop-color="white" />
                    </linearGradient>
                    <linearGradient
                      id="paint6_linear_161_12654"
                      x1="63.9143"
                      y1="51.9466"
                      x2="64.1983"
                      y2="60.1876"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#EAEAEA" />
                      <stop offset="1" stop-color="#CACACA" />
                    </linearGradient>
                    <linearGradient
                      id="paint7_linear_161_12654"
                      x1="63.915"
                      y1="56.718"
                      x2="65.046"
                      y2="106.63"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#E2E2E2" />
                      <stop offset="1" stop-color="#E7E7E7" />
                    </linearGradient>
                    <linearGradient
                      id="paint8_linear_161_12654"
                      x1="35.9566"
                      y1="87.9354"
                      x2="45.4226"
                      y2="87.9354"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="white" />
                      <stop offset="1" stop-color="#F2F2F2" />
                    </linearGradient>
                    <linearGradient
                      id="paint9_linear_161_12654"
                      x1="58.9566"
                      y1="87.9354"
                      x2="68.4226"
                      y2="87.9354"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="white" />
                      <stop offset="1" stop-color="#F2F2F2" />
                    </linearGradient>
                    <linearGradient
                      id="paint10_linear_161_12654"
                      x1="81.9566"
                      y1="87.9354"
                      x2="91.4226"
                      y2="87.9354"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="white" />
                      <stop offset="1" stop-color="#F2F2F2" />
                    </linearGradient>
                    <linearGradient
                      id="paint11_linear_161_12654"
                      x1="97.4463"
                      y1="101.818"
                      x2="131.503"
                      y2="101.818"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#CACACA" />
                      <stop offset="1" stop-color="#CDCDCD" />
                    </linearGradient>
                    <linearGradient
                      id="paint12_linear_161_12654"
                      x1="104.89"
                      y1="102.168"
                      x2="124.801"
                      y2="102.168"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#F7F7F7" />
                      <stop offset="1" stop-color="white" />
                    </linearGradient>
                  </defs>
                </svg>

                <p className="text-[#666666] text-xl font-semibold ">لا توجد منتجات حتى الآن</p>
                <p className="text-[#A5A5A5]">بحثك لم يطابق أي منتجات</p>
              </div>
            ) : view === "list" ? (
              <div className="mt-6 flex flex-col gap-4">
                {pagedProducts.map((product, index) => (
                  <ProductCard_H
                    key={product.variant_id ?? index}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                {pagedProducts.map((product, index) => (
                  <ProductCard
                    key={product.variant_id ?? index}
                    product={product}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 ? (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-9 min-w-9 rounded-sm border border-[#EEEEEE] px-3 text-sm text-[#666666] disabled:opacity-50"
                >
                  السابق
                </button>
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => handlePageChange(pageNumber)}
                      className={`h-9 min-w-9 rounded-sm border px-3 text-sm ${
                        pageNumber === currentPage
                          ? "border-[#B47720] bg-[#B47720] text-white"
                          : "border-[#EEEEEE] text-[#666666]"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-9 min-w-9 rounded-sm border border-[#EEEEEE] px-3 text-sm text-[#666666] disabled:opacity-50"
                >
                  التالي
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
