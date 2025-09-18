import axios from "axios";
import { getCookie } from "@/utils/utils";

// یک instance از axios با تنظیمات پیش‌فرض ایجاد می‌کنیم
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  // این گزینه باعث می‌شود کوکی‌ها (مثل ADMIN_RT) به صورت خودکار در درخواست‌ها ارسال شوند
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// تابعی برای دریافت توکن از کانتکست (در ادامه ایجاد می‌شود)
// این کار برای جلوگیری از circular dependency (وابستگی دورانی) انجام می‌شود
let getAccessToken;
export const setGetAccessToken = (fn) => {
  getAccessToken = fn;
};

// یک Interceptor برای درخواست‌ها اضافه می‌کنیم
// این تابع قبل از ارسال هر درخواست اجرا می‌شود
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken?.(); // توکن را از state برنامه می‌خوانیم
    if (token) {
      // اگر توکن وجود داشت، آن را به هدر Authorization اضافه می‌کنیم
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// یک Interceptor برای پاسخ‌ها اضافه می‌کنیم
// این تابع پس از دریافت پاسخ از سرور اجرا می‌شود
apiClient.interceptors.response.use(
  (response) => {
    // اگر پاسخ موفقیت‌آمیز بود، آن را برمی‌گردانیم
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // اگر خطای 401 (Unauthorized) رخ داد و این درخواست یک تلاش مجدد نبود
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // درخواست را به عنوان تلاش مجدد علامت‌گذاری می‌کنیم

      try {
        console.log("Access Token منقضی شده. در حال تلاش برای رفرش...");
        const csrfToken = getCookie("ADMIN_CSRF");

        // درخواست رفرش توکن را ارسال می‌کنیم
        const { data } = await apiClient.post(
          "/api/admin/refresh",
          {},
          {
            headers: {
              "X-ADMIN-CSRF": csrfToken,
            },
          }
        );

        // در این نقطه، باید توکن جدید را در state برنامه ذخیره کنیم
        // این کار از طریق یک event یا callback انجام می‌شود که در AuthContext پیاده‌سازی خواهیم کرد
        const event = new CustomEvent("tokenRefreshed", { detail: data });
        window.dispatchEvent(event);

        console.log("توکن با موفقیت رفرش شد.");

        // هدر Authorization را با توکن جدید آپدیت می‌کنیم
        apiClient.defaults.headers.common["Authorization"] =
          "Bearer " + data.access_token;
        originalRequest.headers["Authorization"] =
          "Bearer " + data.access_token;

        // درخواست اصلی که خطا داده بود را دوباره با توکن جدید ارسال می‌کنیم
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("رفرش توکن با خطا مواجه شد.", refreshError);
        // اگر رفرش هم خطا داد، کاربر را از سیستم خارج می‌کنیم
        // این کار هم از طریق یک event انجام می‌شود
        window.dispatchEvent(new CustomEvent("logout"));
        return Promise.reject(refreshError);
      }
    }

    // برای خطاهای دیگر، فقط خطا را برمی‌گردانیم
    return Promise.reject(error);
  }
);

export default apiClient;
