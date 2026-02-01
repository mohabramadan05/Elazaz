import { notFound } from "next/navigation";
import ProductBreadcrumbs from "@/components/product/ProductBreadcrumbs";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import RelatedProducts from "@/components/product/RelatedProducts";
import { createClient } from "@/lib/supabase/server";

type ApiProduct = {
  product_id?: string;
  product_name?: string;
  product_description?: string;
  product_is_active?: boolean;
  product_created_at?: string;
  product_remaining_amount?: number;
  product_sold_amount?: number;
  category_id?: string;
  category_name?: string;
  variant_id?: string;
  variant_price?: number;
  variant_discount_price?: number;
  variant_sku?: string | null;
  color_id?: string;
  color_name?: string;
  color_hex?: string;
  size_id?: string;
  size_name?: string;
  main_image_url?: string;
  images?: string[];
  is_wishlisted?: boolean;
  reviews_avg?: number;
  reviews_count?: number;
  reviews?: unknown;
};

type PageProps = {
  params: Promise<{ variantId: string }>;
};

const uniqueBy = <T,>(items: T[], getKey: (item: T) => string) => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = getKey(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export default async function ProductPage({ params }: PageProps) {
  const { variantId: rawVariantId } = await params;
  if (!rawVariantId) {
    notFound();
  }
  const variantId = decodeURIComponent(rawVariantId);
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      variantId,
    );
  if (!isUuid) {
    notFound();
  }
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_variant_by_id", {
    p_variant_id: variantId,
  });

  if (error) {
    throw new Error(error.message);
  }

  const selectedList = Array.isArray(data) ? (data as ApiProduct[]) : [];
  const selected = selectedList[0];

  if (!selected) {
    notFound();
  }

  const { data: variantsData, error: variantsError } = selected.product_id
    ? await supabase.rpc("get_variants_by_product_id", {
        p_product_id: selected.product_id,
      })
    : { data: [], error: null };

  if (variantsError) {
    throw new Error(variantsError.message);
  }

  const variants = Array.isArray(variantsData)
    ? (variantsData as ApiProduct[])
    : [];
  const productImages = [
    selected.main_image_url,
    ...(Array.isArray(selected.images) ? selected.images : []),
  ].filter(Boolean) as string[];
  const uniqueImages = uniqueBy(productImages, (image) => image);
  const mainImage = uniqueImages[0] ?? "/assets/logo.png";
  const thumbnails = uniqueImages.slice(0, 5);

  const colors = uniqueBy(
    variants.filter((item) => item.color_name),
    (item) => item.color_id ?? item.color_name ?? "",
  );

  const sizes = uniqueBy(
    variants.filter((item) => item.size_name),
    (item) => item.size_id ?? item.size_name ?? "",
  );

  const { data: relatedData, error: relatedError } = selected.category_id
    ? await supabase.rpc("get_related_variants_by_category", {
        p_category_id: selected.category_id,
        p_product_id: selected.product_id,
        p_limit: 4,
      })
    : { data: [], error: null };

  if (relatedError) {
    throw new Error(relatedError.message);
  }

  const relatedProducts = Array.isArray(relatedData)
    ? (relatedData as ApiProduct[])
    : [];

  return (
    <main className="bg-[#FFF]">
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <ProductBreadcrumbs name={selected.product_name} />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-12">
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="order-2">
            <ProductInfo
              name={selected.product_name}
              category={selected.category_name}
              description={selected.product_description}
              variants={variants}
              colors={colors}
              sizes={sizes}
              initialVariantId={selected.variant_id}
              productRemainingAmount={selected.product_remaining_amount}
              productSoldAmount={selected.product_sold_amount}
              reviewsAvg={selected.reviews_avg}
              reviews_count={selected.reviews_count}
              isWishlisted={selected.is_wishlisted}
            />
          </section>

          <section className="order-1">
            <ProductGallery
              name={selected.product_name}
              mainImage={mainImage}
              thumbnails={thumbnails}
            />
          </section>
        </div>

        <ProductTabs
          reviews={Array.isArray(selected.reviews) ? selected.reviews : []}
          reviewsAvg={selected.reviews_avg}
          reviewsCount={selected.reviews_count}
          productId={selected.product_id}
        />

        <RelatedProducts  category={selected.category_id ?? null}  products={relatedProducts} />
      </div>
    </main>
  );
}
