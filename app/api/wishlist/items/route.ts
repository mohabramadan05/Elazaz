import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type VariantImage = {
  image_url?: string | null;
  is_main?: boolean | null;
  created_at?: string | null;
};

type VariantColor = {
  name?: string | null;
};

type VariantSize = {
  name?: string | null;
};

type VariantProduct = {
  name?: string | null;
};

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ items: [] });
  }

  const { data: rows, error } = await supabase
    .from("wishlist_variants")
    .select(
      "id,variant_id,created_at,product_variants(id,price,discount_price,sku,product_id,products(name),colors(name),sizes(name),variant_images(image_url,is_main,created_at))",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const items = (rows ?? []).map((row) => {
    const rawVariant = row.product_variants ?? null;
    const variant = Array.isArray(rawVariant) ? rawVariant[0] : rawVariant;
    const images = (variant?.variant_images ?? []) as VariantImage[];
    const sorted = [...images].sort((a, b) => {
      const aMain = a.is_main ? 1 : 0;
      const bMain = b.is_main ? 1 : 0;
      if (aMain !== bMain) return bMain - aMain;
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });
    const mainImage = sorted[0]?.image_url ?? null;

    const rawProducts = (variant?.products ?? null) as
      | VariantProduct[]
      | VariantProduct
      | null;
    const product = Array.isArray(rawProducts) ? rawProducts[0] : rawProducts;
    const rawColors = (variant?.colors ?? null) as
      | VariantColor[]
      | VariantColor
      | null;
    const color = Array.isArray(rawColors) ? rawColors[0] : rawColors;
    const rawSizes = (variant?.sizes ?? null) as
      | VariantSize[]
      | VariantSize
      | null;
    const size = Array.isArray(rawSizes) ? rawSizes[0] : rawSizes;

    return {
      id: row.id,
      variant_id: row.variant_id,
      product_name: product?.name ?? null,
      color_name: color?.name ?? null,
      size_name: size?.name ?? null,
      variant_price: variant?.price ?? null,
      variant_discount_price: variant?.discount_price ?? null,
      main_image_url: mainImage,
    };
  });

  return NextResponse.json({ items });
}
