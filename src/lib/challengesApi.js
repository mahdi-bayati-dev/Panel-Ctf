// فایل: lib/challengesApi.js
import apiClient from "./axios"; // مسیر فایل axios خود را تنظیم کنید

// این فایل شامل تمام توابع برای ارتباط با اندپوینت‌های چالش‌ها در پنل ادمین است.


/**
 * @description لیست تمام چالش‌ها را برای پنل ادمین دریافت می‌کند.
 * @returns {Promise<Array>} آرایه‌ای از آبجکت‌های چالش.
 */
export async function listChallenges() {
  // به سادگی درخواست GET را ارسال کرده و داده‌ها را برمی‌گردانیم.
  const { data } = await apiClient.get("/api/admin/challenges");
  return data;
}

/**
 * @description یک چالش جدید در سیستم ایجاد می‌کند.
 * @param {object} challengeData - داده‌های چالش جدید شامل title, description, category و...
 * @returns {Promise<object>} آبجکت کامل چالش ایجاد شده.
 */
export async function createChallenge(challengeData) {
  const { data } = await apiClient.post("/api/admin/challenges", challengeData);
  return data;
}

/**
 * @description اطلاعات یک چالش موجود را به‌روزرسانی می‌کند.
 * @param {number | string} id - شناسه چالشی که باید ویرایش شود.
 * @param {object} challengeData - داده‌های جدید برای جایگزینی.
 * @returns {Promise<object>} آبجکت کامل و به‌روز شده‌ی چالش.
 */
export async function updateChallenge(id, challengeData) {
  const { data } = await apiClient.put(
    `/api/admin/challenges/${id}`,
    challengeData
  );
  return data;
}

/**
 * @description یک چالش را از سیستم حذف می‌کند.
 * @param {number | string} id - شناسه چالشی که باید حذف شود.
 * @returns {Promise<void>} در صورت موفقیت، چیزی برنمی‌گرداند.
 */
export async function deleteChallenge(id) {
  // متد DELETE معمولاً پاسخی در بدنه ندارد، پس فقط آن را فراخوانی می‌کنیم.
  await apiClient.delete(`/api/admin/challenges/${id}`);
}
