"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  User,
  ShoppingCart,
  Phone,
  Mail,
  Globe,
  Heart,
  RefreshCw,
  MessageCircle,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AuthModal from "./AuthModal";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
  const supabase = useMemo(() => createClient(), []);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!isMounted) return;
      const email = data.user?.email ?? null;
      const metadata = data.user?.user_metadata ?? {};
      const rawName =
        metadata.full_name ||
        metadata.name ||
        metadata.display_name ||
        null;
      const fallbackName =
        typeof email === "string" ? email.split("@")[0] : null;
      setUserEmail(email);
      setUserName(rawName || fallbackName);
    };

    const loadCartCount = async () => {
      try {
        const response = await fetch("/api/cart/count");
        if (!response.ok) return;
        const payload = (await response.json()) as { count?: number };
        if (typeof payload.count === "number" && isMounted) {
          setCartCount(payload.count);
        }
      } catch {
        if (isMounted) setCartCount(0);
      }
    };

    loadUser();
    loadCartCount();

    const { data: subscription } = supabase.auth.onAuthStateChange(() => {
      loadUser();
      loadCartCount();
      setIsUserMenuOpen(false);
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleUserClick = () => {
    if (!userEmail) {
      setAuthMode("login");
      setIsAuthOpen(true);
      return;
    }
    setIsUserMenuOpen((prev) => !prev);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsUserMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 right-0 left-0 z-50">
        {/* Top Bar - Hidden on mobile */}
        <div className="hidden lg:block bg-[#F8F8F8] w-full py-2 px-40 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex flex-row items-center space-x-4">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#B47720]" />
                <p dir="ltr" className="text-[#666666]">
                  +966558441497
                </p>
              </div>
              <span className="h-3 border-l border-[#CCCCCC]"></span>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#B47720]" />
                <p className="text-[#666666]">Support@azazbags.sait</p>
              </div>
            </div>
            <div className="flex flex-row items-center space-x-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#008C56]" />
                <p className="text-[#666666]">العربية - عربي</p>
              </div>
              <span className="h-3 border-l border-[#CCCCCC]"></span>
              <Link href="/profile/wishlist" className="text-[#666666] hover:text-[#333333]">
                المفضلة
              </Link>
              <span className="h-3 border-l border-[#CCCCCC]"></span>
              <Link
                href="/policies/refund-policy"
                className="text-[#666666] hover:text-[#333333]"
              >
                سياسة الاسترجاع
              </Link>
              <span className="h-3 border-l border-[#CCCCCC]"></span>
              <Link href="/contact-us" className="text-[#666666] hover:text-[#333333]">
                اتصل بنا
              </Link>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-[#FFFFFF] w-full py-3 px-4 lg:px-40 flex items-center justify-between shadow-sm">
          {/* Mobile: Hamburger Menu */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6 text-[#333333]" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex gap-0 items-center">
            <Image
              src="/assets/logo.png"
              alt="ELAZAZ Logo"
              height={100}
              width={75}
            />
          </Link>

          {/* Search - Hidden on mobile */}
          <div className="hidden lg:block">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن منتج"
                className="w-96 h-12 border border-[#CCCCCC] rounded-md px-4 pr-10 focus:outline-none focus:border-[#B47720]"
              />
              <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex gap-2 lg:gap-4">
            {/* User Icon */}
            <div className="relative">
              <button
                type="button"
                onClick={handleUserClick}
                className="flex gap-2 items-center cursor-pointer hover:opacity-80"
              >
                <div className="w-10 h-10 rounded-full bg-[#F8F8F8] flex items-center justify-center">
                  <User className="w-5 h-5 text-[#666666]" />
                </div>
                <div className="hidden lg:flex flex-col">
                  <p className="text-[#A5A5A5] text-sm">
                    {userEmail ? "مرحبا بك" : "تسجيل الدخول"}
                  </p>
                  <p className="text-[#333333] text-sm flex items-end gap-1">
                    {userName ?? "حسابي"}
                    <ChevronDown className="w-3 h-3" />
                  </p>
                </div>
              </button>
              {userEmail && isUserMenuOpen ? (
                <div className="absolute right-0 mt-2 w-44 rounded-md border border-[#E5E5E5] bg-white shadow-lg z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-[#333333] hover:bg-gray-50"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    الملف الشخصي
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full text-right px-4 py-2 text-sm text-[#333333] hover:bg-gray-50"
                  >
                    تسجيل الخروج
                  </button>
                </div>
              ) : null}
            </div>

            {/* Cart Icon */}
            <Link
              href="/profile/cart"
              className="flex gap-2 items-center cursor-pointer hover:opacity-80"
            >
              <div className="w-10 h-10 rounded-full bg-[#F8F8F8] flex items-center justify-center relative">
                <ShoppingCart className="w-5 h-5 text-[#666666]" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#B47720] text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <div className="hidden lg:flex flex-col">
                <p className="text-[#A5A5A5] text-sm">سلة المشتريات</p>
                <p className="text-[#333333] text-sm flex items-end gap-1">
                  {cartCount}
                  <span className="text-[#B47720] font-bold">منتج</span>
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Navigation Bar - Hidden on mobile */}
        <div className="hidden lg:flex bg-[#B47720] w-full py-2 items-center justify-center gap-8">
          <p className="text-[#FFFFFF] flex items-center gap-1 cursor-pointer hover:opacity-80">
            كل المنتجات
            <ChevronDown className="w-4 h-4" />
          </p>
          <p className="text-[#FFFFFF] flex items-center gap-1 cursor-pointer hover:opacity-80">
            حقائب اليد
            <ChevronDown className="w-4 h-4" />
          </p>
          <p className="text-[#FFFFFF] flex items-center gap-1 cursor-pointer hover:opacity-80">
            جديدنا
            <ChevronDown className="w-4 h-4" />
          </p>
          <p className="text-[#FFFFFF] flex items-center gap-1 cursor-pointer hover:opacity-80">
            العروض
            <ChevronDown className="w-4 h-4" />
          </p>
          <p className="text-[#FFFFFF] flex items-center gap-1 cursor-pointer hover:opacity-80">
            الأكثر مبيعًا
            <ChevronDown className="w-4 h-4" />
          </p>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden bg-white px-4 py-3 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن منتج"
              className="w-full h-10 border border-[#CCCCCC] rounded-md px-4 pr-10 focus:outline-none focus:border-[#B47720]"
            />
            <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity lg:hidden ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      >
        <div
          className={`fixed right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-[#333333]">القائمة</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6 text-[#333333]" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="overflow-y-auto h-full pb-20">
            {/* Top Info Section */}
            <div className="p-4 bg-[#F8F8F8] space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#B47720]" />
                <p className="text-sm text-[#666666]">+966558441497</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#B47720]" />
                <p className="text-sm text-[#666666]">Support@azazbags.sait</p>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#008C56]" />
                <p className="text-sm text-[#666666]">العربية - عربي</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="p-4 space-y-2">
              <div className="py-3 border-b cursor-pointer hover:bg-gray-50 flex items-center justify-between">
                <span className="text-[#333333]">كل المنتجات</span>
                <ChevronDown className="w-4 h-4 text-[#666666]" />
              </div>
              <div className="py-3 border-b cursor-pointer hover:bg-gray-50 flex items-center justify-between">
                <span className="text-[#333333]">حقائب اليد</span>
                <ChevronDown className="w-4 h-4 text-[#666666]" />
              </div>
              <div className="py-3 border-b cursor-pointer hover:bg-gray-50 flex items-center justify-between">
                <span className="text-[#333333]">جديدنا</span>
                <ChevronDown className="w-4 h-4 text-[#666666]" />
              </div>
              <div className="py-3 border-b cursor-pointer hover:bg-gray-50 flex items-center justify-between">
                <span className="text-[#333333]">العروض</span>
                <ChevronDown className="w-4 h-4 text-[#666666]" />
              </div>
              <div className="py-3 border-b cursor-pointer hover:bg-gray-50 flex items-center justify-between">
                <span className="text-[#333333]">الأكثر مبيعًا</span>
                <ChevronDown className="w-4 h-4 text-[#666666]" />
              </div>
            </div>

            {/* Additional Links */}
            <div className="p-4 space-y-3 border-t">
              <Link
                href="/wishlist"
                className="flex items-center gap-2 py-2 hover:bg-gray-50"
              >
                <Heart className="w-5 h-5 text-[#666666]" />
                <span className="text-[#333333]">المفضلة</span>
              </Link>
              <Link
                href="/refund-policy"
                className="flex items-center gap-2 py-2 hover:bg-gray-50"
              >
                <RefreshCw className="w-5 h-5 text-[#666666]" />
                <span className="text-[#333333]">سياسة الاسترجاع</span>
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-2 py-2 hover:bg-gray-50"
              >
                <MessageCircle className="w-5 h-5 text-[#666666]" />
                <span className="text-[#333333]">اتصل بنا</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        open={isAuthOpen}
        mode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onModeChange={(mode) => setAuthMode(mode)}
      />
    </>
  );
}
