import ShopPageShell from "@/components/shop/ShopPageShell";
import { fetchProducts } from "@/lib/data/products";
import { fetchCategories } from "@/lib/data/categories";
import { fetchColors } from "@/lib/data/colors";

type PageProps = {
  searchParams?: Promise<{
    q?: string | string[];
  }>;
};

export default async function ShopPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const rawQuery = resolvedSearchParams.q;
  const searchQuery = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery;

  const [products, categories, colors] = await Promise.all([
    fetchProducts({ searchQuery }),
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
