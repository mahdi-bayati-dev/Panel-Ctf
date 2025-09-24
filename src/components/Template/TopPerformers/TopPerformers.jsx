"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import useDebounce from "@/hooks/CustomDebounceHook";
import useAuth from "@/hooks/useAuth";

// آیکون‌ها
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

// تابع نهایی و صحیح برای دریافت اطلاعات کاربران
const fetchUsersTopPerformers = async ({ pageParam = 1, queryKey }) => {
  const [_, searchTerm] = queryKey;
  const PER_PAGE = 15; // تعداد آیتم در هر صفحه
  const params = new URLSearchParams({
    page: String(pageParam),
    per_page: String(PER_PAGE),
  });

  if (searchTerm) {
    params.append("q", searchTerm);
  }

  try {
    // با استفاده از destructuring، مستقیماً به پراپرتی data از پاسخ axios دسترسی پیدا می‌کنیم
    const { data } = await apiClient.get(
      `api/admin/check_test_leader?${params.toString()}`
    );

    // یک بررسی نهایی برای اطمینان از اینکه پاسخ همیشه یک آرایه است
    // این کار جلوی کرش در حالت‌هایی که API نتیجه‌ای ندارد را می‌گیرد
    if (Array.isArray(data)) {
      return data;
    }
    return []; // اگر پاسخ آرایه نبود، یک آرایه خالی برمی‌گردانیم
  } catch (error) {
    console.error("خطا در دریافت اطلاعات کاربران:", error);
    // در صورت بروز هرگونه خطا در شبکه، یک آرایه خالی برمی‌گردانیم تا برنامه کرش نکند
    return [];
  }
};

function TopPerformers() {
  const { accessToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["users", debouncedSearchTerm],
    queryFn: fetchUsersTopPerformers,

    // منطق صفحه‌بندی بر اساس شماره صفحه صحیح است و باقی می‌ماند
    getNextPageParam: (lastPage, allPages) => {
      const PER_PAGE = 15;
      // اگر صفحه آخر آیتمی نداشت یا تعدادش کمتر از حد انتظار بود، یعنی صفحه بعدی وجود ندارد
      if (!lastPage || lastPage.length < PER_PAGE) {
        return undefined;
      }
      // شماره صفحه بعدی = تعداد کل صفحات دریافت شده + 1
      return allPages.length + 1;
    },
    initialPageParam: 1, // شروع از صفحه 1
    enabled: !!accessToken, // کوئری تنها در صورت وجود توکن فعال می‌شود
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
              Array.from({ length: 5 }).map((_, i) => <UserSkeleton key={i} />)
            ) : status === "error" ? (
              <div className="text-red-500">
                خطا در دریافت اطلاعات: {error.message}
              </div>
            ) : (
              <>
                {data.pages.map((page, i) => (
                  <React.Fragment key={`page-${i}`}>
                    {/* حالا این کد به درستی کار می‌کند چون fetchUsersTopPerformers همیشه یک آرایه برمی‌گرداند */}
                    {page.map((user) => (
                      <Link
                        key={user.id}
                        href={`/user/${user.id}`}
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

export default TopPerformers;
