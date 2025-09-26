"use client";
import React from "react";
import Link from "next/link";
import { useUsers } from "@/hooks/useUsers"; // ✅ وارد کردن هوک سفارشی جدید
import UserSkeleton from "@/components/ui/userSkelton";
// آیکون‌ها
import SearchIcon_2 from "@/components/icons/searchIcon-2";

// ✅ کامپوننت UsersPage بسیار تمیز و متمرکز بر UI شده است
function UsersPage() {
  // کامنت: تمام منطق پیچیده، پشت این یک خط پنهان شده است!
  const {
    data,
    error,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    searchTerm,
    setSearchTerm,
  } = useUsers();

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
              {/* کامنت: ورودی جستجو حالا مقدار و آپدیت خود را از هوک useUsers می‌گیرد */}
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

          {/* لیست کاربران (JSX این بخش دقیقاً مثل قبل است و نیازی به تغییر ندارد) */}
          <div className="flax flex-col">
            {status === "pending" ? (
              Array.from({ length: 5 }).map((_, i) => <UserSkeleton key={i} />)
            ) : status === "error" ? (
              <div className="text-red-500">
                خطا در دریافت اطلاعات: {error.message}
              </div>
            ) : (
              <>
                {data?.pages.map((page, i) => (
                  <React.Fragment key={i}>
                    {(page.data || page).map((user) => (
                      <Link
                        key={user.id}
                        href={`/admin/user/${user.id}`}
                        className="w-full"
                      >
                        <div className="border border-colorThemeLite-green rounded-2xl p-4 flex gap-4 my-2 items-center hover:scale-[102%] hover:bg-colorThemeLite-green/20 transition-transform cursor-pointer">
                          <img
                            src={user.picture_url || "/img/p-user/person.png"}
                            alt={user.name}
                            className="w-16 h-16 rounded-2xl object-cover border border-colorThemeLite-green/60"
                          />

                          {/* این div رو flex-1 کن تا عرض پر بشه */}
                          <div className="flex justify-between items-center flex-1 text-left">
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

            {/* دکمه "بارگذاری بیشتر" (بدون تغییر) */}
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
