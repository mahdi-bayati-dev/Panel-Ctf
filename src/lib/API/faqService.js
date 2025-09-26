// src/services/faqService.js

// کامنت فارسی: این فایل مسئول تمام درخواست‌های مربوط به سوالات متداول (FAQ) به سرور است.
// با جدا کردن این منطق، کامپوننت‌های ما تمیزتر می‌مانند و فقط مسئول نمایش اطلاعات هستند.

import apiClient from "@/lib/axios"; // وارد کردن نمونه axios که قبلاً ساخته‌ایم

/**
 * دریافت لیست تمام سوالات متداول از سرور
 * @returns {Promise<Array>} لیستی از آبجکت‌های سوالات
 */
export const getFaqs = async () => {
  try {
    const response = await apiClient.get("/api/admin/faqs");
    // ما فقط به داده‌های پاسخ نیاز داریم
    return response.data;
  } catch (error) {
    console.error("خطا در دریافت سوالات متداول:", error);
    // پرتاب مجدد خطا تا در کامپوننت بتوانیم آن را مدیریت کنیم
    throw error;
  }
};

/**
 * ایجاد یک سوال متداول جدید
 * @param {object} faqData - داده‌های سوال جدید شامل { question, answer }
 * @returns {Promise<object>} آبجکت سوال ایجاد شده
 */
export const createFaq = async (faqData) => {
  try {
    const response = await apiClient.post("/api/admin/faqs", faqData);
    return response.data;
  } catch (error) {
    console.error("خطا در ایجاد سوال:", error);
    throw error;
  }
};

/**
 * ویرایش یک سوال متداول موجود
 * @param {number} id - شناسه سوالی که باید ویرایش شود
 * @param {object} faqData - داده‌های به‌روز شده
 * @returns {Promise<object>} آبجکت سوال ویرایش شده
 */
export const updateFaq = async (id, faqData) => {
  try {
    const response = await apiClient.put(`/api/admin/faqs/${id}`, faqData);
    return response.data;
  } catch (error) {
    console.error(`خطا در ویرایش سوال با شناسه ${id}:`, error);
    throw error;
  }
};

/**
 * حذف یک سوال متداول
 * @param {number} id - شناسه سوالی که باید حذف شود
 */
export const deleteFaq = async (id) => {
  try {
    // طبق مستندات، در صورت موفقیت کد 204 برمی‌گردد و بدنه پاسخ خالی است
    await apiClient.delete(`/api/admin/faqs/${id}`);
  } catch (error) {
    console.error(`خطا در حذف سوال با شناسه ${id}:`, error);
    throw error;
  }
};