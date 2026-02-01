"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";


type Category = {
  id: number;
  name: string;
  image_url: string | null;
  parent_id: number | null;
  product_count: number;
};

export default function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: Category[]) => {
        if (!isMounted) return;
        setCategories(data.filter((category) => category.parent_id == null));
      })
      .catch(() => {
        if (!isMounted) return;
        setCategories([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-8 md:py-12 lg:py-15 px-4 md:px-8 lg:px-20 xl:px-50 flex flex-col items-start bg-[#ffffff]">
      {/* Header */}
      <div className="w-full mb-6 md:mb-8 lg:mb-10">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-1 md:mb-2">
          تسوق حسب الفئات
        </h2>
        <p className="text-sm md:text-base text-gray-600">
          تسوق احدث المنتجات المميزة المضافة جديد
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10 w-full">
        {categories.map((category) => (
          <Link
            href={"/shop/category/"+category.id}
            key={category.id}
            className="flex flex-col items-center cursor-pointer group"
          >
            {/* Image Container */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-35 xl:h-35 rounded-full overflow-hidden mb-3 md:mb-4 transition-transform duration-300 group-hover:scale-105">
              <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/10 group-hover:to-black/20 transition-all duration-300" />
              <Image
                src={
                  category.image_url ||
                  `https://via.placeholder.com/400x400/B47720/FFFFFF?text=${category.name}`
                }
                alt={category.name}
                width={1000}
                height={1000}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Category Name */}
            <h3 className="text-base md:text-lg lg:text-xl font-medium text-center mb-1 group-hover:text-[#B47720] transition-colors duration-300">
              {category.name}
            </h3>

            {/* Item Count */}
            <p className="text-[#666666] text-xs md:text-sm text-center">
              {category.product_count} منتج
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
