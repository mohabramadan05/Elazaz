import Image from "next/image";

export default function CategorySection() {
  return (
    <section className="py-12 px-16 flex flex-col items-center bg-[#ffffff]">
      <h2 className="text-xl sm:text-2xl font-semibold mb-1 ">تصفح المجموعة</h2>
      <p className="text-sm sm:text-base text-gray-600 mb-10">
        لوريم إيبسوم دولور سيت أميت، كونسيكتتور أديبيسكيغ إليت
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { name: "شنط", image: "/assets/demo/1.jpg" },
          { name: "احذية", image: "/assets/demo/2.jpg" },
          { name: "اكسسوارات", image: "/assets/demo/3.jpg" },
        ].map((category) => (
          <div key={category.name}>
            <div className="h-47.5 w-40 md:h-59 md:w-50 lg:h-85 lg:w-71.5 xl:h-95 xl:w-80 rounded-lg overflow-hidden flex items-center justify-center">
              <Image
                src={category.image}
                alt={category.name}
                width={500}
                height={500}
                className="h-47.5 w-40 md:h-59 md:w-50 lg:h-85 lg:w-71.5 xl:h-95 xl:w-80 object-cover rounded-lg"
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
