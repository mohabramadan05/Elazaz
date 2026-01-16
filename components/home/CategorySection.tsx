import Image from "next/image";

export default function CategorySection() {
  return (
    <section className="py-10 sm:py-12 px-4 sm:px-8 lg:px-16 flex flex-col items-center bg-[#ffffff]">
      <h2 className="text-xl sm:text-2xl font-semibold mb-1 ">تصفح المجموعة</h2>
      <p className="text-sm sm:text-base text-gray-600 mb-10">
        لوريم إيبسوم دولور سيت أميت، كونسيكتتور أديبيسكيغ إليت
      </p>
      <div className="grid w-full max-w-5xl grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        {[
          { name: "شنط", image: "/assets/demo/1.jpg" },
          { name: "احذية", image: "/assets/demo/2.jpg" },
          { name: "اكسسوارات", image: "/assets/demo/3.jpg" },
        ].map((category) => (
          <div key={category.name} className="flex flex-col items-center">
            <div className="relative w-full max-w-[220px] sm:max-w-none aspect-[4/5] rounded-lg overflow-hidden flex items-center justify-center">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 240px"
                className="object-cover"
              />
            </div>
            <h3 className="mt-2 text-lg font-medium text-center">
              {category.name}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
