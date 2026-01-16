import Image from "next/image";

export default function CategorySection() {
  return (
    <section className="py-8 px-32 flex flex-col items-start bg-[#ffffff]">
      <h2 className="text-xl sm:text-2xl font-semibold mb-1 ">
        تسوق حسب الفئات
      </h2>
      <p className="text-sm sm:text-base text-gray-600 mb-10">
        تسوق احدث المنتجات المميزة المضافة جديد{" "}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
        {[
          { name: "شنط", image: "/assets/demo/1.jpg" , item_count: 120},
          { name: "احذية", image: "/assets/demo/2.jpg" , item_count: 80},
          { name: "اكسسوارات", image: "/assets/demo/3.jpg" , item_count: 45},
        ].map((category) => (
          <div key={category.name}>
            <div className="h-35 w-35 rounded-full overflow-hidden flex items-center justify-center">
              <Image
                src={category.image}
                alt={category.name}
                width={500}
                height={500}
                className="h-35 w-35 object-cover rounded-full"
              />
            </div>
            <h3 className="mt-2 text-md font-medium text-center">
              {category.name}
            </h3>
            <p className="text-[#666666] text-sm text-center">
              {category.item_count} منتج
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
