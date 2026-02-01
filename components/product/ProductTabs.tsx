"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Review = {
  id?: string;
  user_id?: string;
  rating?: number;
  comment?: string | null;
  created_at?: string | null;
  user_full_name?: string | null;
  user_image_url?: string | null;
};

type Props = {
  reviews?: Review[];
  reviewsAvg?: number | null;
  reviewsCount?: number | null;
  productId?: string | null;
};

const formatDate = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB");
};

const getDisplayName = (userId?: string) => {
  if (!userId) return "مستخدم";
  return `مستخدم ${userId.slice(0, 4)}`;
};

const getInitials = (name?: string | null, userId?: string) => {
  const base = (name ?? "").trim();
  if (base.length >= 2) return base.slice(0, 2);
  return getDisplayName(userId).slice(0, 2);
};

const renderStarsStatic = (rating = 0) =>
  [...Array(5)].map((_, index) => {
    const fill = rating >= index + 1 ? "text-[#F5B301]" : "text-[#E5E5E5]";
    return (
      <svg
        key={index}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={fill}
        aria-hidden="true"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    );
  });

export default function ProductTabs({
  reviews = [],
  reviewsAvg,
  reviewsCount,
  productId,
}: Props) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState("newest");

  // Add Review states
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = rating > 0 && comment.trim().length > 0 && !submitting;

  const sortedReviews = useMemo(() => {
    const list = [...reviews];
    switch (sortBy) {
      case "oldest":
        return list.sort(
          (a, b) =>
            new Date(a.created_at ?? 0).getTime() -
            new Date(b.created_at ?? 0).getTime(),
        );
      case "rating_high":
        return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      case "rating_low":
        return list.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
      default:
        return list.sort(
          (a, b) =>
            new Date(b.created_at ?? 0).getTime() -
            new Date(a.created_at ?? 0).getTime(),
        );
    }
  }, [reviews, sortBy]);

  const handleSubmit = async () => {
    if (!canSubmit || !productId) return;

    try {
      setSubmitting(true);

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          rating,
          comment: comment.trim(),
        }),
      });
      if (!response.ok) {
        return;
      }

      // Reset form after submit
      setRating(0);
      setHover(0);
      setComment("");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-10">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="px-4 py-2 text-sm font-semibold text-white bg-[#B47720] rounded-t-sm"
        >
          تقييمات المنتج
        </button>
      </div>

      <div className="bg-white border border-[#EEEEEE] border-t-[#B47720] rounded-b-sm p-6">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Left side */}
          <div className="space-y-4">
            <div className="rounded-sm bg-[#F8F8F8] p-5 text-center">
              <p className="text-xl font-semibold text-[#333333]">
                {reviewsAvg ? reviewsAvg.toFixed(1) : "—"} من 5
              </p>
              <div className="mt-2 flex justify-center gap-1">
                {renderStarsStatic(reviewsAvg ?? 0)}
              </div>
              <p className="mt-2 text-sm text-[#666666]">
                {reviewsCount ?? 0} تقييم على المنتج
              </p>
            </div>

            {/* Add Review box */}
            <div className="rounded-sm border border-[#EEEEEE] p-4">
              <p className="text-sm font-semibold text-[#333333]">أضف تعليقك</p>

              {/* ⭐ Star Buttons */}
              <div className="mt-3 flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="text-2xl leading-none transition-colors"
                    aria-label={`rate ${star} stars`}
                    title={`${star} / 5`}
                  >
                    <span className={(hover || rating) >= star ? "text-[#B47720]" : "text-[#DDDDDD]"}>
                      ★
                    </span>
                  </button>
                ))}
              </div>

              {rating > 0 && (
                <p className="mt-1 text-xs text-[#888888] text-right">
                  تقييمك: {rating} / 5
                </p>
              )}

              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="برجاء إضافة تعليقك..."
                className="mt-3 w-full rounded-sm border border-[#EEEEEE] p-3 text-sm focus:outline-none focus:border-[#B47720]"
              />

              <button
                type="button"
                disabled={!canSubmit}
                onClick={handleSubmit}
                className="mt-4 w-full rounded-sm bg-[#B47720] py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? "جاري النشر..." : "نشر تعليقك"}
              </button>
            </div>
          </div>

          {/* Right side */}
          <div>
            <div className="flex items-center justify-between border border-[#EEEEEE] rounded-sm px-4 py-3 text-sm text-[#777777]">
              <span className="text-[#333333] font-semibold">تعليقات المستخدمين</span>
              <label className="flex items-center gap-1">
                <span>ترتيب حسب:</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="bg-white px-2 py-1 text-sm text-[#666666] focus:outline-none focus:border-[#B47720]"
                >
                  <option value="newest">الأحدث</option>
                  <option value="oldest">الأقدم</option>
                  <option value="rating_high">الأعلى تقييماً</option>
                  <option value="rating_low">الأقل تقييماً</option>
                </select>
              </label>
            </div>

            <div className="mt-4 space-y-6">
              {sortedReviews.length === 0 ? (
                <p className="text-sm text-[#666666]">لا توجد تقييمات بعد.</p>
              ) : (
                sortedReviews.map((review) => (
                  <div
                    key={review.id ?? review.created_at ?? Math.random()}
                    className="border-b border-[#EEEEEE] pb-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        {/* Avatar (safe render) */}
                        <div className="h-10 w-10 rounded-full bg-[#F2F2F2] flex items-center justify-center text-xs text-[#888888] overflow-hidden">
                          {review.user_image_url ? (
                            <Image
                              src={review.user_image_url}
                              width={40}
                              height={40}
                              alt="user image"
                              className="h-10 w-10 object-cover rounded-full"
                              unoptimized
                              onError={() => {
                                // If image fails, Next doesn't let us swap easily here.
                                // But unoptimized reduces host issues; for full fix, whitelist domain in next.config.
                              }}
                            />
                          ) : (
                            getInitials(review.user_full_name, review.user_id)
                          )}
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#333333]">
                            {review.user_full_name ?? getDisplayName(review.user_id)}
                          </p>
                          <div className="mt-1 flex items-center gap-1">
                            {renderStarsStatic(review.rating ?? 0)}
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-[#777777]">
                        {formatDate(review.created_at)}
                      </div>
                    </div>

                    {review.comment ? (
                      <p className="mt-3 text-sm text-[#666666] leading-7">
                        {review.comment}
                      </p>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
