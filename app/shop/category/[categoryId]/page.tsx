import ShopPageShell from "@/components/shop/ShopPageShell";
import { fetchProducts } from "@/lib/data/products";
import { fetchCategoryById, fetchCategories } from "@/lib/data/categories";
import { fetchColors } from "@/lib/data/colors";

type PageProps = {
  params: Promise<{ categoryId: string }>;
};

export default async function ShopCategoryPage({ params }: PageProps) {
  const { categoryId } = await params;
  const [products, category, categories, colors] = await Promise.all([
    fetchProducts({ categoryId }),
    fetchCategoryById(categoryId),
    fetchCategories(),
    fetchColors(),
  ]);

  const title = `قسم: ${category?.name ?? "منتجات القسم"}`;

  return (
    <ShopPageShell
      title={title}
      products={products}
      categories={categories}
      colors={colors}
      initialCategoryId={categoryId}
    />
  );
}
