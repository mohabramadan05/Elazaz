import Link from "next/link";
import ProductCard from "@/components/shared/ProductCard";

type Product = {
  product_id?: string;
  product_name?: string;
  product_description?: string;
  category_id?: string;
  category_name?: string;
  variant_id?: string;
  variant_price?: number;
  variant_discount_price?: number;
  variant_sku?: string | null;
  color_id?: string;
  color_name?: string;
  size_id?: string;
  size_name?: string;
  main_image_url?: string;
  images?: string[];
  is_wishlisted?: boolean;
};

 


type Props = {
  products: Product[];
  category: string | null;
};

export default function RelatedProducts({ products, category }: Props) {
  if (products.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#222222]">
            منتجات مشابهة
          </h2>
          <p className="text-sm text-[#777777]">
            تسوق أحدث المنتجات المميزة المضافة حديثًا
          </p>
        </div>
        <Link
          href={"/shop/category/" + category}
          className="text-sm text-[#B47720] border border-[#B47720] rounded-sm px-4 py-2 hover:bg-[#B47720] hover:text-white"
        >
          عرض الكل
        </Link>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((item) => (
          <ProductCard
            key={item.variant_id ?? item.product_id}
            product={item}
          />
        ))}
      </div>
    </div>
  );
}
