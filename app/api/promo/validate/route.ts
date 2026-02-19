import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Payload = {
  code?: string;
};

type PromoCodeRow = {
  id: string;
  code: string;
  discount_percent: number | null;
  expires_at: string | null;
  is_active: boolean | null;
  max_uses_per_user: number | null;
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "غير مصرح به" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => ({}))) as Payload;
  const rawCode = (payload.code ?? "").trim();

  if (!rawCode) {
    return NextResponse.json({ error: "يلزم وجود رمز ترويجي" }, { status: 400 });
  }

  const codeCandidates = Array.from(
    new Set([rawCode, rawCode.toUpperCase(), rawCode.toLowerCase()]),
  );

  const { data, error: promoError } = await supabase
    .from("promo_codes")
    .select("id,code,discount_percent,expires_at,is_active,max_uses_per_user")
    .in("code", codeCandidates)
    .limit(1)
    .maybeSingle();

  if (promoError) {
    return NextResponse.json({ error: promoError.message }, { status: 500 });
  }

  const promo = data as PromoCodeRow | null;
  if (!promo) {
    return NextResponse.json(
      { error: "رمز الخصم غير صالح أو غير موجود" },
      { status: 404 },
    );
  }

  if (promo.is_active !== true) {
    return NextResponse.json({ error: "رمز الخصم غير فعال" }, { status: 400 });
  }

  if (promo.expires_at) {
    const expiresAt = new Date(promo.expires_at).getTime();
    if (Number.isFinite(expiresAt) && expiresAt <= Date.now()) {
      return NextResponse.json({ error: "انتهت صلاحية رمز العرض الترويجي" }, { status: 400 });
    }
  }

  const discountPercent = Number(promo.discount_percent ?? 0);
  if (!Number.isFinite(discountPercent) || discountPercent <= 0 || discountPercent > 100) {
    return NextResponse.json(
      { error: "رمز الخصم غير صالح" },
      { status: 400 },
    );
  }

  let usedCount = 0;
  if (typeof promo.max_uses_per_user === "number") {
    const { count, error: usageError } = await supabase
      .from("promo_code_usages")
      .select("id", { count: "exact", head: true })
      .eq("promo_code_id", promo.id)
      .eq("user_id", user.id);

    if (usageError) {
      return NextResponse.json({ error: usageError.message }, { status: 500 });
    }

    usedCount = count ?? 0;
    if (usedCount >= promo.max_uses_per_user) {
      return NextResponse.json(
        { error: "لقد وصلت إلى الحد الأقصى لاستخدام رمز الخصم هذا" },
        { status: 400 },
      );
    }
  }

  return NextResponse.json({
    promoCodeId: promo.id,
    code: promo.code,
    discountPercent,
    maxUsesPerUser: promo.max_uses_per_user,
    usedCount,
  });
}
