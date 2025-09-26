// lib/axios.js

import axios from "axios";
import { getCookie } from "@/utils/utils"; // تابع getCookie شما

console.log(
  `AXIOS_INSTANCE: Initializing with API URL: ${process.env.NEXT_PUBLIC_API_BASE_URL}`
);

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  // این گزینه معادل credentials: 'include' است و برای همه درخواست‌ها کوکی‌ها را ارسال می‌کند
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let getAccessToken;
export const setGetAccessToken = (fn) => {
  getAccessToken = fn;
};

// یک فلگ برای جلوگیری از تلاش‌های مکرر برای رفرش توکن
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- رهگیر درخواست (Request Interceptor) ---
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken?.();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- رهگیر پاسخ (Response Interceptor) ---
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // اگر خطا 401 بود و مربوط به رفرش توکن نبود و قبلا تلاش نشده بود
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // اگر در حال رفرش هستیم، درخواست فعلی را در صف قرار می‌دهیم
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = "Bearer " + token;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log(
          "AXIOS_401: Access Token expired. Attempting to refresh..."
        );
        const csrfToken = getCookie("ADMIN_CSRF");

        if (!csrfToken) {
          console.error("Refresh failed: ADMIN_CSRF cookie not found.");
          window.dispatchEvent(new CustomEvent("logout"));
          return Promise.reject(error);
        }

        const { data } = await apiClient.post(
          "/api/admin/refresh",
          {},
          {
            headers: { "X-ADMIN-CSRF": csrfToken },
          }
        );

        console.log("AXIOS_REFRESH_SUCCESS: Token refreshed successfully.");

        // رویداد برای آپدیت توکن در کانتکست
        const event = new CustomEvent("tokenRefreshed", { detail: data });
        window.dispatchEvent(event);

        // آپدیت هدرها برای درخواست مجدد
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.access_token}`;
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${data.access_token}`;

        processQueue(null, data.access_token);
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("AXIOS_REFRESH_FAILED:", refreshError);
        processQueue(refreshError, null);
        window.dispatchEvent(new CustomEvent("logout")); // اگر رفرش هم شکست خورد، خروج
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
