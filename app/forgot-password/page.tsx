"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setStatus("يرجى إدخال البريد الإلكتروني.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        normalizedEmail,
        { redirectTo: `${window.location.origin}/reset-password` },
      );
      if (error) throw error;
      setStatus("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.");
      setEmail("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "حدث خطأ غير متوقع.";
      setStatus(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[#FAFAFA] py-12">
      <div className="mx-auto w-full max-w-md rounded-lg border border-[#EFEFEF] bg-white p-6 shadow-sm">
        <div className="space-y-2 text-center" dir="rtl">
          <h1 className="text-2xl font-semibold text-[#222222]">
            استعادة كلمة المرور
          </h1>
          <p className="text-sm text-[#666666]">
            أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} dir="rtl">
          <label className="block text-sm text-[#333333]">
            عنوان البريد الإلكتروني
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="البريد الإلكتروني"
              className="mt-2 h-11 w-full rounded-md border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#B47720]"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-12 w-full items-center justify-center rounded-md bg-[#B47720] text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "جارٍ الإرسال..." : "إرسال رابط الاستعادة"}
          </button>

          {status ? (
            <p className="text-center text-sm text-[#666666]">{status}</p>
          ) : null}
        </form>

        <div className="mt-5 text-center" dir="rtl">
          <Link
            href="/"
            className="text-sm font-semibold text-[#B47720] hover:underline"
          >
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </section>
  );
}
