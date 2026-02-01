"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import RevCard from "../shared/reviewCard";

const reviews = [
  {
    id: 1,
    rate: 4,
    text: "لقد كانت تجربتنا مع عزاز للحقائب مُذهلة، لقد ساهموا في تطوير علامتنا التجارية وزيادة مبيعاتنا بشكل ملحوظ. نحن ممتنون لشراكتهم القيمة.",
    user_image: "/assets/demo/1.jpg",
    user_name: "محمد السيد",
    user_desc: "مستشار تسويق رقمي في شركة عزاز",
  },
  {
    id: 2,
    rate: 3,
    text: "لقد كانت تجربتنا مع عزاز للحقائب مُذهلة، لقد ساهموا في تطوير علامتنا التجارية وزيادة مبيعاتنا بشكل ملحوظ. نحن ممتنون لشراكتهم القيمة.",
    user_image: "/assets/demo/1.jpg",
    user_name: "محمد السيد",
    user_desc: "مستشار تسويق رقمي في شركة عزاز",
  },
  {
    id: 3,
    rate: 1,
    text: "لقد كانت تجربتنا مع عزاز للحقائب مُذهلة، لقد ساهموا في تطوير علامتنا التجارية وزيادة مبيعاتنا بشكل ملحوظ. نحن ممتنون لشراكتهم القيمة.",
    user_image: "/assets/demo/1.jpg",
    user_name: "محمد السيد",
    user_desc: "مستشار تسويق رقمي في شركة عزاز",
  },
  {
    id: 4,
    rate: 2,
    text: "لقد كانت تجربتنا مع عزاز للحقائب مُذهلة، لقد ساهموا في تطوير علامتنا التجارية وزيادة مبيعاتنا بشكل ملحوظ. نحن ممتنون لشراكتهم القيمة.",
    user_image: "/assets/demo/1.jpg",
    user_name: "محمد السيد",
    user_desc: "مستشار تسويق رقمي في شركة عزاز",
  },
  {
    id: 5,
    rate: 4,
    text: "لقد كانت تجربتنا مع عزاز للحقائب مُذهلة، لقد ساهموا في تطوير علامتنا التجارية وزيادة مبيعاتنا بشكل ملحوظ. نحن ممتنون لشراكتهم القيمة.",
    user_image: "/assets/demo/1.jpg",
    user_name: "محمد السيد",
    user_desc: "مستشار تسويق رقمي في شركة عزاز",
  },
  {
    id: 6,
    rate: 3,
    text: "لقد كانت تجربتنا مع عزاز للحقائب مُذهلة، لقد ساهموا في تطوير علامتنا التجارية وزيادة مبيعاتنا بشكل ملحوظ. نحن ممتنون لشراكتهم القيمة.",
    user_image: "/assets/demo/1.jpg",
    user_name: "محمد السيد",
    user_desc: "مستشار تسويق رقمي في شركة عزاز",
  },
  {
    id: 7,
    rate: 4,
    text: "لقد كانت تجربتنا مع عزاز للحقائب مُذهلة، لقد ساهموا في تطوير علامتنا التجارية وزيادة مبيعاتنا بشكل ملحوظ. نحن ممتنون لشراكتهم القيمة.",
    user_image: "/assets/demo/1.jpg",
    user_name: "محمد السيد",
    user_desc: "مستشار تسويق رقمي في شركة عزاز",
  },
  {
    id: 8,
    rate: 4,
    text: "لقد كانت تجربتنا مع عزاز للحقائب مُذهلة، لقد ساهموا في تطوير علامتنا التجارية وزيادة مبيعاتنا بشكل ملحوظ. نحن ممتنون لشراكتهم القيمة.",
    user_image: "/assets/demo/1.jpg",
    user_name: "محمد السيد",
    user_desc: "مستشار تسويق رقمي في شركة عزاز",
  },
];

export default function ProductSection() {
  return (
    <section className="bg-[#FFF] py-16">
      {/* container controls sizing */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 2xl:px-14 flex flex-col gap-6">
        {/* Header */}
        <div className="w-full flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-1">
              آراء العملاء
            </h2>
            <p className="text-[#666666] text-sm sm:text-base">
              بيتم استعراض بعض آراء وتعليقات المستخدمين{" "}
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

        {/* Slider */}
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: ".product-next",
            prevEl: ".product-prev",
          }}
          spaceBetween={12}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="w-full pb-4!"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id} className="h-auto">
              {/* makes cards equal height inside slide */}
              <div className="h-full">
                <RevCard review={review} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
