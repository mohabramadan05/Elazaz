"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const products = [
  {
    id: 1,
    title: "شنطة شانيل",
    image: "/assets/demo/1.jpg",
    slogan: "اناقة و جمال",
  },
  {
    id: 2,
    title: "شنطة شانيل",
    image: "/assets/demo/1.jpg",
    slogan: "اناقة و جمال",
  },
  {
    id: 3,
    title: "شنطة شانيل",
    image: "/assets/demo/1.jpg",
    slogan: "اناقة و جمال",
  },
  {
    id: 4,
    title: "شنطة شانيل",
    image: "/assets/demo/1.jpg",
    slogan: "اناقة و جمال",
  },
];

export default function ProductCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <section className="bg-[#FCF8F3] px-4 sm:px-6 md:px-10 py-8 md:py-10">
      <div className="flex flex-col-reverse lg:flex-row lg:justify-center lg:items-center gap-6 md:gap-8 lg:gap-16 container mx-auto">
        {/* Text Content */}
        <div className="flex flex-col items-start max-w-md order-2 lg:order-1">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            أكثر من 50 شنطة جميلة لاقتنائها
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 md:mb-6">
            اكتشف مجموعتنا المختارة من الحقائب المصممة لرفع مستوى أناقتك
            اليومية.
          </p>
          <Link
            href="/"
            className="py-3 md:py-4 px-6 md:px-8 bg-[#B47720] text-white hover:bg-[#9d6419] transition-colors text-sm md:text-base"
          >
            استكشف المزيد
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative pb-8 lg:pb-5 w-full max-w-3xl order-1 lg:order-2">
          {/* Swiper Carousel */}
          <Swiper
            modules={[Navigation, Pagination, EffectCoverflow]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
              slideShadows: false,
            }}
            onSwiper={setSwiperInstance}
            onSlideChange={handleSlideChange}
            className="pb-12"
          >
            {products.map((product, index) => {
              const isActive = index === activeIndex;

              return (
                <SwiperSlide key={product.id} className="w-52! sm:w-60! md:w-67!">
                  <div className="relative bg-white rounded-sm overflow-hidden shadow-lg">
                    {/* Product Image */}
                    <div className="h-64 sm:h-80 md:h-96 overflow-hidden bg-gray-100 relative">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                        draggable={false}
                        sizes="(max-width: 640px) 208px, (max-width: 768px) 240px, 268px"
                      />
                    </div>

                    {/* Active Overlay - Only for active card */}
                    {isActive && (
                      <div className="absolute flex flex-row items-end bottom-0 left-0 right-0 p-2 sm:p-4">
                        <div className="pt-4 sm:pt-6 pl-6 sm:pl-10 pr-2 sm:pr-3 pb-2 flex flex-col justify-end bg-white/80 flex-1">
                          <p className="text-xs sm:text-sm md:text-base mb-1 text-[#616161]">
                            {product.title}
                          </p>
                          <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2">
                            {product.slogan}
                          </h3>
                        </div>
                        <Link href="/">
                          <div className="p-3 sm:p-4 w-10 h-10 sm:w-12 sm:h-12 flex text-white justify-center items-center bg-[#B47720] hover:bg-[#9d6419] transition-colors">
                            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Arrow Buttons */}
          <button
            onClick={() => swiperInstance?.slidePrev()}
            disabled={isBeginning}
            className={`absolute top-1/2 -translate-y-1/2 right-0 sm:right-2 z-10 p-2 sm:p-3 rounded-full transition-all duration-300 shadow-lg ${
              isBeginning
                ? "opacity-0 pointer-events-none"
                : "bg-white hover:bg-[#B47720] hover:text-white text-gray-800"
            }`}
          >
            <ChevronRight size={20} className="sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={() => swiperInstance?.slideNext()}
            disabled={isEnd}
            className={`absolute top-1/2 -translate-y-1/2 left-0 sm:left-2 z-10 p-2 sm:p-3 rounded-full transition-all duration-300 shadow-lg ${
              isEnd
                ? "opacity-0 pointer-events-none"
                : "bg-white hover:bg-[#B47720] hover:text-white text-gray-800"
            }`}
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </button>

          {/* Navigation Controls - Bottom Left */}
          <div className="absolute bottom-2 left-2 z-10 flex items-center gap-4">
            {/* Dots Indicator */}
            <div className="flex gap-2">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => swiperInstance?.slideTo(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === activeIndex
                      ? "bg-[#B47720] w-5 sm:w-6 h-2"
                      : "bg-[#D8D8D8] w-2 h-2 hover:bg-[#B47720]/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
   
      </div>
    </section>
  );
}