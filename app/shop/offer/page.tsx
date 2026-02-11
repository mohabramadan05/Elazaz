import ShopPageShell from "@/components/shop/ShopPageShell";
import { fetchProducts } from "@/lib/data/products";
import { fetchCategories } from "@/lib/data/categories";
import { fetchColors } from "@/lib/data/colors";

export default async function ShopOfferPage() {
  const [products, categories, colors] = await Promise.all([
    fetchProducts(),
    fetchCategories(),
    fetchColors(),
  ]);

  const offerProducts = products.filter(
    (product) => (product.variant_discount_price ?? 0) > 0,
  );

  return (
    <ShopPageShell
      products={offerProducts}
      categories={categories}
      colors={colors}
    />
  );
}
