import ProductCard from "./ProductCard";
import Link from "next/link";

export default function ProductSection() {
  return (
    <section className="py-3 px-4 sm:py-12 sm:px-16 flex flex-col gap-5 items-center bg-[#ffffff]">
      <h2 className="text-xl sm:text-2xl font-semibold mb-1 ">منتجاتنا</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
        {[
          {
            id: 1,
            name: "شنطة سوداء",
            category: "شنط",
            price: 124,
            image: "/assets/demo/1.jpg",
          },
          {
            id: 2,
            name: "شنطة سوداء",
            category: "شنط",
            price: 124,
            image: "/assets/demo/1.jpg",
          },
          {
            id: 3,
            name: "شنطة سوداء",
            category: "شنط",
            price: 124,
            image: "/assets/demo/1.jpg",
          },
          {
            id: 4,
            name: "شنطة سوداء",
            category: "شنط",
            price: 124,
            image: "/assets/demo/1.jpg",
          },
          {
            id: 5,
            name: "شنطة سوداء",
            category: "شنط",
            price: 124,
            image: "/assets/demo/1.jpg",
          },
          {
            id: 6,
            name: "شنطة سوداء",
            category: "شنط",
            price: 124,
            image: "/assets/demo/1.jpg",
          },
          {
            id: 7,
            name: "شنطة سوداء",
            category: "شنط",
            price: 124,
            image: "/assets/demo/1.jpg",
          },
          {
            id: 8,
            name: "شنطة سوداء",
            category: "شنط",
            price: 124,
            image: "/assets/demo/1.jpg",
          }
        ].map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
       
      </div>
       <Link href="/products" className="mt-2 flex items-center justify-center border-2 text-[#B47720] border-[#B47720] py-2 px-12 hover:bg-gray-100 transition">
          عرض المزيد 
        </Link>
    </section>
  );
}
