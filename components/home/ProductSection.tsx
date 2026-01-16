"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";

import ProductCard from "../shared/ProductCard";

const products = [
   {
    id: 1,
    title: "شنطة مدور صدف نجوم",
    category: "موبيليات",
    price: 200,
    rating: 4.5,
    colors: ["red", "blue"],
    image: "/assets/demo/1.jpg",
    discount: 0,
    isNew: true,
  },
  {
    id: 2,
    title: "شنطة قماش نجوم",
    category: "شنط",
    price: 250,
    rating: 4,
    colors: ["black"],
    image: "/assets/demo/4.png",
    isNew: true,
    discount: 20,
  },
  {
    id: 3,
    title: "شنطة مدور صدف نجوم",
    category: "موبيليات",
    price: 200,
    rating: 4.5,
    colors: ["red", "blue"],
    image: "/assets/demo/1.jpg",
    discount: 0,
    isNew: true,
  },
  {
    id: 4,
    title: "شنطة قماش نجوم",
    category: "شنط",
    price: 250,
    rating: 4,
    colors: ["black"],
    image: "/assets/demo/4.png",
    isNew: true,
    discount: 20,
  },
  {
    id: 5,
    title: "شنطة مدور صدف نجوم",
    category: "موبيليات",
    price: 200,
    rating: 4.5,
    colors: ["red", "blue"],
    image: "/assets/demo/1.jpg",
    discount: 0,
    isNew: true,
  },
  {
    id: 6,
    title: "شنطة قماش نجوم",
    category: "شنط",
    price: 250,
    rating: 4,
    colors: ["black"],
    image: "/assets/demo/4.png",
    isNew: true,
    discount: 20,
  },
  {
    id: 7,
    title: "شنطة مدور صدف نجوم",
    category: "موبيليات",
    price: 200,
    rating: 4.5,
    colors: ["red", "blue"],
    image: "/assets/demo/1.jpg",
    discount: 0,
    isNew: true,
  },
  {
    id: 8,
    title: "شنطة قماش نجوم",
    category: "شنط",
    price: 250,
    rating: 4,
    colors: ["black"],
    image: "/assets/demo/4.png",
    isNew: true,
    discount: 20,
  },
];

export default function ProductSection() {
  return (
    <section className="py-8 px-6 xl:px-28 flex flex-col gap-6 bg-[#F8F8F8]">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-1">
            وصل حديثا
          </h2>
          <p className="text-[#666666] text-sm sm:text-base">
            تسوق احدث المنتجات المميزة المضافة جديد
          </p>
        </div>

        {/* Arrows */}
        <div className="flex gap-2">
          <button className="product-prev w-12 h-12 flex items-center justify-center bg-white border border-[#EEEEEE] rounded-full text-[#666666] hover:bg-gray-50 transition">
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
          <button className="product-next w-12 h-12 flex items-center justify-center bg-white border border-[#EEEEEE] rounded-full text-[#666666] hover:bg-gray-50 transition">
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
        </div>
      </div>

      {/* Slider */}
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: ".product-next",
          prevEl: ".product-prev",
        }}
        spaceBetween={24}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="w-full pb-4!"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
