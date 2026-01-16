"use client";

import { useState } from "react";
import Image from "next/image";

type Product = {
  id: number;
  title: string;
  slogan: string;
  image: string;
  height: "short" | "medium" | "tall";
  marginTop?: string;
};

const products: Product[] = [
  {
    id: 1,
    title: "شنطة شانيل كلاسيكية",
    slogan: "اناقة و جمال",
    image: "/assets/demo/1.jpg",
    height: "tall" // h-96
  },
  {
    id: 2,
    title: "شنطة يد فاخرة",
    slogan: "تميز واضح",
    image: "/assets/demo/2.jpg",
    height: "short", // h-64
    marginTop: "mt-3 sm:mt-12 lg:mt-16 xl:mt-20",
  }, 
  {
    id: 3,
    title: "حقيبة كتف عصرية",
    slogan: "راحة وأناقة",
    image: "/assets/demo/3.jpg",
    height: "medium", // h-80
    marginTop: "mt-0 sm:mt-6 lg:mt-12 xl:mt-20",
  },
  {
    id: 4,
    title: "شنطة سهرة راقية",
    slogan: "سحر خاص",
    image: "/assets/demo/1.jpg",
    height: "tall",
    marginTop: "mt-0 sm:mt-0 lg:mt-0 xl:mt-16",
  },
  {
    id: 5,
    title: "حقيبة ظهر عملية",
    slogan: "للحياة اليومية",
    image: "/assets/demo/1.jpg",
    height: "medium",
  },
  {
    id: 6,
    title: "شنطة كروس بودي",
    slogan: "خفيفة وأنيقة",
    image: "/assets/demo/3.jpg",
    height: "short",
  },
  {
    id: 7,
    title: "حقيبة جلدية فاخرة",
    slogan: "جودة استثنائية",
    image: "/assets/demo/2.jpg",
    height: "tall",
  },
  {
    id: 8,
    title: "شنطة كلاتش أنيقة",
    slogan: "للمناسبات الخاصة",
    image: "/assets/demo/3.jpg",
    height: "short",
  },
  {
    id: 9,
    title: "شنطة كروس بودي",
    slogan: "خفيفة وأنيقة",
    image: "/assets/demo/3.jpg",
    height: "short",
  },
  {
    id: 10,
    title: "حقيبة جلدية فاخرة",
    slogan: "جودة استثنائية",
    image: "/assets/demo/2.jpg",
    height: "tall",
  },
];

const heightClasses = {
  short: "h-64",
  medium: "h-80",
  tall: "h-96",
};

export default function MasonryProducts() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="bg-[#FCF8F3] px-4 sm:px-6 md:px-10 py-8 md:py-12">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            شارك إعدادك مع{" "}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            AZAZ_BAGS#{" "}
          </h2>
        </div>

        {/* Masonry Grid */}
        <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4 md:gap-6 space-y-4 md:space-y-6">
          {products.map((product) => (
            <div
              key={product.id}
              className={`break-inside-avoid ${product.marginTop || ""}`}
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                {/* Product Image */}
                <div
                  className={`${
                    heightClasses[product.height as keyof typeof heightClasses]
                  } relative overflow-hidden bg-gray-100`}
                >
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  />

                  {/* Overlay on hover */}
                  <div
                    className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
                      hoveredId === product.id ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
