"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import useDebounce from "@/hooks/CustomDebounceHook";
import useAuth from "@/hooks/useAuth";

// آیکون‌ها
import SearchIcon_2 from "@/components/icons/searchIcon-2";

// اسکلت لودینگ
const UserSkeleton = () => (
  <div className="border border-colorThemeLite-green/30 rounded-2xl p-4 flex gap-4 my-2 items-center animate-pulse">
    <div className="w-16 h-16 rounded-2xl bg-gray-700"></div>
    <div className="flex flex-col gap-2">
      <div className="h-4 w-32 bg-gray-700 rounded"></div>
      <div className="h-3 w-24 bg-gray-700 rounded"></div>
    </div>
  </div>
);

// تابع دریافت همه کاربران
const fetchAllUsers = async ({ queryKey }) => {
  const [, searchTerm] = queryKey;
  const params = new URLSearchParams();
  if (searchTerm) params.append("q", searchTerm);
  const endpoint = `api/admin/check_test_leader?${params.toString()}`;
  try {
    const { data } = await apiClient.get(endpoint);
    console.log("fetchAllUsers -> data:", data);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching users:", error?.response || error?.message || error);
    throw error;
  }
};

function TopPerformers() {
  const { accessToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const {
    data: users = [],      // <--- مقدار پیش‌فرض خالی تا هیچ‌وقت undefined نباشد
    error,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["users", debouncedSearchTerm ?? ""], // <--- همیشه یک مقدار پایدار بفرست
    queryFn: fetchAllUsers,
    enabled: !!accessToken,
    keepPreviousData: true,  // <--- از پاک شدن موقت داده جلوگیری می‌کند
    staleTime: 1000 * 60,    // اختیاری: 1 دقیقه به عنوان staleTime
  });

  // برای دیباگ (اختیاری) می‌تونی لاگ کنی:
  console.log("render users:", users, { isLoading, isFetching, isError });

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
            { (isLoading || isFetching) ? (
              Array.from({ length: 5 }).map((_, i) => <UserSkeleton key={i} />)
            ) : isError ? (
              <div className="text-red-500">
                خطا در دریافت اطلاعات: {error?.message || "خطای ناشناخته"}
              </div>
            ) : users.length > 0 ? (
              users.map((user) => (
                <Link
                  key={user.id ?? Math.random()}
                  href={`/user/${user.id}`}
                  prefetch={false} // اختیاری: غیرفعال کردن prefetch ممکنه از رفتار ناخواسته جلوگیری کنه
                  className="w-full"
                >
                  <div className="border border-colorThemeLite-green rounded-2xl p-4 flex gap-4 my-2 items-center hover:scale-[102%] hover:bg-colorThemeLite-green/20 transition-transform cursor-pointer">
                    <img
                      src={user.picture_url || "/img/p-user/person.png"}
                      alt={user.display_name || "User Avatar"}
                      className="w-16 h-16 rounded-2xl object-cover border border-colorThemeLite-green/60"
                    />
                    <div className="flex justify-between items-center flex-1 text-left">
                      <span className="font-bold text-lg">{user.display_name}</span>
                      <span className="text-sm text-colorThemeLite-accent">امتیاز: {user.total_points}</span>
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
    </div>
  );
}

export default TopPerformers;
