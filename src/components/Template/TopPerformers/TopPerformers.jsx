"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "@/hooks/CustomDebounceHook";
import useAuth from "@/hooks/useAuth";
import UserSkeleton from "@/components/ui/userSkelton";

// ✅ کامنت: وارد کردن تابع API از فایل جداگانه
import { fetchTopPerformers } from "@/lib/API/leaderboardApi";

// آیکون‌ها
import Flag from "@/components/icons/flag";
import SearchIcon_2 from "@/components/icons/searchIcon-2";

function TopPerformers() {
  const { accessToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const {
    data: users,
    error,
    isPending,
    isError,
  } = useQuery({
    // ☢️✅ نکته بسیار مهم: اصلاح queryKey برای جلوگیری از تداخل کش
    // کامنت: کلید کوئری را به یک نام منحصر به فرد تغییر دادیم تا با کش لیست اصلی کاربران تداخل پیدا نکند.
    queryKey: ["topPerformers", debouncedSearchTerm],

    // کامنت: استفاده از تابع جدا شده
    queryFn: fetchTopPerformers,

    enabled: !!accessToken,

    // ✅ نکته بهینه‌سازی: تنظیم staleTime
    // کامنت: به React Query می‌گوییم که این داده تا ۵ دقیقه "تازه" است.
    // این کار از درخواست‌های شبکه غیرضروری هنگام جابجایی بین تب‌ها جلوگیری می‌کند.
    staleTime: 1000 * 60 * 5, // 5 دقیقه
  });

  return (
    <div className="min-h-screen flex flex-col items-center text-center mt-2 ">
      <div className="space-y-6 w-full max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mb-20">
        {/* ... بخش عنوان و جستجو ... */}
        <div className="flex cursor-pointer items-center justify-center">
          <h2 className="flex items-center gap-2 text-colorThemeLite-accent text-lg sm:text-xl font-bold">
            <Flag className="w-6 h-6" />
            <span>برترین شرکت کننده‌ها</span>
          </h2>
        </div>
        <div className="flex flex-col gap-6 rounded-2xl bg-dark md:p-6 text-white transition">
          {/* فیلد جست‌وجو */}
          <div className="border-b border-colorThemeLite-green pb-4">
            <label
              htmlFor="search"
              className="mb-2 text-colorThemeLite-accent font-semibold flex items-center gap-2"
            >
              <SearchIcon_2 />
              <span>جست‌وجو</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2 px-2">
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="نام کاربر یا نام نمایشی را وارد کنید..."
                className="flex-1 bg-colorThemeDark-primary rounded-xl px-3 py-2 border border-colorThemeLite-green focus:outline-none focus:ring-2 focus:ring-colorThemeLite-green"
              />
            </div>
          </div>
        </div>
        {/* لیست کاربران */}
        <div className="flax flex-col">
          {isPending ? (
            Array.from({ length: 5 }).map((_, i) => <UserSkeleton key={i} />)
          ) : isError ? (
            <div className="text-red-500">
              خطا در دریافت اطلاعات: {error?.message || "خطای ناشناخته"}
            </div>
          ) : users && users.length > 0 ? ( // ✅ بهبود جزئی: چک کردن وجود users قبل از length
            users.map((user) => (
              // ✅ کامنت: لینک را فعال کردیم و مسیر آن را به صفحه جزئیات کاربر در پنل ادمین اصلاح کردیم.
              <Link
                key={user.id}
                href={`/admin/users/${user.id}`}
                className="w-full"
              >
                <div className="border border-colorThemeLite-green rounded-2xl p-4 flex gap-4 my-2 items-center hover:scale-[102%] hover:bg-colorThemeLite-green/20 transition-transform cursor-pointer">
                  <img
                    src={user.picture_url || "/img/p-user/person.png"}
                    alt={user.display_name || "User Avatar"}
                    className="w-16 h-16 rounded-2xl object-cover border border-colorThemeLite-green/60"
                  />
                  <div className="flex justify-between items-center flex-1 text-left">
                    <span className="font-bold text-lg">
                      {user.display_name}
                    </span>
                    <span className="text-lg font-bold text-colorThemeLite-accent">
                      امتیاز: {user.total_points}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center text-gray-400 mt-8">
              هیچ کاربری یافت نشد.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopPerformers;
