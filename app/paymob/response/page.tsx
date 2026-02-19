"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";

type PaymentResponse = {
  order_id: string;
  status: "paid" | "failed" | "unpaid" | string;
  transaction_id: string | null;
  error?: string;
};

type StatusContent = {
  title: string;
  description: string;
  iconClassName: string;
  containerClassName: string;
};

const getStatusContent = (status: string): StatusContent => {
  if (status === "paid") {
    return {
      title: "تمت معالجة طلبك بنجاح",
      description: "يمكنك الآن متابعة التسوق أو مشاهدة تفاصيل طلبك.",
      iconClassName: "text-[#2BAE35]",
      containerClassName: "border-[#2BAE35] bg-[#F3FFF4]",
    };
  }

  if (status === "failed") {
    return {
      title: "فشلت عملية الدفع",
      description: "لم يتم تأكيد العملية. يمكنك إعادة المحاولة أو متابعة التسوق.",
      iconClassName: "text-[#D14343]",
      containerClassName: "border-[#D14343] bg-[#FFF5F5]",
    };
  }

  return {
    title: "جاري معالجة الدفع",
    description: "نقوم الآن بالتحقق من حالة العملية، يرجى الانتظار لحظات.",
    iconClassName: "text-[#B47720]",
    containerClassName: "border-[#B47720] bg-[#FFF9F1]",
  };
};

function LoadingState() {
  return (
    <section className="min-h-[70vh] bg-[#F1F1F1] py-10" dir="rtl">
      <div className="mx-auto mt-14 max-w-2xl text-center px-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#B47720] bg-[#FFF9F1]">
          <Loader2 className="h-8 w-8 animate-spin text-[#B47720]" />
        </div>
        <h1 className="mt-6 text-4xl font-bold text-[#2F2F2F]">
          Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„Ø¯ÙØ¹...
        </h1>
      </div>
    </section>
  );
}

function PaymobResponseContent() {
  const searchParams = useSearchParams();
  const queryString = useMemo(() => searchParams.toString(), [searchParams]);
  const [result, setResult] = useState<PaymentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadStatus = async () => {
      setLoading(true);
      setFetchError(null);

      try {
        const endpoint = queryString
          ? `/api/paymob/response?${queryString}`
          : "/api/paymob/response";
        const response = await fetch(endpoint, { cache: "no-store" });
        const payload = (await response.json().catch(() => ({}))) as PaymentResponse;

        if (!mounted) return;

        if (!response.ok) {
          setResult(null);
          setFetchError(payload.error ?? "تعذر قراءة حالة الدفع.");
          return;
        }

        setResult(payload);
      } catch {
        if (!mounted) return;
        setResult(null);
        setFetchError("تعذر قراءة حالة الدفع.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadStatus();
    return () => {
      mounted = false;
    };
  }, [queryString]);

  const status = result?.status ?? "unpaid";
  const content = getStatusContent(status);
  const orderUrl = result?.order_id
    ? `/profile?panel=orders&order=${encodeURIComponent(result.order_id)}`
    : "/profile?panel=orders";

  return (
    <section className="min-h-[70vh] bg-[#F1F1F1] py-10" dir="rtl">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="text-xs text-[#888888] flex flex-wrap items-center justify-end gap-2">
          <Link href="/" className="hover:text-[#B47720]">
            الرئيسية
          </Link>
          <span>/</span>
          <Link href="/profile/cart" className="hover:text-[#B47720]">
            سلة المشتريات
          </Link>
        </div>

        <div className="mx-auto mt-14 max-w-2xl text-center">
          <div
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 ${content.containerClassName}`}
          >
            {loading ? (
              <Loader2 className="h-8 w-8 animate-spin text-[#B47720]" />
            ) : fetchError ? (
              <X className="h-8 w-8 text-[#D14343]" />
            ) : status === "paid" ? (
              <Check className={`h-8 w-8 ${content.iconClassName}`} />
            ) : status === "failed" ? (
              <X className={`h-8 w-8 ${content.iconClassName}`} />
            ) : (
              <Loader2 className={`h-8 w-8 animate-spin ${content.iconClassName}`} />
            )}
          </div>

          <h1 className="mt-6 text-4xl font-bold text-[#2F2F2F]">
            {loading ? "جاري التحقق من الدفع..." : fetchError ? "تعذر التحقق من حالة الطلب" : content.title}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#7B7B7B]">
            {loading
              ? "يرجى الانتظار لحظات..."
              : fetchError
                ? fetchError
                : content.description}
          </p>

          {result?.order_id ? (
            <p className="mt-2 text-xs text-[#8A8A8A]">{`رقم الطلب: ${result.order_id}`}</p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={orderUrl}
              className="inline-flex min-w-44 items-center justify-center rounded-sm bg-[#B47720] px-6 py-3 text-sm font-semibold text-white hover:bg-[#9F6418]"
            >
              مشاهدة الطلب
            </Link>
            <Link
              href="/shop"
              className="inline-flex min-w-44 items-center justify-center rounded-sm border border-[#B47720] bg-transparent px-6 py-3 text-sm font-semibold text-[#B47720] hover:bg-[#B47720] hover:text-white"
            >
              متابعة التسوق
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PaymobResponsePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <PaymobResponseContent />
    </Suspense>
  );
}
