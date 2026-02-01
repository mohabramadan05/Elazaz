import { createClient } from "@/utils/supabase/server";

type VariantImage = {
  image_url?: string | null;
  is_main?: boolean | null;
  created_at?: string | null;
};

type VariantColor = {
  name?: string | null;
  hex_code?: string | null;
};

type Variant = {
  id?: string;
  price?: number | null;
  discount_price?: number | null;
  sku?: string | null;
  color_id?: string | null;
  colors?: VariantColor | null;
  variant_images?: VariantImage[] | null;
  created_at?: string | null;
};

type Category = {
  name?: string | null;
};

type Review = {
  rating?: number | null;
};

type ProductRow = {
  id: string;
  name?: string | null;
  description?: string | null;
  is_active?: boolean | null;
  created_at?: string | null;
  category_id?: string | null;
  categories?: Category | null;
  product_variants?: Variant[] | null;
  reviews?: Review[] | null;
};

export type ShopProduct = {
  product_id?: string;
  product_name?: string | null;
  product_description?: string | null;
  product_created_at?: string | null;
  category_id?: string;
  category_name?: string;
  variant_id?: string;
  variant_price?: number;
  variant_discount_price?: number;
  variant_sku?: string | null;
  color_id?: string;
  color_name?: string;
  variant_created_at?: string | null;
  main_image_url?: string | null;
  images?: string[];
  reviews?: Review[] | null;
};

type FetchProductsArgs = {
  categoryId?: string;
};

const pickImages = (variant?: Variant) => {
  const images = (variant?.variant_images ?? []) as VariantImage[];
  if (images.length === 0) return { main: undefined, list: [] as string[] };
  const main = images.find((img) => img.is_main)?.image_url ?? images[0]?.image_url;
  const sorted = [...images].sort((a, b) => {
    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
    return bTime - aTime;
  });
  return {
    main,
    list: sorted.map((img) => img.image_url).filter(Boolean) as string[],
  };
};

export async function fetchProducts({ categoryId }: FetchProductsArgs = {}) {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(
      "id,name,description,is_active,created_at,category_id,categories(name),reviews(rating),product_variants(id,price,discount_price,sku,color_id,created_at,colors(name,hex_code),variant_images(image_url,is_main,created_at))",
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as ProductRow[];

  const flattened: ShopProduct[] = [];
  rows.forEach((product) => {
    const variants = product.product_variants ?? [];
    if (variants.length === 0) {
      flattened.push({
        product_id: product.id,
        product_name: product.name,
        product_description: product.description,
        product_created_at: product.created_at ?? null,
        category_id: product.category_id ?? undefined,
        category_name: product.categories?.name ?? undefined,
        reviews: product.reviews ?? [],
      });
      return;
    }

    variants.forEach((variant) => {
      const images = pickImages(variant);
      flattened.push({
        product_id: product.id,
        product_name: product.name,
        product_description: product.description,
        product_created_at: product.created_at ?? null,
        category_id: product.category_id ?? undefined,
        category_name: product.categories?.name ?? undefined,
        variant_id: variant.id,
        variant_price: variant.price ?? undefined,
        variant_discount_price: variant.discount_price ?? undefined,
        variant_sku: variant.sku ?? null,
        color_id: variant.color_id ?? undefined,
        color_name: variant.colors?.name ?? undefined,
        variant_created_at: variant.created_at ?? null,
        main_image_url: images.main,
        images: images.list,
        reviews: product.reviews ?? [],
      });
    });
  });

  return flattened;
}
