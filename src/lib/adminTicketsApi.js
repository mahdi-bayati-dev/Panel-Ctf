// فایل: lib/tickets/adminTicketsApi.js
import apiClient from "./axios";

// کامنت: این فایل شامل تمام توابع برای ارتباط با اندپوینت‌های تیکت در پنل ادمین است.

/**
 * @description لیست تیکت‌ها را برای پنل ادمین دریافت می‌کند
 * @param {object} params - پارامترهای کوئری مثل status, cursor, per_page
 */
export async function listAdminTickets(params) {
  const { data } = await apiClient.get("/api/admin/tickets", { params });
  return data;
}

/**
 * @description جزئیات یک تیکت خاص و پیام‌های آن را برای ادمین دریافت می‌کند
 * @param {number} id - شناسه تیکت
 * @param {object} params - پارامترهای کوئری برای صفحه‌بندی پیام‌ها
 */
export async function getAdminTicket(id, params) {
  const { data } = await apiClient.get(`/api/admin/tickets/${id}`, { params });
  return data;
}

/**
 * @description به عنوان ادمین، یک پیام جدید در تیکت ارسال می‌کند
 * @param {object} input - شامل id, body, files
 */
export async function replyAdminTicket({ id, body, files }) {
  const fd = new FormData();
  if (body) fd.set("body", body);
  // کامنت: چون ممکن است چندین فایل داشته باشیم، از حلقه استفاده می‌کنیم
  files?.forEach((f) => fd.append("attachments[]", f));

  const { data } = await apiClient.post(`/api/admin/tickets/${id}/messages`, fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

/**
 * @description یک تیکت را از طرف ادمین می‌بندد
 * @param {number} id - شناسه تیکت
 */
export async function closeAdminTicket(id) {
  const { data } = await apiClient.post(`/api/admin/tickets/${id}/close`);
  return data;
}

/**
 * @description یک تیکت بسته شده را دوباره باز می‌کند
 * @param {number} id - شناسه تیکت
 */
export async function reopenAdminTicket(id) {
  const { data } = await apiClient.post(`/api/admin/tickets/${id}/reopen`);
  return data;
}