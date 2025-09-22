// src/services/rulesService.js

// کامنت فارسی: این فایل برای مدیریت درخواست‌های API مربوط به قوانین سایت است.

import apiClient from "@/lib/axios";
import toast from "react-hot-toast";

/**
 * دریافت لیست تمام قوانین از سرور
 * @returns {Promise<Array>} لیستی از آبجکت‌های قوانین
 */
export const getRules = async () => {
  try {
    const response = await apiClient.get("/api/admin/content");
    return response.data;
  } catch (error) {
    toast.error("خطا در دریافت قوانین سایت.");
    console.error("خطا در دریافت قوانین:", error);
    throw error;
  }
};

/**
 * ویرایش یک قانون موجود
 * @param {number} id - شناسه قانونی که باید ویرایش شود
 * @param {object} ruleData - داده‌های به‌روز شده شامل { title, content }
 * @returns {Promise<object>} آبجکت قانون ویرایش شده
 */
export const updateRule = async (id, ruleData) => {
  try {
    const response = await apiClient.put(`/api/admin/content/${id}`, ruleData);
    toast.success("قوانین با موفقیت به‌روزرسانی شد!");
    return response.data;
  } catch (error) {
    toast.error("خطا در به‌روزرسانی قوانین.");
    console.error(`خطا در ویرایش قانون با شناسه ${id}:`, error);
    throw error;
  }
};