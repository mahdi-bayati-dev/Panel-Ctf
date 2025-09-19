"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios"; // کلاینت axios را وارد می‌کنیم
import useDebounce from "@/hooks/CustomDebounceHook"; // هوک debounce را وارد می‌کنیم
import useAuth from "@/hooks/useAuth"; // برای گرفتن توکن

// آیکون‌ها
import SearchIcon from "@/components/icons/SearchIcon";
import SearchIcon_2 from "@/components/icons/searchIcon-2";

// کامپوننت برای نمایش اسکلت لودینگ
const UserSkeleton = () => (
  <div className="border border-colorThemeLite-green/30 rounded-2xl p-4 flex gap-4 my-2 items-center animate-pulse">
    <div className="w-16 h-16 rounded-2xl bg-gray-700"></div>
    <div className="flex flex-col gap-2">
      <div className="h-4 w-32 bg-gray-700 rounded"></div>
      <div className="h-3 w-24 bg-gray-700 rounded"></div>
    </div>
  </div>
);

// تابع برای فراخوانی API و گرفتن لیست کاربران
// این تابع pageParam را دریافت می‌کند که همان 'cursor' ماست
const fetchUsers = async ({ pageParam = null, queryKey }) => {
  const [_, searchTerm] = queryKey;
  const params = new URLSearchParams({
    per_page: "15", // تعداد آیتم در هر صفحه
  });
  if (pageParam) {
    params.append("cursor", pageParam);
  }
  if (searchTerm) {
    params.append("q", searchTerm);
  }
  const { data } = await apiClient.get(`/api/admin/users?${params.toString()}`);
  return data;
};

function UsersPage() {
  const { accessToken } = useAuth(); // توکن را از کانتکست می‌گیریم
  const [searchTerm, setSearchTerm] = useState("");

  // از هوک useDebounce استفاده می‌کنیم تا جلوی درخواست‌های مکرر را بگیریم
  const debouncedSearchTerm = useDebounce(searchTerm, 400); // 400 میلی‌ثانیه تأخیر

  // استفاده از useInfiniteQuery برای مدیریت داده‌ها، لودینگ، خطا و صفحه‌بندی
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    // queryKey یک آرایه است. وقتی searchTerm تغییر کند، react-query به صورت خودکار داده‌ها را دوباره فراخوانی می‌کند.
    queryKey: ["users", debouncedSearchTerm],
    // queryFn تابعی است که برای گرفتن داده‌ها استفاده می‌شود.
    queryFn: fetchUsers,
    // getNextPageParam مشخص می‌کند که پارامتر صفحه بعدی (cursor) چیست.
    // اگر next_cursor وجود داشت، آن را برای صفحه بعد برمی‌گردانیم، در غیر این صورت undefined برمی‌گردانیم.
    getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    // این گزینه برای جلوگیری از فراخوانی اولیه در زمان مانت شدن کامپوننت است
    initialPageParam: null,
    // فقط در صورتی که توکن وجود داشته باشد، کوئری را فعال می‌کنیم
    enabled: !!accessToken,
  });

  return (
    <div className="min-h-screen flex flex-col items-center text-center mt-2 ">
      <div className="space-y-6 w-full max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mb-20">
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

          {/* لیست کاربران */}
          <div className="flax flex-col">
            {status === "pending" ? (
              // نمایش اسکلت‌های لودینگ در زمان بارگذاری اولیه
              Array.from({ length: 5 }).map((_, i) => <UserSkeleton key={i} />)
            ) : status === "error" ? (
              // نمایش پیام خطا در صورت بروز مشکل
              <div className="text-red-500">
                خطا در دریافت اطلاعات: {error.message}
              </div>
            ) : (
              // نمایش لیست کاربران
              <>
                {data.pages.map((page, i) => (
                  <React.Fragment key={i}>
                    {page.data.map((user) => (
                      <Link
                        key={user.id}
                        href={`/user/${user.id}`}
                        className="w-full"
                      >
                        <div className="border border-colorThemeLite-green rounded-2xl p-4 flex gap-4 my-2 items-center hover:scale-[102%] hover:bg-colorThemeLite-green/20 transition-transform cursor-pointer">
                          <img
                            src={user.picture_url || "/img/p-user/person.png"} // استفاده از آواتار پیش‌فرض
                            alt={user.name}
                            className="w-16 h-16 rounded-2xl object-cover border border-colorThemeLite-green/60"
                          />
                          <div className="flex justify-between items-center text-left">
                            <span className="font-bold text-lg">
                              {user.name}
                            </span>
                            <span className="text-sm text-colorThemeLite-accent">
                              ID: {user.id}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </React.Fragment>
                ))}
              </>
            )}

            {/* دکمه "بارگذاری بیشتر" */}
            <div className="mt-6">
              <button
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
                className="bg-colorThemeLite-green text-dark px-6 py-2 rounded-xl font-bold hover:bg-green-400 transition disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {isFetchingNextPage
                  ? "در حال بارگذاری..."
                  : hasNextPage
                  ? "بارگذاری بیشتر"
                  : "پایان لیست کاربران"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersPage;
