// فایل: hooks/useUsers.js

"use client";

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import useDebounce from "./CustomDebounceHook"; // مسیر هوک debounce
import useAuth from "./useAuth"; // مسیر هوک useAuth
import { fetchUsers } from "@/lib/usersApi";

/**
 * @description هوک سفارشی برای مدیریت کامل منطق دریافت، کشینگ و جستجوی لیست کاربران
 * @returns {object} تمام وضعیت‌ها و توابع مورد نیاز برای کامپوننت UI
 */
export const useUsers = () => {
  const { accessToken } = useAuth();

  // کامنت: state برای مدیریت مقدار ورودی جستجو
  const [searchTerm, setSearchTerm] = useState("");

  // کامنت: debounce کردن مقدار جستجو برای جلوگیری از درخواست‌های مکرر
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  // کامنت: استفاده از useInfiniteQuery با تنظیمات بهینه
  const queryResult = useInfiniteQuery({
    // کامنت: کلید کوئری حالا به مقدار debounce شده وابسته است
    queryKey: ["users", debouncedSearchTerm],

    // کامنت: تابع fetcher ما از فایل API جدا شده است
    queryFn: fetchUsers,

    // کامنت: منطق دریافت کرسر صفحه بعد
    getNextPageParam: (lastPage) => lastPage?.next_cursor ?? undefined,

    initialPageParam: null,

    // کامنت: کوئری فقط زمانی فعال است که کاربر لاگین کرده باشد
    enabled: !!accessToken,

    // ✅ نکته بهینه‌سازی: تنظیم staleTime
    // کامنت: داده‌ها به مدت ۲ دقیقه "تازه" در نظر گرفته می‌شوند و درخواست مجدد ارسال نمی‌شود.
    // این کار باعث می‌شود اگر کاربر از صفحه خارج و دوباره وارد شود، اطلاعات از کش خوانده شود و تجربه کاربری بهتری داشته باشد.
    staleTime: 1000 * 60 * 2, // 2 دقیقه
  });

  // کامنت: تمام مقادیر مورد نیاز کامپوننت را به همراه state جستجو برمی‌گردانیم
  return {
    ...queryResult, // شامل data, error, status, fetchNextPage و ...
    searchTerm,
    setSearchTerm,
  };
};