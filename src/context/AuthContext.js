// context/AuthContext.js

"use client";
import { createContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import apiClient, { setGetAccessToken } from "../lib/axios";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // تابع برای تنظیم توکن در state و هدرهای پیش‌فرض axios
  const setToken = useCallback((token) => {
    setAccessToken(token);
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, []);

  // تابع دریافت اطلاعات کاربر
  const fetchUser = useCallback(async () => {
    try {
      const { data } = await apiClient.get("/api/admin/me");
      setUser(data);
    } catch (error) {
      console.error("Failed to fetch user.", error);
      // اگر اینجا خطا بگیریم، یعنی توکن نامعتبر است و باید خارج شویم
      logout();
    }
  }, []); // وابستگی logout حذف شد تا از حلقه بی‌نهایت جلوگیری شود

  // تابع لاگین دقیقاً طبق داکیومنت
  const login = async ({ username, password }) => {
    try {
      const response = await apiClient.post("/api/admin/login", {
        username,
        password,
      });

      const { access_token } = response.data;
      setToken(access_token); // توکن را در مموری (state) ذخیره می‌کنیم

      await fetchUser();
      router.push("/dashboard");
      toast.success("خوش آمدید!");
    } catch (error) {
      console.error("LOGIN_FAILED:", error.response?.data);
      toast.error(
        error.response?.data?.message || "نام کاربری یا رمز عبور اشتباه است."
      );
    }
  };

  // تابع لاگ‌اوت
  const logout = useCallback(() => {
    console.log("LOGGING_OUT...");
    setUser(null);
    setAccessToken(null);
    delete apiClient.defaults.headers.common["Authorization"];

    // درخواست به سرور برای پاک کردن کوکی‌ها (این بخش اختیاری است ولی توصیه می‌شود)
    apiClient
      .post("/api/admin/logout")
      .catch((err) => console.error("Logout API call failed", err));

    router.push("/login");
  }, [router]);

  // لاگین خودکار با استفاده از رفرش توکن در اولین بارگذاری
  useEffect(() => {
    const tryAutoLogin = async () => {
      // چون کوکی RT از نوع HttpOnly است، ما فقط وجود کوکی CSRF را چک می‌کنیم
      // که نشان‌دهنده یک جلسه قبلی است.
      const csrfCookie = document.cookie.includes("ADMIN_CSRF=");
      if (!csrfCookie) {
        setLoading(false);
        return;
      }

      // رهگیر axios بقیه کارها را انجام می‌دهد.
      // ما فقط یک درخواست محافظت‌شده ارسال می‌کنیم تا ببینیم لاگین هستیم یا نه.
      try {
        await fetchUser();
      } catch (err) {
        // اگر fetchUser شکست بخورد، رهگیر axios تلاش به رفرش می‌کند
        // اگر رفرش هم شکست بخورد، کاربر logout می‌شود
        console.log("Auto-login failed.");
      } finally {
        setLoading(false);
      }
    };

    tryAutoLogin();
  }, [fetchUser]);

  // این useEffect برای همگام‌سازی توکن با رهگیر axios است
  useEffect(() => {
    setGetAccessToken(() => accessToken);
  }, [accessToken]);

  // این useEffect برای مدیریت رویدادهای سراسری است
  useEffect(() => {
    const handleLogout = () => logout();
    const handleTokenRefreshed = (event) => {
      console.log("Context: Handling tokenRefreshed event.");
      setToken(event.detail.access_token);
    };

    window.addEventListener("logout", handleLogout);
    window.addEventListener("tokenRefreshed", handleTokenRefreshed);

    return () => {
      window.removeEventListener("logout", handleLogout);
      window.removeEventListener("tokenRefreshed", handleTokenRefreshed);
    };
  }, [logout, setToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
