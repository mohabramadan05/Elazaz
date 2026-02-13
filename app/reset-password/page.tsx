"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      setHasRecoverySession(Boolean(data.session));
      setSessionChecked(true);
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) return;
        setHasRecoverySession(Boolean(session));
      },
    );

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    if (!hasRecoverySession) {
      setStatus("رابط الاستعادة غير صالح أو منتهي الصلاحية.");
      return;
    }
    if (!password || !confirmPassword) {
      setStatus("يرجى إدخال كلمة المرور وتأكيدها.");
      return;
    }
    if (password.length < 8) {
      setStatus("يجب أن تكون كلمة المرور 8 أحرف على الأقل.");
      return;
    }
    if (password !== confirmPassword) {
      setStatus("كلمتا المرور غير متطابقتين.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      await supabase.auth.signOut();
      setStatus("تم تحديث كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/");
      }, 1200);
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
            تعيين كلمة مرور جديدة
          </h1>
          <p className="text-sm text-[#666666]">
            أدخل كلمة مرور جديدة لحسابك.
          </p>
        </div>

        {!sessionChecked ? (
          <p className="mt-6 text-center text-sm text-[#666666]" dir="rtl">
            جارٍ التحقق من الرابط...
          </p>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit} dir="rtl">
            <label className="block text-sm text-[#333333]">
              كلمة المرور الجديدة
              <div className="mt-2 flex h-11 items-center gap-2 rounded-md border border-[#E5E5E5] px-3 focus-within:border-[#B47720]">
                <button
                  type="button"
                  className="text-[#7A7A7A]"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="كلمة المرور الجديدة"
                  className="h-full w-full border-0 text-sm outline-none"
                />
              </div>
            </label>

            <label className="block text-sm text-[#333333]">
              تأكيد كلمة المرور
              <div className="mt-2 flex h-11 items-center gap-2 rounded-md border border-[#E5E5E5] px-3 focus-within:border-[#B47720]">
                <button
                  type="button"
                  className="text-[#7A7A7A]"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={
                    showConfirmPassword
                      ? "إخفاء كلمة المرور"
                      : "إظهار كلمة المرور"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="تأكيد كلمة المرور"
                  className="h-full w-full border-0 text-sm outline-none"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={isSubmitting || !hasRecoverySession}
              className="flex h-12 w-full items-center justify-center rounded-md bg-[#B47720] text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "جارٍ التحديث..." : "تحديث كلمة المرور"}
            </button>

            {status ? (
              <p className="text-center text-sm text-[#666666]">{status}</p>
            ) : null}
          </form>
        )}

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
