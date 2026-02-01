"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "signup";

type AuthModalProps = {
  open: boolean;
  mode: AuthMode;
  onClose: () => void;
  onModeChange: (mode: AuthMode) => void;
};

export default function AuthModal({
  open,
  mode,
  onClose,
  onModeChange,
}: AuthModalProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const isSignup = mode === "signup";

  useEffect(() => {
    setName("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirm(false);
    setStatus(null);
  }, [mode]);

  if (!open) return null;

  const resetFields = () => {
    setEmail("");
    setName("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirm(false);
    setIsSubmitting(false);
    setStatus(null);
  };

  const handleClose = () => {
    resetFields();
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    if (
      isSignup &&
      (!name.trim() || !email.trim() || !password || !confirmPassword)
    ) {
      setStatus("برجاء إدخال كل البيانات");
      return;
    }
    if (!isSignup && (!email.trim() || !password)) {
      setStatus("برجاء إدخال كل البيانات");
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setStatus("كلمتا المرور غير متطابقتين.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSignup) {
        const normEmail = email.trim().toLowerCase();
        const normName = name.trim();
        const { data, error } = await supabase.auth.signUp({
          email: normEmail,
          password,
          options: {
            data: {
              full_name: normName.trim(),
            },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setStatus("تم إرسال رسالة تأكيد إلى بريدك.");
        } else {
          setStatus("تم إنشاء الحساب وتسجيل الدخول.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setStatus("تم تسجيل الدخول بنجاح.");
        handleClose();
        router.refresh();
        return;
      }
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "حدث خطأ غير متوقع.";
      setStatus(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 px-4 py-10"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-lg bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
        dir="rtl"
      >
        <div className="relative px-6 pb-6 pt-6">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-2.5 right-2.5 rounded-md p-1 text-[#666666] hover:bg-gray-100"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="text-center text-xl font-semibold text-[#222222]">
            {isSignup ? "إنشاء حساب جديد" : "تسجيل الدخول إلى حسابك"}
          </h2>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {isSignup ? (
              <label className="block text-sm text-[#333333]">
                الأسم
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="الأسم"
                  className="mt-2 h-11 w-full rounded-md border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#B47720]"
                />
              </label>
            ) : null}
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

            <label className="block text-sm text-[#333333]">
              كلمة المرور
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
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="كلمة المرور"
                  className="h-full w-full border-0 text-sm outline-none"
                />
              </div>
            </label>

            {isSignup ? (
              <label className="block text-sm text-[#333333]">
                تأكيد كلمة المرور
                <div className="mt-2 flex h-11 items-center gap-2 rounded-md border border-[#E5E5E5] px-3 focus-within:border-[#B47720]">
                  <button
                    type="button"
                    className="text-[#7A7A7A]"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    aria-label={
                      showConfirm ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                    }
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="كلمة المرور"
                    className="h-full w-full border-0 text-sm outline-none"
                  />
                </div>
              </label>
            ) : (
              <div className="text-sm text-[#B47720]">نسيت كلمة المرور</div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center rounded-md bg-[#B47720] text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSignup ? "إنشاء حساب" : "تسجيل الدخول"}
            </button>

            {status ? (
              <p className="text-center text-sm text-[#666666]">{status}</p>
            ) : null}

            <div className="border-t pt-4 text-center text-sm text-[#666666]">
              {isSignup ? "تمتلك حساب بالفعل؟" : "لا تمتلك حساب؟"}
            </div>
            <button
              type="button"
              onClick={() => onModeChange(isSignup ? "login" : "signup")}
              className="h-12 w-full rounded-md border border-[#F0D7B8] text-sm font-semibold text-[#B47720] hover:bg-[#FFF7ED]"
            >
              {isSignup ? "تسجيل دخول الآن" : "إنشاء حساب"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
