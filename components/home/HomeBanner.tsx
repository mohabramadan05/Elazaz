import Image from "next/image";

export default function HomeBanner() {
  return (
    <section className="relative h-screen overflow-hidden flex flex-col md:flex-row-reverse">
      {/* Background Image (mobile) + Left Image (desktop) */}
      <div className="absolute inset-0 md:relative md:w-1/2">
        <Image
          src="/assets/Banner.jpg"
          alt="Home banner"
          fill
          priority
          className="object-cover"
        />
        {/* Dark overlay for mobile readability */}
        <div className="absolute inset-0 bg-black/10 md:hidden" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full md:w-1/2 bg-transparent md:bg-[#fafafa] text-right p-6">
        <div className="max-w-md p-5 bg-[#fff3e386] backdrop-blur-sm rounded-xl">
          <p className="text-sm md:text-base lg:text-lg mb-4 text-[#333333]">
            وصل حديثاً
          </p>

          <h1 className="text-lg md:text-2xl lg:text-4xl font-bold mb-4 text-[#B47720]">
            اكتشف مجموعتنا الجديدة
          </h1>

          <p className="text-sm md:text-base lg:text-lg mb-6 text-[#333333]">
            لوريم إيبسوم دولور سيت أميت، كونسيكتيتور أديبيسكيغ إليت.
          </p>

          <button className="bg-[#B47720] text-white px-4 py-2 md:px-6 md:py-3 hover:bg-[#b47620ea] transition">
            اشتري الآن
          </button>
        </div>
      </div>
    </section>
  );
}
