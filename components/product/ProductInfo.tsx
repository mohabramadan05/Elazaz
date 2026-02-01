"use client";

import { useMemo, useState } from "react";
import ProductActions from "@/components/product/ProductActions";
import { useRouter } from "next/navigation";

type Variant = {
  variant_id?: string;
  variant_price?: number;
  variant_discount_price?: number;
  variant_sku?: string | null;
  color_id?: string;
  color_name?: string;
  color_hex?: string;
  size_id?: string;
  size_name?: string;
};

type Props = {
  name?: string | null;
  category?: string | null;
  description?: string | null;
  variants: Variant[];
  colors: Variant[];
  sizes: Variant[];
  initialVariantId?: string | null;
  productRemainingAmount?: number | null;
  productSoldAmount?: number | null;
  reviewsAvg?: number | null;
  reviews_count?: number | null;
  isWishlisted?: boolean | null;
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("ar-SA").format(value);

const uniqueBy = <T,>(items: T[], getKey: (item: T) => string) => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = getKey(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export default function ProductInfo({
  name,
  description,
  variants,
  colors,
  sizes,
  initialVariantId,
  productRemainingAmount,
  productSoldAmount,
  reviewsAvg,
  reviews_count,
  isWishlisted,
}: Props) {
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(Boolean(isWishlisted));
  const [isToggling, setIsToggling] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const initialVariant =
    variants.find((item) => item.variant_id === initialVariantId) ??
    variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState<
    string | undefined
  >(initialVariant?.variant_id);

  const selectedVariant = useMemo(
    () =>
      variants.find((item) => item.variant_id === selectedVariantId) ??
      variants[0],
    [selectedVariantId, variants],
  );

  const selectedColorId = selectedVariant?.color_id;
  const selectedSizeId = selectedVariant?.size_id;

  const availableSizes = useMemo(() => {
    if (!selectedColorId) return sizes;
    return uniqueBy(
      variants.filter((item) => item.color_id === selectedColorId),
      (item) => item.size_id ?? item.size_name ?? "",
    );
  }, [selectedColorId, sizes, variants]);

  const availableColors = useMemo(() => {
    if (!selectedSizeId) return colors;
    return uniqueBy(
      variants.filter((item) => item.size_id === selectedSizeId),
      (item) => item.color_id ?? item.color_name ?? "",
    );
  }, [selectedSizeId, colors, variants]);

  const handleColorSelect = (colorId?: string) => {
    if (!colorId) return;
    const matched =
      variants.find(
        (item) => item.color_id === colorId && item.size_id === selectedSizeId,
      ) ?? variants.find((item) => item.color_id === colorId);
    if (matched?.variant_id) {
      setSelectedVariantId(matched.variant_id);
      router.push(`/product/${matched.variant_id}`);
    }
  };

  const handleSizeSelect = (sizeId?: string) => {
    if (!sizeId) return;
    const matched =
      variants.find(
        (item) => item.size_id === sizeId && item.color_id === selectedColorId,
      ) ?? variants.find((item) => item.size_id === sizeId);
    if (matched?.variant_id) {
      setSelectedVariantId(matched.variant_id);
      router.push(`/product/${matched.variant_id}`);
    }
  };

  const handleToggleWishlist = async () => {
    if (!selectedVariant?.variant_id || isToggling) return;
    setIsToggling(true);
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant_id: selectedVariant.variant_id }),
      });
      if (!response.ok) return;
      const payload = (await response.json()) as { wishlisted?: boolean };
      setWishlisted(Boolean(payload.wishlisted));
    } finally {
      setIsToggling(false);
    }
  };

  const handleCopyLink = async () => {
    if (isCopying) return;
    setIsCopying(true);
    try {
      const url = window.location.href;
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement("input");
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
    } finally {
      setIsCopying(false);
    }
  };

  const basePrice = selectedVariant?.variant_price ?? 0;
  const discountPrice = selectedVariant?.variant_discount_price ?? 0;
  const hasDiscount =
    discountPrice > 0 && basePrice > 0 && discountPrice < basePrice;
  const price = formatPrice(hasDiscount ? discountPrice : basePrice);
  const compareAtPrice = hasDiscount ? formatPrice(basePrice) : null;
  const rating =
    typeof reviewsAvg === "number" ? Math.max(0, Math.min(5, reviewsAvg)) : 0;

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#222222]">{name ?? ""}</h1>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#777777]">
        <div className="flex gap-1 justify-start items-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_325_2402)">
              <path
                d="M14.9045 4.41576L14.8926 4.39529C14.8762 4.36126 14.8573 4.32867 14.8362 4.2977L12.6103 0.449376C12.4499 0.172188 12.1514 0 11.8312 0H4.17066C3.84994 0 3.55119 0.172594 3.39091 0.450532L1.12872 4.3751C1.10834 4.41048 1.09365 4.44748 1.08328 4.48507C1.05144 4.57104 1.03394 4.66395 1.03394 4.76088V14.8973C1.03394 15.5053 1.52859 16 2.13659 16H13.8649C14.4729 16 14.9675 15.5053 14.9675 14.8973V4.72373C14.9675 4.71013 14.9671 4.69663 14.9664 4.6832C14.9728 4.59298 14.9532 4.49995 14.9045 4.41576ZM8.4857 0.937846H11.8094L13.5604 3.96513H8.4857V0.937846ZM4.1925 0.937846H7.54785V3.96513H2.4475L4.1925 0.937846ZM14.0297 14.8973C14.0297 14.9882 13.9557 15.0622 13.8649 15.0622H2.13659C2.04572 15.0622 1.97178 14.9882 1.97178 14.8973V4.90298H14.0297V14.8973Z"
                fill="#B47720"
              />
              <path
                d="M10.1282 8.4381C9.94513 8.25501 9.6482 8.25501 9.46507 8.4381L7.37125 10.5319L6.56613 9.72679C6.38303 9.5437 6.08609 9.5437 5.90297 9.72679C5.71984 9.90989 5.71984 10.2068 5.90297 10.3899L7.03972 11.5266C7.13128 11.6182 7.25132 11.664 7.37128 11.664C7.49125 11.664 7.61132 11.6182 7.70285 11.5266L10.1282 9.10126C10.3114 8.91813 10.3114 8.62123 10.1282 8.4381Z"
                fill="#B47720"
              />
            </g>
            <defs>
              <clipPath id="clip0_325_2402">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <p className="text-[#333333]">
            المتبقي
            <span className="text-[#B47720] px-1">
              {productRemainingAmount ?? "—"}
            </span>
            وحدة
          </p>
        </div>
        <span className="border border-[#EEEEEE] py-2"></span>
        <div className="flex gap-1 justify-start items-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_325_2392)">
              <path
                d="M11.5372 4.99419C8.68128 3.25666 10.0205 0.80425 10.078 0.702313C10.1614 0.55725 10.1611 0.378781 10.0773 0.233969C9.99353 0.0891563 9.8389 0 9.67159 0C8.2015 0 7.05031 0.417688 6.25003 1.2415C4.88256 2.64916 4.946 4.84 4.97306 5.77556C4.97606 5.87919 4.97865 5.96875 4.97865 6.03525C4.97865 6.72988 5.09009 7.37116 5.18844 7.93694C5.25181 8.30153 5.30653 8.61641 5.31625 8.86397C5.32665 9.12897 5.27828 9.18972 5.27622 9.19216C5.26931 9.20034 5.21181 9.23094 5.05634 9.23094C4.87903 9.23094 4.74831 9.173 4.6325 9.04316C4.18012 8.53591 4.14884 7.15084 4.23534 6.39731C4.25081 6.26444 4.20878 6.13131 4.11981 6.03144C4.03087 5.93156 3.9035 5.87444 3.76975 5.87444C2.55272 5.87444 1.64331 7.86469 1.64331 9.64419C1.64331 10.4807 1.81156 11.3002 2.1434 12.0798C2.46422 12.8335 2.92169 13.5138 3.50315 14.1016C4.71415 15.3258 6.31081 16 7.99906 16C9.69409 16 11.2903 15.3353 12.4938 14.1284C13.6941 12.9247 14.3551 11.3321 14.3551 9.64412C14.3551 7.49031 12.6699 5.68328 11.5372 4.99419ZM7.99906 15.0625C5.06209 15.0625 2.58084 12.5812 2.58084 9.64412C2.58084 8.92984 2.75128 8.18006 3.04844 7.58709C3.11784 7.44856 3.18906 7.32972 3.25934 7.22959C3.26719 8.00294 3.38969 9.05716 3.93203 9.66622C4.22459 9.99475 4.61337 10.1684 5.05637 10.1684C5.47022 10.1684 5.78559 10.043 5.99365 9.79559C6.38265 9.33316 6.26325 8.64616 6.11212 7.77637C6.02028 7.24794 5.91618 6.64897 5.91618 6.03522C5.91618 5.95512 5.9134 5.85934 5.91022 5.74837C5.88456 4.86219 5.83115 3.01816 6.9225 1.89475C7.4124 1.39041 8.0964 1.08347 8.96172 0.978437C8.86403 1.30281 8.77981 1.71459 8.77656 2.17566C8.76937 3.19153 9.15794 4.64406 11.0499 5.79513C11.9653 6.35203 13.4176 7.88944 13.4176 9.64416C13.4176 12.6318 10.9868 15.0625 7.99906 15.0625Z"
                fill="#F55157"
              />
            </g>
            <defs>
              <clipPath id="clip0_325_2392">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <p className="text-[#333333]">
            تم شراءه
            <span className="text-[#B47720] px-1">
              {productSoldAmount ?? "—"}
            </span>
            مرة
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#777777]">
        <div className="flex gap-1 justify-start items-center">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => {
              const fill =
                rating >= index + 1 ? "text-[#F5B301]" : "text-[#E5E5E5]";
              return (
                <svg
                  key={index}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={fill}
                  aria-hidden="true"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              );
            })}
            <span className="mr-1 text-sm text-[#666666]">
              ({reviews_count}) تقييمات
            </span>
          </div>
        </div>
        <span className="border border-[#EEEEEE] py-2"></span>
        <button
          type="button"
          onClick={handleToggleWishlist}
          disabled={isToggling}
          className={`flex gap-1 justify-start items-center ${
            wishlisted ? "text-[#B47720]" : "text-[#666666]"
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.6875 0.976562C10.3566 0.976562 9.18981 1.57003 8.31341 2.69284C8.19653 2.84259 8.09234 2.99241 8 3.1375C7.90766 2.99238 7.80347 2.84259 7.68659 2.69284C6.81019 1.57003 5.64344 0.976562 4.3125 0.976562C1.79825 0.976562 0 3.08178 0 5.60794C0 8.49647 2.36741 11.2188 7.67616 14.4348C7.77569 14.4951 7.88784 14.5252 8 14.5252C8.11216 14.5252 8.22431 14.4951 8.32384 14.4348C13.6326 11.2188 16 8.4965 16 5.60797C16 3.08312 14.2032 0.976562 11.6875 0.976562ZM13.0987 9.20466C11.9934 10.4378 10.3233 11.7363 8 13.1679C5.67672 11.7363 4.00656 10.4378 2.90134 9.20469C1.79016 7.96481 1.25 6.78831 1.25 5.60797C1.25 3.78909 2.47919 2.22656 4.3125 2.22656C5.24613 2.22656 6.04219 2.6325 6.67859 3.43313C7.18747 4.07341 7.40188 4.73456 7.40338 4.73928C7.48478 5.00038 7.72653 5.17822 8.00003 5.17822C8.27353 5.17822 8.51528 5.00041 8.59669 4.73928C8.59866 4.73297 8.80663 4.09244 9.29878 3.46194C9.93863 2.64219 10.7423 2.22653 11.6875 2.22653C13.5227 2.22653 14.75 3.79056 14.75 5.60794C14.75 6.78828 14.2098 7.96478 13.0987 9.20466Z"
              fill={wishlisted ? "#B47720" : "#666666"}
            />
          </svg>
          <p>{wishlisted ? "إزالة من المفضلة" : "أضف للمفضلة"}</p>
        </button>
        <span className="border border-[#EEEEEE] py-2"></span>
        <button
          type="button"
          onClick={handleCopyLink}
          disabled={isCopying}
          className="flex gap-1 justify-start items-center text-[#666666]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_325_4486)">
              <path
                d="M12.3845 9.9624C11.4516 9.9624 10.6164 10.388 10.0622 11.0551L6.45721 9.00838C6.56931 8.69291 6.63093 8.35371 6.63093 8.00021C6.63093 7.64679 6.56931 7.30758 6.45721 6.99211L10.0619 4.94486C10.616 5.61221 11.4514 6.03796 12.3844 6.03796C14.0486 6.03796 15.4026 4.68347 15.4026 3.01852C15.4028 1.35406 14.0488 0 12.3845 0C10.7201 0 9.36595 1.35406 9.36595 3.01845C9.36595 3.37195 9.42749 3.71122 9.53967 4.02676L5.93478 6.07408C5.38067 5.40708 4.54551 4.98162 3.61276 4.98162C1.94809 4.98162 0.59375 6.33568 0.59375 8.00014C0.59375 9.66453 1.94809 11.0186 3.61276 11.0186C4.54551 11.0186 5.3806 10.5931 5.93471 9.9262L9.53967 11.973C9.42749 12.2886 9.36588 12.6279 9.36588 12.9815C9.36588 14.6459 10.72 15.9999 12.3845 15.9999C14.0487 15.9999 15.4027 14.6458 15.4027 12.9815C15.4028 11.3168 14.0488 9.9624 12.3845 9.9624ZM12.3845 1.05626C13.4664 1.05626 14.3465 1.93648 14.3465 3.01845C14.3465 4.10098 13.4664 4.98162 12.3845 4.98162C11.3025 4.98162 10.4222 4.10098 10.4222 3.01845C10.4222 1.93648 11.3025 1.05626 12.3845 1.05626ZM3.61283 9.9624C2.53059 9.9624 1.65008 9.08211 1.65008 8.00021C1.65008 6.91817 2.53059 6.03796 3.61283 6.03796C4.69466 6.03796 5.57474 6.91817 5.57474 8.00021C5.57474 9.08211 4.69459 9.9624 3.61283 9.9624ZM12.3845 14.9437C11.3025 14.9437 10.4222 14.0634 10.4222 12.9816C10.4222 11.8992 11.3025 11.0187 12.3845 11.0187C13.4664 11.0187 14.3465 11.8992 14.3465 12.9816C14.3465 14.0634 13.4664 14.9437 12.3845 14.9437Z"
                fill="#666666"
              />
            </g>
            <defs>
              <clipPath id="clip0_325_4486">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>

          <p>{isCopying ? "جاري النسخ..." : "نسخ رابط المنتج"}</p>
        </button>
      </div>

      <p className="mt-3 text-sm text-[#666666] leading-7">
        {description ||
          "تفاصيل هذا المنتج ستظهر هنا بمجرد توفر الوصف الكامل من لوحة التحكم."}
      </p>

      <div className="mt-4">
        {compareAtPrice ? (
          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold text-[#F55157]">
              {price} ر.س
            </span>
            <span className="text-sm text-[#9A9A9A] line-through">
              {compareAtPrice} ر.س
            </span>
          </div>
        ) : (
          <span className="text-2xl font-semibold text-[#F55157]">
            {price} ر.س
          </span>
        )}
      </div>

      <div className="border border-[#EEEEEE] rounded-md py-5 px-4 mt-3">
        <div className="flex gap-1.5 font-bold justify-start items-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_161_16972)">
              <path
                d="M15.3173 0.539231L15.298 0.521666C14.9298 0.185278 14.4524 0 13.9539 0C13.395 0 12.8583 0.236596 12.4816 0.649068L5.35704 8.44898C5.2921 8.52006 5.24284 8.60394 5.21239 8.69525L4.37465 11.2067C4.27779 11.497 4.32641 11.8181 4.50467 12.0656C4.68435 12.315 4.97382 12.4639 5.27907 12.4639C5.41111 12.4639 5.5402 12.4368 5.66261 12.3832L8.08818 11.3221C8.17637 11.2835 8.25548 11.2269 8.32038 11.1558L15.4449 3.35591C16.1863 2.54431 16.1291 1.28085 15.3173 0.539231ZM5.97973 10.7427L6.47132 9.26906L6.51277 9.22366L7.44448 10.0746L7.40302 10.1201L5.97973 10.7427ZM14.4291 2.42801L8.37238 9.05888L7.44067 8.20789L13.4974 1.57697C13.6159 1.44727 13.778 1.37582 13.9539 1.37582C14.1082 1.37582 14.256 1.43324 14.3704 1.53771L14.3896 1.55528C14.6411 1.78499 14.6588 2.17651 14.4291 2.42801Z"
                fill="#B47720"
              />
              <path
                d="M13.934 6.34731C13.5541 6.34731 13.2461 6.65531 13.2461 7.03522V12.8755C13.2461 13.8401 12.4613 14.6249 11.4967 14.6249H3.15921C2.19453 14.6249 1.40976 13.8401 1.40976 12.8755V4.60574C1.40976 3.64111 2.19457 2.85629 3.15921 2.85629H9.19389C9.5738 2.85629 9.8818 2.54829 9.8818 2.16838C9.8818 1.78847 9.5738 1.48047 9.19389 1.48047H3.15921C1.4359 1.48047 0.0339355 2.88248 0.0339355 4.60574V12.8754C0.0339355 14.5987 1.43595 16.0007 3.15921 16.0007H11.4966C13.2199 16.0007 14.6219 14.5987 14.6219 12.8754V7.03522C14.6219 6.65531 14.3139 6.34731 13.934 6.34731Z"
                fill="#B47720"
              />
            </g>
            <defs>
              <clipPath id="clip0_161_16972">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <h1>خاص بالمنتج</h1>
        </div>
        {availableColors.length > 0 ? (
          <div className="mt-5">
            <p className="text-sm font-semibold text-[#333333]">
              الألوان المتاحة
            </p>
            <div className="mt-3 flex flex-wrap gap-2 items-center">
              {availableColors.map((item, index) => {
                const id = item.color_id ?? item.color_name ?? "";
                const isActive = id && id === selectedColorId;
                const swatch = item.color_hex?.trim();
                const isLast = index === availableColors.length - 1;


                return (
                  <div key={id} className="flex items-center">
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleColorSelect(item.color_id)}
                      className={`flex flex-col items-center gap-2 px-3 py-2 text-xs ${
                        isActive
                          ? "border-[#B47720] text-[#000000]"
                          : "border-[#EEEEEE] text-[#A5A5A5]"
                      }`}
                    >
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#DDDDDD]"
                        style={swatch ? { backgroundColor: swatch } : undefined}
                      >
                        {isActive && (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.3069 2.68657C11.0507 2.43781 10.6236 2.43781 10.3816 2.68657L4.37453 8.50486L1.6272 5.85139C1.37098 5.60262 0.943929 5.60262 0.701936 5.85139C0.445709 6.10015 0.445709 6.51475 0.701936 6.7497L3.90478 9.85923C4.0329 9.98361 4.23218 10.0527 4.403 10.0527C4.57382 10.0527 4.74464 9.98361 4.87275 9.85923L11.3069 3.5987C11.5489 3.33612 11.5489 2.93533 11.3069 2.68657Z"
                              fill="#EEEEEE"
                            />
                          </svg>
                        )}
                      </span>

                      <span>{item.color_name}</span>
                    </button>
                    {!isLast && <span className="h-9 border border-[#EEEEEE]" />} 
              
                    
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {availableSizes.length > 0 ? (
          <div className="mt-5">
            <p className="text-sm font-semibold text-[#333333]">
              القياسات المتوفرة
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {availableSizes.map((item) => {
                const id = item.size_id ?? item.size_name ?? "";
                const isActive = id && id === selectedSizeId;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleSizeSelect(item.size_id)}
                    className={`border rounded-sm px-4 py-2 text-xs ${
                      isActive
                        ? "border-[#B47720] text-[#B47720]"
                        : "border-[#EEEEEE] text-[#666666]"
                    }`}
                  >
                    {item.size_name}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      <ProductActions variantId={selectedVariant?.variant_id ?? undefined} />
    </div>
  );
}
