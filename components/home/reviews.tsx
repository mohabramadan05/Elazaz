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
    rate: 5,
    text: "جودة الحقائب فاقت توقعاتي تمامًا، الخامات راقية والتفاصيل محكمة. سعيد جدًا بتجربتي مع الأزاز.",
    user_image: "https://i.pravatar.cc/150?img=11",
    user_name: "محمد السيد",
    user_desc: "مدير تطوير الأعمال في شركة النخبة",
  },
  {
    id: 2,
    rate: 4,
    text: "التغليف كان أنيقًا جدًا والطلب وصل في الوقت المحدد. يبدو واضحًا أن الفريق يهتم بأدق التفاصيل.",
    user_image: "https://i.pravatar.cc/150?img=47",
    user_name: "سارة أحمد",
    user_desc: "مديرة المبيعات في مجموعة الفجر التجارية",
  },
  {
    id: 3,
    rate: 5,
    text: "تعاملت مع فريق خدمة العملاء وكانوا في غاية الاحترافية والسرعة في الرد. تجربة شراء ممتازة من البداية للنهاية.",
    user_image: "https://i.pravatar.cc/150?img=15",
    user_name: "خالد العمري",
    user_desc: "رئيس قسم التسويق في شركة رؤية",
  },
  {
    id: 4,
    rate: 4,
    text: "المنتج بجودة عالية جدًا، الخياطة متقنة والجلد أصلي. سأطلب منهم مجددًا بكل تأكيد.",
    user_image: "https://i.pravatar.cc/150?img=32",
    user_name: "نورا الزهراني",
    user_desc: "مستشارة العلامات التجارية في ستوديو إبداع",
  },
  {
    id: 5,
    rate: 3,
    text: "وصل الطلب مغلفًا بشكل جميل ومحمي جيدًا. الحقيبة بحالة ممتازة تمامًا كما هو موضح في الصور.",
    user_image: "https://i.pravatar.cc/150?img=18",
    user_name: "عمر الشريف",
    user_desc: "صاحب متجر الأناقة للأكسسوارات",
  },
  {
    id: 6,
    rate: 5,
    text: "خدمة عملاء استثنائية، ساعدوني في اختيار المنتج المناسب وأجابوا على كل أسئلتي بصبر واهتمام.",
    user_image: "https://i.pravatar.cc/150?img=44",
    user_name: "ريم الحربي",
    user_desc: "مديرة العمليات في شركة لمسة فاخرة",
  },
  {
    id: 7,
    rate: 4,
    text: "الحقيبة تستحق كل ريال، جودة الصنعة تتحدث عن نفسها. أنصح الجميع بتجربة منتجات الأزاز.",
    user_image: "https://i.pravatar.cc/150?img=52",
    user_name: "يوسف الغامدي",
    user_desc: "مؤسس منصة تسوق أونلاين",
  },
  {
    id: 8,
    rate: 5,
    text: "سرعة التوصيل كانت مفاجأة رائعة، والتغليف الفاخر أضاف لمسة مميزة. منتج رائع بكل المقاييس.",
    user_image: "https://i.pravatar.cc/150?img=39",
    user_name: "لينا مصطفى",
    user_desc: "مديرة التسويق الرقمي في مجموعة بريق",
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
