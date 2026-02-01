import ShopPageShell from "@/components/shop/ShopPageShell";
import { fetchProducts } from "@/lib/data/products";
import { fetchCategories } from "@/lib/data/categories";
import { fetchColors } from "@/lib/data/colors";

export default async function ShopPage() {
  const [products, categories, colors] = await Promise.all([
    fetchProducts(),
    fetchCategories(),
    fetchColors(),
  ]);

  return (
    <ShopPageShell
      products={products}
      categories={categories}
      colors={colors}
    />
  );
}
