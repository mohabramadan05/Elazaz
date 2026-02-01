"use client";

import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Product = {
  product_id?: string;
  product_name?: string | null;
  product_description?: string | null;
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
  main_image_url?: string | null;
  images?: string[];
  is_wishlisted?: boolean;
};

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const router = useRouter();
  const image =
    product.main_image_url ||
    (Array.isArray(product.images) ? product.images[0] : undefined) ||
    "/assets/logo.png";
  const title = product.product_name || "";
  const color = product.color_name || "";
  const category = product.category_name || "";
  const basePrice = product.variant_price || 0;
  const discountPrice = product.variant_discount_price || 0;
  const hasDiscount =
    discountPrice > 0 && basePrice > 0 && discountPrice < basePrice;
  const price = hasDiscount ? discountPrice : basePrice;
  const [isWishlisted, setIsWishlisted] = useState(
    Boolean(product.is_wishlisted),
  );
  const [isToggling, setIsToggling] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const productHref = useMemo(() => {
    if (!product.variant_id) return null;
    const variantId = encodeURIComponent(product.variant_id);
    return `/product/${variantId}`;
  }, [product.variant_id]);

  useEffect(() => {
    setIsWishlisted(Boolean(product.is_wishlisted));
  }, [product.is_wishlisted]);

  const handleCardClick = () => {
    if (!productHref) return;
    router.push(productHref);
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!productHref) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      router.push(productHref);
    }
  };

  const handleToggleWishlist = async () => {
    if (!product.variant_id || isToggling) return;
    setIsToggling(true);
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant_id: product.variant_id }),
      });
      if (!response.ok) return;
      const payload = (await response.json()) as { wishlisted?: boolean };
      setIsWishlisted(Boolean(payload.wishlisted));
    } finally {
      setIsToggling(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product.variant_id || isAdding) return;
    setIsAdding(true);
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant_id: product.variant_id, qty: 1 }),
      });
      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      className="group relative h-full w-full max-w-80 sm:max-w-85 flex flex-col items-left bg-[#FFFFFF] rounded-sm shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B47720]/30"
      role={productHref ? "link" : undefined}
      tabIndex={productHref ? 0 : -1}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      aria-disabled={!productHref}
    >
      <Image
        src={image}
        alt={title}
        width={500}
        height={500}
        className="h-48 w-full object-cover sm:h-56"
      />
      <div className="px-3 py-2">
        <p className="text-xs font-medium text-[#B47720] text-right sm:text-sm">
          {category}
        </p>
        <h3 className="mt-1 text-sm font-semibold text-[#333333] text-right sm:text-md">
          {title}
        </h3>
        <h4 className="mt-1 text-xs text-[#666666] text-right sm:text-sm">
          {color}
        </h4>

        {hasDiscount ? (
          <div className="mt-0.5 flex items-center justify-start gap-2">
            <span className="text-base font-semibold text-[#F55157] sm:text-lg">
              {discountPrice} ر.س
            </span>
            <span className="text-xs text-[#9A9A9A] line-through sm:text-base">
              {basePrice} ر.س
            </span>
          </div>
        ) : (
          <p className="mt-0.5 text-base font-semibold text-[#F55157] text-right sm:text-lg">
            {price} ر.س
          </p>
        )}
      </div>
      <div className="mt-auto mb-2 px-2 w-full flex flex-row items-center justify-between gap-2">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleAddToCart();
          }}
          disabled={!product.variant_id || isAdding}
          className={`flex-1 flex justify-center items-center gap-1.5 h-10 border border-[#EEEEEE] text-xs font-medium rounded-sm transition hover:bg-[#B47720] hover:text-white hover:border-[#B47720] sm:h-12 sm:text-sm ${
            isAdding ? "opacity-70 cursor-not-allowed" : ""
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
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.54229 4.56419C3.53235 4.45417 3.54543 4.34329 3.58071 4.23861C3.61599 4.13393 3.67269 4.03774 3.74719 3.95619C3.82169 3.87463 3.91237 3.80948 4.01344 3.76491C4.11451 3.72033 4.22376 3.69729 4.33422 3.69727H13.976C14.0951 3.69732 14.2127 3.72411 14.32 3.77566C14.4274 3.82722 14.5218 3.90222 14.5962 3.99514C14.6707 4.08805 14.7234 4.19651 14.7504 4.3125C14.7773 4.4285 14.7779 4.54906 14.7521 4.66531L13.9374 8.33751C13.7972 8.96858 13.446 9.53296 12.9418 9.93745C12.4375 10.3419 11.8104 10.5623 11.1639 10.5622H6.67934C5.97022 10.5622 5.28673 10.297 4.76321 9.81872C4.2397 9.34041 3.91402 8.68358 3.8502 7.97733L3.54229 4.56419ZM4.7069 4.83347L4.98186 7.87508C5.02017 8.29902 5.21573 8.69328 5.53008 8.98029C5.84443 9.26731 6.25481 9.4263 6.68048 9.42599H11.1651C11.5528 9.4259 11.929 9.29356 12.2314 9.05084C12.5338 8.80812 12.7444 8.46952 12.8285 8.09096L13.5522 4.83347H4.7069Z"
              fill="currentColor"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.1927 1.79076C1.1927 1.64009 1.25256 1.49559 1.3591 1.38905C1.46564 1.28251 1.61013 1.22266 1.7608 1.22266H3.7537C3.89266 1.2228 4.02675 1.27387 4.1306 1.3662C4.23445 1.45853 4.30086 1.58573 4.31726 1.72372L4.77401 5.58794C4.79164 5.73771 4.74905 5.88834 4.65561 6.00671C4.56218 6.12507 4.42555 6.20147 4.27578 6.2191C4.12602 6.23673 3.97538 6.19414 3.85702 6.10071C3.73865 6.00727 3.66225 5.87064 3.64462 5.72088L3.24809 2.35772H1.7608C1.61013 2.35772 1.46564 2.29787 1.3591 2.19133C1.25256 2.08479 1.1927 1.94143 1.1927 1.79076ZM6.30561 13.5311C6.45628 13.5311 6.60078 13.4713 6.70732 13.3647C6.81386 13.2582 6.87371 13.1137 6.87371 12.963C6.87371 12.8124 6.81386 12.6679 6.70732 12.5613C6.60078 12.4548 6.45628 12.3949 6.30561 12.3949C6.15494 12.3949 6.01044 12.4548 5.9039 12.5613C5.79736 12.6679 5.73751 12.8124 5.73751 12.963C5.73751 13.1137 5.79736 13.2582 5.9039 13.3647C6.01044 13.4713 6.15494 13.5311 6.30561 13.5311ZM6.30561 14.6673C6.52942 14.6673 6.75104 14.6232 6.95782 14.5376C7.16459 14.4519 7.35247 14.3264 7.51073 14.1681C7.66899 14.0099 7.79453 13.822 7.88018 13.6152C7.96583 13.4085 8.00991 13.1868 8.00991 12.963C8.00991 12.7392 7.96583 12.5176 7.88018 12.3108C7.79453 12.104 7.66899 11.9162 7.51073 11.7579C7.35247 11.5996 7.16459 11.4741 6.95782 11.3885C6.75104 11.3028 6.52942 11.2587 6.30561 11.2587C5.8536 11.2587 5.4201 11.4383 5.10048 11.7579C4.78087 12.0775 4.60131 12.511 4.60131 12.963C4.60131 13.415 4.78087 13.8485 5.10048 14.1681C5.4201 14.4878 5.8536 14.6673 6.30561 14.6673ZM11.489 13.5311C11.6396 13.5311 11.7841 13.4713 11.8907 13.3647C11.9972 13.2582 12.0571 13.1137 12.0571 12.963C12.0571 12.8124 11.9972 12.6679 11.8907 12.5613C11.7841 12.4548 11.6396 12.3949 11.489 12.3949C11.3383 12.3949 11.1938 12.4548 11.0872 12.5613C10.9807 12.6679 10.9209 12.8124 10.9209 12.963C10.9209 13.1137 10.9807 13.2582 11.0872 13.3647C11.1938 13.4713 11.3383 13.5311 11.489 13.5311ZM11.489 14.6673C11.7128 14.6673 11.9344 14.6232 12.1412 14.5376C12.3479 14.4519 12.5358 14.3264 12.6941 14.1681C12.8523 14.0099 12.9779 13.822 13.0635 13.6152C13.1492 13.4085 13.1933 13.1868 13.1933 12.963C13.1933 12.7392 13.1492 12.5176 13.0635 12.3108C12.9779 12.104 12.8523 11.9162 12.6941 11.7579C12.5358 11.5996 12.3479 11.4741 12.1412 11.3885C11.9344 11.3028 11.7128 11.2587 11.489 11.2587C11.0369 11.2587 10.6035 11.4383 10.2838 11.7579C9.96422 12.0775 9.78466 12.511 9.78466 12.963C9.78466 13.415 9.96422 13.8485 10.2838 14.1681C10.6035 14.4878 11.0369 14.6673 11.489 14.6673Z"
              fill="currentColor"
            />
          </svg>
          <p className="font-semibold"> أضف للسلة</p>
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleToggleWishlist();
          }}
          disabled={!product.variant_id || isToggling}
          aria-pressed={isWishlisted}
          className={`h-10 w-10 border rounded-sm flex items-center justify-center transition sm:h-12 sm:w-12 ${
            isWishlisted
              ? "bg-[#FDE7EA] text-[#E11D48] border-[#FBCBD3]"
              : "border-[#EEEEEE] text-[#666666] hover:bg-[#FDE7EA] hover:text-[#E11D48] hover:border-[#FBCBD3]"
          } ${isToggling ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.1484 1.09766C11.6511 1.09766 10.3385 1.76531 9.35258 3.02847C9.2211 3.19694 9.10389 3.36548 9 3.52871C8.89611 3.36545 8.7789 3.19694 8.64742 3.02847C7.66146 1.76531 6.34887 1.09766 4.85156 1.09766C2.02303 1.09766 0 3.46603 0 6.30795C0 9.55755 2.66333 12.6202 8.63568 16.2382C8.74765 16.306 8.87382 16.3399 9 16.3399C9.12618 16.3399 9.25235 16.306 9.36432 16.2382C15.3367 12.6202 18 9.55759 18 6.30799C18 3.46754 15.9786 1.09766 13.1484 1.09766ZM14.736 10.3543C13.4926 11.7416 11.6137 13.2024 9 14.8129C6.38631 13.2024 4.50738 11.7416 3.26401 10.3543C2.01393 8.95944 1.40625 7.63587 1.40625 6.30799C1.40625 4.26175 2.78909 2.50391 4.85156 2.50391C5.90189 2.50391 6.79746 2.96059 7.51342 3.86129C8.0859 4.58161 8.32711 5.32541 8.3288 5.33072C8.42038 5.62445 8.69235 5.82452 9.00004 5.82452C9.30772 5.82452 9.57969 5.62448 9.67127 5.33072C9.67349 5.32361 9.90745 4.60302 10.4611 3.8937C11.181 2.97148 12.0851 2.50387 13.1484 2.50387C15.2131 2.50387 16.5938 4.26341 16.5938 6.30795C16.5938 7.63584 15.9861 8.9594 14.736 10.3543Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
