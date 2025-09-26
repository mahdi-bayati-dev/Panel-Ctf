// فایل: lib/api/usersApi.js

import apiClient from "@/lib/API/axios";

/**
 * @description لیست کاربران را برای پنل ادمین با قابلیت جستجو و صفحه‌بندی (cursor) دریافت می‌کند
 * @param {object} context - آبجکت context از React Query
 * @param {string | null} context.pageParam - کرسر برای صفحه بعدی
 * @param {Array} context.queryKey - کلید کوئری که شامل عبارت جستجو است ['users', searchTerm]
 */
export const fetchUsers = async ({ pageParam = null, queryKey }) => {
  // کامنت: عبارت جستجو را از queryKey استخراج می‌کنیم
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