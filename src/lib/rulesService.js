// src/services/rulesService.js
import apiClient from "@/lib/axios";
import toast from "react-hot-toast";

/**
 * دریافت لیست تمام قوانین از سرور
 */
export const getRules = async () => {
  try {
    // ✨ تغییر: آدرس به /api/contents تغییر کرد (مطابق با آپدیت بک‌اند)
    const response = await apiClient.get("/api/contents");
    console.log(response);
    console.log(response.data);
    return response.data;
  } catch (error) {
    toast.error("خطا در دریافت قوانین سایت.");
    console.error("خطا در دریافت قوانین:", error);
    throw error;
  }
};

/**
 * ✨ تابع جدید: ایجاد یک قانون جدید
 * @param {object} ruleData - داده‌های قانون جدید شامل { title, content }
 */
export const createRule = async (ruleData) => {
  try {
    // ✨ تغییر: پیشوند /admin حذف شد
    const response = await apiClient.post("/api/content", ruleData);
    console.log(response);
    console.log(response.data);

    toast.success("قانون جدید با موفقیت ایجاد شد!");
    return response.data;
  } catch (error) {
    toast.error("خطا در ایجاد قانون جدید.");
    console.error("خطا در ایجاد قانون:", error);
    throw error;
  }
};

/**
 * ویرایش یک قانون موجود
 * @param {number} id - شناسه قانونی که باید ویرایش شود
 * @param {object} ruleData - داده‌های به‌روز شده
 */
export const updateRule = async (id, ruleData) => {
  try {
    // ✨ تغییر: پیشوند /admin حذف شد
    const response = await apiClient.put(`/api/content/${id}`, ruleData);
    console.log(response);
    console.log(response.data);

    // نکته: این toast در کامپوننت هم وجود دارد، شاید بهتر باشد یکی از آن‌ها را نگه داری
    toast.success("قوانین با موفقیت به‌روزرسانی شد!");
    return response.data;
  } catch (error) {
    toast.error("خطا در به‌روزرسانی قوانین.");
    console.error(`خطا در ویرایش قانون با شناسه ${id}:`, error);
    throw error;
  }
};
