// فایل: lib/api/leaderboardApi.js

import apiClient from "./axios";

/**
 * @description لیست کاربران برتر (لیدربرد) را با قابلیت جستجو دریافت می‌کند
 * @param {object} context - آبجکت context از React Query
 * @param {Array} context.queryKey - کلید کوئری که شامل عبارت جستجو است ['topPerformers', searchTerm]
 * @returns {Promise<Array>} لیستی از آبجکت‌های کاربران
 */
export const fetchTopPerformers = async ({ queryKey }) => {
  // کامنت: عبارت جستجو را از queryKey استخراج می‌کنیم
  const [_, searchTerm] = queryKey;
  const params = new URLSearchParams();

  if (searchTerm) {
    params.append("q", searchTerm);
  }

  const endpoint = `/api/admin/check_test_leader?${params.toString()}`;

  try {
    const { data } = await apiClient.get(endpoint);
    // کامنت: این یک گارد امنیتی عالی است که مطمئن شویم همیشه یک آرایه برمی‌گردد
    return Array.isArray(data) ? data : [];
  } catch (error) {
    // کامنت: لاگ کردن خطا برای دیباگ راحت‌تر در سمت کلاینت
    console.error("Error fetching top performers:", error.response || error.message);
    // کامنت: پرتاب مجدد خطا تا React Query بتواند آن را مدیریت کند
    throw error;
  }
};