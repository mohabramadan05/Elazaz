"use client";
import { useEffect, useMemo, useState, type FormEvent } from "react";
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
import { useRouter } from "next/navigation";
import AuthModal from "./AuthModal";
import { createClient } from "@/lib/supabase/client";
import {
  AUTH_MODAL_OPEN_EVENT,
  type AuthModalMode,
  type OpenAuthModalDetail,
} from "@/lib/auth-modal";

export default function Header() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthModalMode>("login");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!isMounted) return;
      const user = data.user ?? null;
      const email = user?.email ?? null;
      const metadata = user?.user_metadata ?? {};
      const rawName =
        metadata.full_name || metadata.name || metadata.display_name || null;
      const fallbackName =
        typeof email === "string" ? email.split("@")[0] : null;
      const metadataImage =
        typeof metadata.image_url === "string" && metadata.image_url.trim()
          ? metadata.image_url.trim()
          : null;
      setUserEmail(email);
      setUserName(rawName || fallbackName);

      if (!user?.id) {
        setUserImageUrl(metadataImage);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("image_url")
        .eq("id", user.id)
        .maybeSingle();
      if (!isMounted) return;
      const profileImage =
        typeof profile?.image_url === "string" && profile.image_url.trim()
          ? profile.image_url.trim()
          : null;
      setUserImageUrl(profileImage || metadataImage);
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

  useEffect(() => {
    const handleOpenAuthModal = (event: Event) => {
      const detail = (event as CustomEvent<OpenAuthModalDetail>).detail;
      setAuthMode(detail?.mode === "signup" ? "signup" : "login");
      setIsAuthOpen(true);
      setIsUserMenuOpen(false);
    };

    window.addEventListener(AUTH_MODAL_OPEN_EVENT, handleOpenAuthModal);
    return () => {
      window.removeEventListener(AUTH_MODAL_OPEN_EVENT, handleOpenAuthModal);
    };
  }, []);

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

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    const params = new URLSearchParams();

    if (query) {
      params.set("q", query);
    }

    const target = params.toString() ? `/shop?${params.toString()}` : "/shop";
    router.push(target);
    setIsMobileSearchOpen(false);
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

                <Link href={"tel:+201027043700"}>
                  <p dir="ltr" className="text-[#666666]">
                    {" "}
                    +201027043700{" "}
                  </p>
                </Link>
              </div>
              <span className="h-3 border-l border-[#CCCCCC]"></span>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#B47720]" />
                <Link href="mailto:elazazeg@gmail.com">
                  <p className="text-[#666666]">elazazeg@gmail.com</p>
                </Link>
              </div>
            </div>
            <div className="flex flex-row items-center space-x-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#008C56]" />
                <p className="text-[#666666]">العربية - عربي</p>
              </div>
              <span className="h-3 border-l border-[#CCCCCC]"></span>
              <Link
                href="/profile?panel=wishlist"
                className="text-[#666666] hover:text-[#333333]"
              >
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
              <Link
                href="/contact-us"
                className="text-[#666666] hover:text-[#333333]"
              >
                اتصل بنا
              </Link>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-[#FFFFFF] w-full py-3 px-4 lg:px-40 flex items-center justify-between shadow-sm">
          <div className="flex gap-2 lg:gap-4">
            {/* Mobile: Hamburger Menu */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6 text-[#333333]" />
            </button>

            {/* Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen((prev) => !prev)}
              className="lg:hidden w-10 h-10 rounded-full bg-[#FFF] flex items-center justify-center hover:opacity-80"
              aria-label="Toggle search"
            >
              {isMobileSearchOpen ? (
                <X className="w-5 h-5 text-[#666666]" />
              ) : (
                <Search className="w-5 h-5 text-[#666666]" />
              )}
            </button>
          </div>

          {/* Logo */}
          <Link href="/" className="flex gap-0 items-center">
            <Image
              src="/assets/logo.png"
              alt="ELAZAZ Logo"
              height={100}
              width={75}
              className="h-[58px] w-auto"
            />
          </Link>

          {/* Search - Hidden on mobile */}
          <div className="hidden lg:block">
            <form className="relative" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="ابحث عن منتج"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-96 h-12 border border-[#CCCCCC] rounded-md px-4 pr-10 focus:outline-none focus:border-[#B47720]"
              />
              <button
                type="submit"
                aria-label="Search products"
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Search className="w-5 h-5 text-gray-400" />
              </button>
            </form>
           </div>

          {/* Right Side Icons */}
          <div className="flex gap-3 lg:gap-4">
            {/* User Icon */}
            <div className="relative">
              <button
                type="button"
                onClick={handleUserClick}
                className="flex gap-2 items-center cursor-pointer hover:opacity-80"
              >
                <div className="w-10 h-10 rounded-full bg-[#F8F8F8] flex items-center justify-center overflow-hidden">
                  {userImageUrl ? (
                    <Image
                      src={userImageUrl}
                      alt={userName ? `${userName} avatar` : "User avatar"}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-[#666666]" />
                  )}
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
                <div className="absolute left-0 mt-2 w-44 rounded-md border border-[#E5E5E5] bg-white shadow-lg z-50">
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

        {/* Mobile Search Bar */}
        {isMobileSearchOpen ? (
          <div className="lg:hidden bg-white px-4 py-3 border-b">
            <form className="relative" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="ابحث عن منتج"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full h-10 border border-[#CCCCCC] rounded-md px-4 pr-10 focus:outline-none focus:border-[#B47720]"
              />
              <button
                type="submit"
                aria-label="Search products"
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Search className="w-5 h-5 text-gray-400" />
              </button>
            </form>
          </div>
        ) : null}
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
                <Link href={"tel:+201027043700"}>
                  <p className="text-sm text-[#666666]">+201027043700</p>
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#B47720]" />
                <Link href="mailto:elazazeg@gmail.com">
                  <p className="text-sm text-[#666666]">elazazeg@gmail.com</p>
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#008C56]" />
                <p className="text-sm text-[#666666]">العربية - عربي</p>
              </div>
            </div>

            {/* Additional Links */}
            <div className="p-4 space-y-3 border-t">
              <Link
                href="/profile?panel=wishlist"
                className="flex items-center gap-2 py-2 hover:bg-gray-50"
              >
                <Heart className="w-5 h-5 text-[#666666]" />
                <span className="text-[#333333]">المفضلة</span>
              </Link>
              <Link
                href="/policies/refund-policy"
                className="flex items-center gap-2 py-2 hover:bg-gray-50"
              >
                <RefreshCw className="w-5 h-5 text-[#666666]" />
                <span className="text-[#333333]">سياسة الاسترجاع</span>
              </Link>

              <Link
                href="/contact-us"
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
