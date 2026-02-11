"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type PanelKey = "notifications" | "orders" | "account" | "wishlist";

const panelLinks: Array<{ key: PanelKey; label: string; count?: number }> = [
  { key: "notifications", label: "الإشعارات" },
  { key: "orders", label: "الطلبات" },
  { key: "account", label: "حسابي" },
  { key: "wishlist", label: "المفضلة" },
];

type WishlistItem = {
  id: string;
  variant_id?: string | null;
  product_name?: string | null;
  color_name?: string | null;
  size_name?: string | null;
  variant_price?: number | null;
  variant_discount_price?: number | null;
  main_image_url?: string | null;
};

type WishlistResponse = {
  items: WishlistItem[];
};

type Address = {
  id: string;
  user_id: string;
  country: string | null;
  city: string | null;
  street: string | null;
  postal_code: string | null;
  phone: string | null;
  is_default: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  status: string | null;
  created_at: string | null;
};

const COUNTRY_OPTIONS = [
  { code: "+20", label: "مصر" },
  { code: "+966", label: "السعودية" },
  { code: "+971", label: "الإمارات" },
  { code: "+965", label: "الكويت" },
  { code: "+974", label: "قطر" },
  { code: "+973", label: "البحرين" },
  { code: "+968", label: "عُمان" },
  { code: "+962", label: "الأردن" },
  { code: "+961", label: "لبنان" },
  { code: "+963", label: "سوريا" },
  { code: "+964", label: "العراق" },
  { code: "+213", label: "الجزائر" },
  { code: "+212", label: "المغرب" },
  { code: "+216", label: "تونس" },
  { code: "+218", label: "ليبيا" },
  { code: "+249", label: "السودان" },
  { code: "+252", label: "الصومال" },
  { code: "+222", label: "موريتانيا" },
  { code: "+967", label: "اليمن" },
  { code: "+970", label: "فلسطين" },
  { code: "+253", label: "جيبوتي" },
  { code: "+269", label: "جزر القمر" },
] as const;

const PHONE_LENGTH_BY_CODE: Record<string, number> = {
  "+20": 10,
  "+966": 9,
  "+971": 9,
  "+965": 8,
  "+974": 8,
  "+973": 8,
  "+968": 8,
  "+962": 9,
  "+961": 8,
  "+963": 9,
  "+964": 10,
  "+213": 9,
  "+212": 9,
  "+216": 8,
  "+218": 9,
  "+249": 9,
  "+252": 8,
  "+222": 8,
  "+967": 9,
  "+970": 9,
  "+253": 8,
  "+269": 7,
};

const getUnitPrice = (item: WishlistItem) => {
  const base = item.variant_price ?? 0;
  const discount = item.variant_discount_price ?? 0;
  if (discount > 0 && discount < base) return discount;
  return base;
};

const formatPrice = (value: number) => {
  return value.toLocaleString("en-US");
};

export default function ProfilePage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activePanel, setActivePanel] = useState<PanelKey>("account");
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [wishlistLoaded, setWishlistLoaded] = useState(false);
  const [wishlistUpdatingId, setWishlistUpdatingId] = useState<string | null>(
    null,
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsLoaded, setNotificationsLoaded] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressMessage, setAddressMessage] = useState<string | null>(null);
  const [addressCountry, setAddressCountry] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressPostalCode, setAddressPostalCode] = useState("");
  const [addressPhone, setAddressPhone] = useState("");
  const [addressPhoneCode, setAddressPhoneCode] = useState("+966");
  const [addressIsDefault, setAddressIsDefault] = useState(true);
  const phoneDigitsLimit = PHONE_LENGTH_BY_CODE[addressPhoneCode] ?? 10;

  useEffect(() => {
    if (activePanel !== "wishlist" || wishlistLoaded) return;
    const loadWishlist = async () => {
      setIsWishlistLoading(true);
      try {
        const response = await fetch("/api/wishlist/items");
        const payload = (await response.json()) as WishlistResponse;
        setWishlistItems(payload.items ?? []);
        setWishlistLoaded(true);
      } finally {
        setIsWishlistLoading(false);
      }
    };
    loadWishlist();
  }, [activePanel, wishlistLoaded]);

  useEffect(() => {
    if (!userId || activePanel !== "notifications" || notificationsLoaded) return;
    let isMounted = true;
    const loadNotifications = async () => {
      setNotificationsLoading(true);
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("id,title,description,status,created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
        if (!isMounted) return;
        if (error) {
          setNotifications([]);
          return;
        }
        setNotifications((data as NotificationItem[]) ?? []);
        setNotificationsLoaded(true);
      } finally {
        if (isMounted) setNotificationsLoading(false);
      }
    };
    loadNotifications();
    return () => {
      isMounted = false;
    };
  }, [activePanel, notificationsLoaded, supabase, userId]);

  useEffect(() => {
    if (!userId || activePanel !== "notifications") return;
    let isMounted = true;
    const markNotificationsRead = async () => {
      const { error } = await supabase
        .from("notifications")
        .update({ status: "read" })
        .eq("user_id", userId)
        .eq("status", "unread");
      if (!isMounted || error) return;
      setNotifications((prev) =>
        prev.map((item) =>
          item.status === "unread" ? { ...item, status: "read" } : item,
        ),
      );
      setUnreadNotificationsCount(0);
    };
    markNotificationsRead();
    return () => {
      isMounted = false;
    };
  }, [activePanel, supabase, userId]);

  useEffect(() => {
    if (!userId) return;
    let isMounted = true;
    const loadUnreadCount = async () => {
      const { count } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "unread");
      if (!isMounted) return;
      setUnreadNotificationsCount(count ?? 0);
    };
    loadUnreadCount();
    return () => {
      isMounted = false;
    };
  }, [supabase, userId]);

  useEffect(() => {
    const panel = searchParams.get("panel") as PanelKey | null;
    if (
      panel &&
      ["notifications", "orders", "account", "wishlist"].includes(panel)
    ) {
      setActivePanel(panel);
    }
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      const { data } = await supabase.auth.getUser();
      if (!isMounted) return;
      const user = data.user;
      const metadata = user?.user_metadata ?? {};
      setUserId(user?.id ?? null);
      setProfileEmail(user?.email ?? "");
      setProfileName(
        metadata.full_name || metadata.name || metadata.display_name || "",
      );
      setProfilePhone(metadata.phone || "");
      setAvatarUrl(metadata.avatar_url || "");
    };
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [supabase]);

  useEffect(() => {
    if (!userId || activePanel !== "account") return;
    let isMounted = true;
    const loadAddresses = async () => {
      setAddressesLoading(true);
      try {
        const { data, error } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", userId)
          .order("is_default", { ascending: false })
          .order("created_at", { ascending: false });
        if (!isMounted) return;
        if (error) {
          setAddressMessage("تعذر تحميل العناوين. حاول مرة أخرى.");
          return;
        }
        setAddresses((data as Address[]) ?? []);
      } finally {
        if (isMounted) setAddressesLoading(false);
      }
    };
    loadAddresses();
    return () => {
      isMounted = false;
    };
  }, [activePanel, supabase, userId]);

  const handleRemoveWishlistItem = async (item: WishlistItem) => {
    if (!item.variant_id || wishlistUpdatingId) return;
    setWishlistUpdatingId(item.id);
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant_id: item.variant_id }),
      });
      if (!response.ok) return;
      setWishlistItems((prev) => prev.filter((row) => row.id !== item.id));
    } finally {
      setWishlistUpdatingId(null);
    }
  };

  const handlePanelChange = (panel: PanelKey) => {
    setActivePanel(panel);
    const params = new URLSearchParams(searchParams.toString());
    if (panel === "account") {
      params.delete("panel");
    } else {
      params.set("panel", panel);
    }
    const query = params.toString();
    router.replace(query ? `/profile?${query}` : "/profile");
  };

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
      window.location.href = "/";
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleProfileSave = async () => {
    setProfileLoading(true);
    setProfileMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profileName,
          phone: profilePhone,
          avatar_url: avatarUrl,
        },
      });
      if (error) {
        setProfileMessage("تعذر حفظ البيانات. حاول مرة أخرى.");
        return;
      }
      setProfileMessage("تم تحديث بياناتك بنجاح.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAvatarPick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setProfileLoading(true);
    setProfileMessage(null);
    try {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) {
        setProfileMessage("يجب تسجيل الدخول أولاً.");
        return;
      }
      const extension = file.name.split(".").pop() || "jpg";
      const filePath = `${user.id}/${Date.now()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("users")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        setProfileMessage("تعذر رفع الصورة. حاول مرة أخرى.");
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("users").getPublicUrl(filePath);

      const previousUrl = avatarUrl;
      if (previousUrl) {
        try {
          const url = new URL(previousUrl);
          const marker = "/storage/v1/object/public/users/";
          const index = url.pathname.indexOf(marker);
          if (index !== -1) {
            const oldPath = url.pathname.slice(index + marker.length);
            if (oldPath && oldPath !== filePath) {
              await supabase.storage.from("users").remove([oldPath]);
            }
          }
        } catch {
          // Ignore parse errors for non-storage URLs
        }
      }

      setAvatarUrl(publicUrl);
      await supabase.auth.updateUser({
        data: {
          avatar_url: publicUrl,
          full_name: profileName,
          phone: profilePhone,
        },
      });
      setProfileMessage("تم تحديث صورة الحساب.");
    } finally {
      setProfileLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const resetAddressForm = () => {
    setAddressCountry("");
    setAddressCity("");
    setAddressStreet("");
    setAddressPostalCode("");
    setAddressPhone("");
    setAddressPhoneCode("+966");
    setAddressIsDefault(true);
  };

  const handleAddressSave = async () => {
    if (!userId || addressesLoading) return;
    setAddressMessage(null);
    if (
      !addressCountry.trim() ||
      !addressCity.trim() ||
      !addressStreet.trim()
    ) {
      setAddressMessage("يرجى تعبئة الدولة والمدينة والشارع.");
      return;
    }
    if (
      addressPhone.trim().length > 0 &&
      addressPhone.trim().length !== phoneDigitsLimit
    ) {
      setAddressMessage(
        `رقم الهاتف يجب أن يكون ${phoneDigitsLimit} أرقام لهذه الدولة.`,
      );
      return;
    }
    setAddressesLoading(true);
    try {
      if (addressIsDefault) {
        await supabase
          .from("addresses")
          .update({ is_default: false })
          .eq("user_id", userId);
      }
      const { error } = await supabase.from("addresses").insert({
        user_id: userId,
        country: addressCountry.trim(),
        city: addressCity.trim(),
        street: addressStreet.trim(),
        postal_code: addressPostalCode.trim() || null,
        phone:
          addressPhone.trim().length > 0
            ? `${addressPhoneCode}${addressPhone.trim()}`
            : null,
        is_default: addressIsDefault,
      });
      if (error) {
        setAddressMessage("تعذر حفظ العنوان. حاول مرة أخرى.");
        return;
      }
      resetAddressForm();
      const { data } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", userId)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });
      setAddresses((data as Address[]) ?? []);
      setAddressMessage("تم حفظ العنوان بنجاح.");
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleAddressDelete = async (addressId: string) => {
    if (!userId || addressesLoading) return;
    setAddressMessage(null);
    setAddressesLoading(true);
    try {
      const { error } = await supabase
        .from("addresses")
        .delete()
        .eq("id", addressId)
        .eq("user_id", userId);
      if (error) {
        setAddressMessage("تعذر حذف العنوان. حاول مرة أخرى.");
        return;
      }
      setAddresses((prev) =>
        prev.filter((address) => address.id !== addressId),
      );
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    if (!userId || addressesLoading) return;
    setAddressMessage(null);
    setAddressesLoading(true);
    try {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", userId);
      const { error } = await supabase
        .from("addresses")
        .update({ is_default: true })
        .eq("id", addressId)
        .eq("user_id", userId);
      if (error) {
        setAddressMessage("تعذر تعيين العنوان الافتراضي.");
        return;
      }
      setAddresses((prev) =>
        prev.map((address) => ({
          ...address,
          is_default: address.id === addressId,
        })),
      );
    } finally {
      setAddressesLoading(false);
    }
  };

  return (
    <section className="bg-white py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="text-xs text-[#888888] flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-[#B47720]">
            الرئيسية
          </Link>
          <span>/</span>
          <span className="text-[#B47720]">حسابي</span>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-3">
            {activePanel === "wishlist" && (
              <>
                {isWishlistLoading ? (
                  <div className="rounded-sm border border-[#EEEEEE] bg-white p-6 text-sm text-[#666666]">
                    جاري تحميل المفضلة...
                  </div>
                ) : wishlistItems.length === 0 ? (
                  <div className="rounded-sm border border-[#EEEEEE] bg-white p-6 text-sm text-[#666666]">
                    لا توجد منتجات في المفضلة حالياً.
                  </div>
                ) : (
                  wishlistItems.map((item) => {
                    const unitPrice = getUnitPrice(item);
                    const image = item.main_image_url || "/assets/logo.png";
                    return (
                      <Link key={item.id} href={"/product/" + item.variant_id}>
                        <div
                          key={item.id}
                          className="rounded-sm border border-[#EEEEEE] bg-white px-4 py-3 shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <Image
                              src={image}
                              alt={item.product_name ?? "Product"}
                              width={80}
                              height={80}
                              className="h-20 w-20 rounded-sm border border-[#EEEEEE] object-cover"
                            />
                            <div className="flex flex-1 items-center justify-between gap-4">
                              <div className="text-right">
                                <p className="text-sm font-semibold text-[#333333]">
                                  {item.product_name ?? "منتج"}{" "}
                                  {(item.color_name || item.size_name) && (
                                    <span>
                                      {item.color_name ?? ""}
                                      {item.color_name && item.size_name
                                        ? " , "
                                        : ""}
                                      {item.size_name ?? ""}
                                    </span>
                                  )}
                                </p>
                                {/* {(item.color_name || item.size_name) && (
                                <p className="text-xs text-[#888888]">
                                  {item.color_name
                                    ? item.color_name
                                    : ""}
                                  {item.color_name && item.size_name ? " - " : ""}
                                  {item.size_name
                                    ? item.size_name
                                    : ""}
                                </p>
                              )} */}
                                <p className="text-xs text-[#888888]">
                                  {formatPrice(unitPrice)} ج.م
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveWishlistItem(item)}
                                disabled={wishlistUpdatingId === item.id}
                                className="h-8 w-8 rounded-full flex justify-center items-center bg-[#F8F8F8] text-[#444444] hover:bg-[#B47720] hover:text-[#FFFFFF] disabled:opacity-60"
                                aria-label="حذف"
                              >
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="text-current"
                                >
                                  <path
                                    d="M2.19526 3.13807C1.93491 2.87772 1.93491 2.45561 2.19526 2.19526C2.45562 1.93491 2.87772 1.93491 3.13807 2.19526L5.99999 5.05718L8.86189 2.19526C9.12225 1.93491 9.54438 1.93491 9.80473 2.19526C10.0651 2.45561 10.0651 2.87772 9.80473 3.13807L6.94279 5.99999L9.80473 8.86189C10.0651 9.12225 10.0651 9.54438 9.80473 9.80473C9.54438 10.0651 9.12225 10.0651 8.86189 9.80473L5.99999 6.94279L3.13807 9.80473C2.87772 10.0651 2.45562 10.0651 2.19526 9.80473C1.93491 9.54438 1.93491 9.12225 2.19526 8.86189L5.05718 5.99999L2.19526 3.13807Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </>
            )}

            {activePanel === "notifications" && (
              <>
                {notificationsLoading ? (
                  <div className="rounded-sm border border-[#EEEEEE] bg-white p-6 text-sm text-[#666666]">
                    جاري تحميل الإشعارات...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="rounded-sm border border-[#EEEEEE] bg-white p-6 text-sm text-[#666666]">
                    لا توجد إشعارات حالياً.
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {notifications.map((item) => {
                      const isUnread = item.status === "unread";
                      return (
                        <div
                          key={item.id}
                          className="rounded-sm border border-[#EEEEEE] bg-white p-4 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <p className="text-sm font-semibold text-[#333333]">
                                {item.title}
                              </p>
                              <p className="text-xs text-[#666666]">
                                {item.description}
                              </p>
                            </div>
                            <span
                              className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                                isUnread
                                  ? "bg-[#F6F0E6] text-[#B47720]"
                                  : "bg-[#F8F8F8] text-[#888888]"
                              }`}
                            >
                              {isUnread ? "جديد" : "مقروء"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {activePanel === "orders" && (
              <div className="rounded-sm border border-[#EEEEEE] bg-white p-6 text-sm text-[#666666]">
                لا توجد طلبات حتى الآن.
              </div>
            )}

            {activePanel === "account" && (
              <div className="rounded-sm border border-[#EEEEEE] bg-white p-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-full border border-[#EEEEEE] bg-[#F8F8F8]">
                      <Image
                        src={avatarUrl || "/assets/logo.png"}
                        alt="الصورة الشخصية"
                        width={80}
                        height={80}
                        className="h-20 w-20 object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-[#333333]">
                        الصورة الشخصية
                      </p>
                      <button
                        type="button"
                        onClick={handleAvatarPick}
                        className="rounded-sm border border-[#B47720] px-4 py-2 text-xs font-semibold text-[#B47720] hover:bg-[#B47720] hover:text-white"
                      >
                        تغيير الصورة
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>
                  </div>
                  {profileMessage ? (
                    <div className="text-xs text-[#666666]">
                      {profileMessage}
                    </div>
                  ) : null}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs text-[#666666]">
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(event) => setProfileName(event.target.value)}
                      className="w-full rounded-sm border border-[#EEEEEE] px-3 py-2 text-sm text-[#333333] focus:border-[#B47720] focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs text-[#666666]">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={profileEmail}
                      readOnly
                      className="w-full rounded-sm border border-[#EEEEEE] bg-[#F8F8F8] px-3 py-2 text-sm text-[#777777]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProfileSave}
                  disabled={profileLoading}
                  className="mt-6 rounded-sm bg-[#B47720] px-6 py-2 text-sm font-semibold text-white hover:bg-[#9F6418] disabled:opacity-60"
                >
                  {profileLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>

                <div className="mt-10 border-t border-[#EEEEEE] pt-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-sm font-semibold text-[#333333]">
                      العناوين
                    </h3>
                    {addressMessage ? (
                      <span className="text-xs text-[#666666]">
                        {addressMessage}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs text-[#666666]">
                        الدولة
                      </label>
                      <select
                        value={addressCountry}
                        onChange={(event) => {
                          const nextCountry = event.target.value;
                          setAddressCountry(nextCountry);
                          const option = COUNTRY_OPTIONS.find(
                            (item) => item.label === nextCountry,
                          );
                          if (option) {
                            setAddressPhoneCode(option.code);
                            setAddressPhone("");
                          }
                        }}
                        className="w-full rounded-sm border border-[#EEEEEE] bg-white px-3 py-2 text-sm text-[#333333] focus:border-[#B47720] focus:outline-none"
                      >
                        <option value="">اختر الدولة</option>
                        {COUNTRY_OPTIONS.map((option) => (
                          <option key={option.code} value={option.label}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs text-[#666666]">
                        المدينة
                      </label>
                      <input
                        type="text"
                        value={addressCity}
                        onChange={(event) => setAddressCity(event.target.value)}
                        className="w-full rounded-sm border border-[#EEEEEE] px-3 py-2 text-sm text-[#333333] focus:border-[#B47720] focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-xs text-[#666666]">
                        الشارع
                      </label>
                      <input
                        type="text"
                        value={addressStreet}
                        onChange={(event) =>
                          setAddressStreet(event.target.value)
                        }
                        className="w-full rounded-sm border border-[#EEEEEE] px-3 py-2 text-sm text-[#333333] focus:border-[#B47720] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs text-[#666666]">
                        الرمز البريدي
                      </label>
                      <input
                        type="text"
                        value={addressPostalCode}
                        onChange={(event) =>
                          setAddressPostalCode(event.target.value)
                        }
                        className="w-full rounded-sm border border-[#EEEEEE] px-3 py-2 text-sm text-[#333333] focus:border-[#B47720] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs text-[#666666]">
                        رقم الهاتف
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={addressPhoneCode}
                          onChange={(event) =>
                            setAddressPhoneCode(event.target.value)
                          }
                          className="w-28 rounded-sm border border-[#EEEEEE] bg-white px-2 py-2 text-sm text-[#333333] focus:border-[#B47720] focus:outline-none"
                        >
                          {COUNTRY_OPTIONS.map((option) => (
                            <option key={option.code} value={option.code}>
                              {option.label} {option.code}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          value={addressPhone}
                          onChange={(event) =>
                            setAddressPhone(
                              event.target.value.replace(/[^\d]/g, ""),
                            )
                          }
                          placeholder={`${"0".repeat(phoneDigitsLimit)}`}
                          maxLength={phoneDigitsLimit}
                          className="w-full rounded-sm border border-[#EEEEEE] px-3 py-2 text-sm text-[#333333] focus:border-[#B47720] focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-2 text-xs text-[#666666]">
                      <input
                        id="address-default"
                        type="checkbox"
                        checked={addressIsDefault}
                        onChange={(event) =>
                          setAddressIsDefault(event.target.checked)
                        }
                        className="h-4 w-4 rounded border-[#DDDDDD] text-[#B47720] focus:ring-[#B47720]"
                      />
                      <label htmlFor="address-default">
                        تعيين كعنوان افتراضي
                      </label>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddressSave}
                    disabled={addressesLoading}
                    className="mt-4 rounded-sm border border-[#B47720] px-4 py-2 text-xs font-semibold text-[#B47720] hover:bg-[#B47720] hover:text-white disabled:opacity-60"
                  >
                    {addressesLoading ? "جاري الحفظ..." : "إضافة العنوان"}
                  </button>

                  <div className="mt-6 grid gap-3">
                    {addressesLoading && addresses.length === 0 ? (
                      <div className="rounded-sm border border-[#EEEEEE] bg-[#F8F8F8] p-4 text-xs text-[#666666]">
                        جاري تحميل العناوين...
                      </div>
                    ) : addresses.length === 0 ? (
                      <div className="rounded-sm border border-[#EEEEEE] bg-[#F8F8F8] p-4 text-xs text-[#666666]">
                        لا توجد عناوين مسجلة بعد.
                      </div>
                    ) : (
                      addresses.map((address) => (
                        <div
                          key={address.id}
                          className="rounded-sm border border-[#EEEEEE] bg-white p-4 shadow-sm"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div className="space-y-1 text-sm text-[#333333]">
                              <p className="font-semibold">
                                {address.country ?? "-"} - {address.city ?? "-"}
                              </p>
                              <p className="text-xs text-[#666666]">
                                {address.street ?? "-"}
                              </p>
                              <p className="text-xs text-[#666666]">
                                الرمز البريدي: {address.postal_code ?? "-"}
                              </p>
                              <p className="text-xs text-[#666666]">
                                الهاتف: {address.phone ?? "-"}
                              </p>
                              {address.is_default ? (
                                <span className="inline-flex w-fit items-center rounded-full bg-[#F6F0E6] px-2 py-1 text-[10px] font-semibold text-[#B47720]">
                                  العنوان الافتراضي
                                </span>
                              ) : null}
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs">
                              <button
                                type="button"
                                onClick={() =>
                                  handleSetDefaultAddress(address.id)
                                }
                                disabled={
                                  addressesLoading ||
                                  (address.is_default ?? false)
                                }
                                className="rounded-sm border border-[#B47720] px-3 py-1 font-semibold text-[#B47720] hover:bg-[#B47720] hover:text-white disabled:opacity-60"
                              >
                                تعيين افتراضي
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAddressDelete(address.id)}
                                disabled={addressesLoading}
                                className="rounded-sm border border-[#E11D48] px-3 py-1 font-semibold text-[#E11D48] hover:bg-[#E11D48] hover:text-white disabled:opacity-60"
                              >
                                حذف
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <aside className="h-fit rounded-sm border border-[#EEEEEE] bg-white p-4 shadow-sm">
            <div className="space-y-1 text-sm text-[#444444]">
              {panelLinks.map((link) => {
                const isActive = activePanel === link.key;
                const count =
                  link.key === "notifications"
                    ? unreadNotificationsCount
                    : link.count;
                return (
                  <button
                    key={link.key}
                    type="button"
                    onClick={() => handlePanelChange(link.key)}
                    className={`flex w-full items-center justify-between rounded-sm px-3 py-2 transition ${
                      isActive
                        ? "bg-[#F6F0E6] text-[#B47720]"
                        : "hover:bg-[#F8F8F8]"
                    }`}
                  >
                    <span>{link.label}</span>
                    {typeof count === "number" && count > 0 ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E11D48] text-[10px] font-semibold text-white">
                        {count}
                      </span>
                    ) : null}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex w-full items-center justify-between rounded-sm px-3 py-2 text-[#E11D48] hover:bg-[#FFF1F2] disabled:opacity-60"
              >
                <span>
                  {isSigningOut ? "جاري تسجيل الخروج..." : "تسجيل خروج"}
                </span>
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
