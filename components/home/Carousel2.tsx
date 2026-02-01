"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    title: "أفضل التخفيضات 2025",
    subtitle:
      "عزاز للشنط والأحذية يقدم أحدث تشكيلات الحقائب من أرقى الماركات العالمية لهذا العام.",
    button: "اكتشف المزيد",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1920",
  },
  {
    title: "أناقة لا تُضاهى",
    subtitle:
      "تصاميم جلدية فاخرة تجمع بين الكلاسيك والعصرية لتناسب جميع الأذواق.",
    button: "تسوق الآن",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1920",
  },
  {
    title: "مجموعة حصرية",
    subtitle: "اكتشفي أحدث صيحات الموضة في عالم الشنط الفاخرة بأسعار مميزة.",
    button: "استكشف المجموعة",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1920",
  },
];

export default function LuxuryBagsSwiper() {
  return (
    <section className="relative w-full h-105 sm:h-130 lg:h-160 overflow-hidden bg-black">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        loop
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={{
          nextEl: ".lux-next",
          prevEl: ".lux-prev",
        }}
        className="h-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-full">
              {/* Background */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />

              {/* Black fade */}
              <div className="absolute inset-0 bg-[#b47620cb]" />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4 sm:px-8">
                <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold mb-3 sm:mb-4">
                  {slide.title}
                </h1>
                <p className="max-w-3xl text-sm sm:text-base lg:text-lg opacity-90 mb-6 sm:mb-8">
                  {slide.subtitle}
                </p>
                <button className="bg-[#FFF] hover:bg-[#FFFFFFD1] text-[#333] px-6 py-2 text-sm sm:px-10 sm:py-3 sm:text-base rounded-sm font-semibold transition">
                  {slide.button}
                </button>
              </div>

              {/* Brand
              <div className="absolute bottom-6 right-6 text-3xl font-bold text-white/70">
                elazaz
              </div> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation */}
      <button className="lux-prev absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#EEEEEE] hover:bg-white/30 backdrop-blur flex items-center justify-center">
        <ChevronLeft className="text-white" />
      </button>

      <button className="lux-next absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#EEEEEE] hover:bg-white/30 backdrop-blur flex items-center justify-center">
        <ChevronRight className="text-white" />
      </button>

      {/* Pagination style */}
      <style jsx global>{`
        .swiper-pagination {
          bottom: 16px !important;
          display: flex;
          justify-content: center;
          gap: 8px;
        }
        .swiper-pagination-bullet {
          width: 14px;
          height: 14px;
          background: transparent;
          border: 1px solid #eeeeee;
          opacity: 1;
          transition: 0.3s;
        }
        .swiper-pagination-bullet-active {
          width: 36px;
          border-radius: 6px;
          background: #b47720;
          opacity: 1;
          border: none;
        }
        @media (min-width: 640px) {
          .swiper-pagination {
            bottom: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}
