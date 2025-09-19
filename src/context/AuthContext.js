"use client";

import { createContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import apiClient, { setGetAccessToken } from "../lib/axios";
import toast from "react-hot-toast";
import { getCookie } from "@/utils/utils";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  // مقدار اولیه loading را true می‌گذاریم تا AuthGuard منتظر بماند
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const setToken = useCallback((tokenData) => {
    const token = tokenData?.access_token || null;
    setAccessToken(token);
    // برای جلوگیری از باگ‌های زمان‌بندی، توکن را مستقیماً روی هدرهای پیش‌فرض axios هم ست می‌کنیم
    if (token) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common["Authorization"];
    }
  }, []);

  const fetchUser = useCallback(async () => {
    console.log("AUTH_CONTEXT: Fetching user data...");
    try {
      const { data } = await apiClient.get("/api/admin/me");
      setUser(data);
      console.log("AUTH_CONTEXT_FETCH_SUCCESS: User data fetched.", data);
      return data;
    } catch (error) {
      console.error("AUTH_CONTEXT_FETCH_FAILED.", error);
      // خطا را دوباره پرتاب می‌کنیم تا رهگیر axios آن را مدیریت کرده و در صورت نیاز توکن را رفرش کند
      throw error;
    }
  }, []);

  const login = async ({ username, password }) => {
    console.log("AUTH_CONTEXT_LOGIN: Attempting login...");
    try {
      const response = await apiClient.post("/api/admin/login", {
        username,
        password,
      });
      console.log("AUTH_CONTEXT_LOGIN_SUCCESS.");

      const tokenData = response.data;
      setToken(tokenData); // این تابع هم state را آپدیت می‌کند و هم هدر axios را

      await fetchUser();

      router.push("/dashboard");
      toast.success("خوش آمدید!");
    } catch (error) {
      console.error(
        "AUTH_CONTEXT_LOGIN_FAILED:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || "نام کاربری یا رمز عبور اشتباه است."
      );
    }
  };

  const logout = useCallback(async () => {
    console.log("AUTH_CONTEXT_LOGOUT: Logging out...");
    // ابتدا state را پاک می‌کنیم تا UI بلافاصله واکنش نشان دهد
    setUser(null);
    setAccessToken(null);
    delete apiClient.defaults.headers.common["Authorization"];

    try {
      await apiClient.post("/api/admin/logout", {});
      console.log("AUTH_CONTEXT_LOGOUT: API call successful.");
    } catch (error) {
      console.error("AUTH_CONTEXT_LOGOUT_API_FAILED:", error);
    } finally {
      router.push("/login");
      console.log(
        "AUTH_CONTEXT_LOGOUT: Client-side state cleared and redirected."
      );
    }
  }, [router]);

  // useEffect برای بازیابی جلسه در زمان رفرش صفحه
  useEffect(() => {
    const tryAutoLogin = async () => {
      console.log("AUTH_CONTEXT_AUTOLOGIN: Trying to auto-login...");
      const csrfCookie = getCookie("ADMIN_CSRF");

      if (!csrfCookie) {
        console.log("AUTH_CONTEXT_AUTOLOGIN: No CSRF cookie. Skipping.");
        setLoading(false); // <-- مهم: اگر کوکی نبود، لودینگ را تمام کن
        return;
      }

      try {
        console.log(
          "AUTH_CONTEXT_AUTOLOGIN: CSRF cookie found. Refreshing token..."
        );

        const { data: tokenData } = await apiClient.post(
          "/api/admin/refresh",
          {},
          { headers: { "X-ADMIN-CSRF": csrfCookie } }
        );

        console.log("AUTH_CONTEXT_AUTOLOGIN_SUCCESS: Token refreshed.");

        // توکن جدید را هم در state و هم روی هدرهای axios ست می‌کنیم
        setToken(tokenData);

        // حالا با توکن جدید، اطلاعات کاربر را می‌گیریم
        await fetchUser();
      } catch (error) {
        console.warn("AUTH_CONTEXT_AUTOLOGIN_FAILED:", error.response?.data);
        // اگر رفرش شکست خورد، فقط state را پاک می‌کنیم
        setUser(null);
        setAccessToken(null);
      } finally {
        // loading فقط در انتهای تمام عملیات (چه موفق چه ناموفق) false می‌شود
        console.log(
          "AUTH_CONTEXT_AUTOLOGIN: Finished. Loading state is now false."
        );
        setLoading(false);
      }
    };
    tryAutoLogin();
  }, [setToken, fetchUser]);

  // این useEffect فقط برای اتصال state به رهگیر axios است و منطق اصلی در رهگیر قرار دارد
  useEffect(() => {
    setGetAccessToken(() => accessToken);
  }, [accessToken]);

  // این useEffect رویداد سفارشی logout که از رهگیر axios می‌آید را مدیریت می‌کند
  useEffect(() => {
    const handleLogout = () => {
      console.log("AUTH_CONTEXT_EVENT: 'logout' event received.");
      logout();
    };
    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, [logout]);

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
