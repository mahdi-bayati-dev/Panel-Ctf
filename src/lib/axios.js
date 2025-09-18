// lib/axios.js or wherever apiClient is defined
import axios from "axios";
import { getCookie } from "@/utils/utils";

// لاگ برای اطمینان از خوانده شدن صحیح آدرس API از متغیرهای محیطی
console.log(
  `AXIOS_INSTANCE: Initializing with API URL: ${process.env.NEXT_PUBLIC_API_BASE_URL}`
);

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
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

// --- رهگیر درخواست (Request Interceptor) ---
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken?.();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    // لاگ کردن هر درخواست قبل از ارسال به سرور
    console.log(`AXIOS_REQUEST: Sending request to: ${config.url}`, {
      headers: config.headers,
      method: config.method,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error("AXIOS_REQUEST_ERROR: Error before sending request:", error);
    return Promise.reject(error);
  }
);

// --- رهگیر پاسخ (Response Interceptor) ---
apiClient.interceptors.response.use(
  (response) => {
    // در صورت موفقیت‌آمیز بودن، فقط پاسخ را برمی‌گردانیم
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // لاگ کردن هر خطایی که از سمت API دریافت می‌شود
    console.error(
      `AXIOS_RESPONSE_ERROR: Received error for request to ${originalRequest.url}`,
      {
        status: error.response?.status,
        data: error.response?.data,
      }
    );

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn(
        "AXIOS_401: Access Token might be expired. Attempting to refresh..."
      );

      try {
        const csrfToken = getCookie("ADMIN_CSRF");
        console.log("AXIOS_REFRESH: Sending token refresh request...");

        const { data } = await apiClient.post(
          "/api/admin/refresh",
          {},
          { headers: { "X-ADMIN-CSRF": csrfToken } }
        );

        console.log("AXIOS_REFRESH_SUCCESS: Token refreshed successfully.");

        // ارسال رویداد برای آپدیت توکن در کانتکست
        const event = new CustomEvent("tokenRefreshed", { detail: data });
        window.dispatchEvent(event);

        // آپدیت هدرها برای درخواست مجدد
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.access_token}`;
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${data.access_token}`;

        console.log(
          "AXIOS_RETRY: Retrying the original request to:",
          originalRequest.url
        );
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("AXIOS_REFRESH_FAILED: Token refresh failed.", {
          status: refreshError.response?.status,
          data: refreshError.response?.data,
        });

        // ارسال رویداد برای خروج کامل کاربر
        console.warn(
          "AXIOS_LOGOUT_EVENT: Dispatching logout event due to refresh failure."
        );
        window.dispatchEvent(new CustomEvent("logout"));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
