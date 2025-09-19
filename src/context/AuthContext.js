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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const setToken = useCallback((tokenData) => {
    const token = tokenData?.access_token || null;
    setAccessToken(token);
    console.log(
      `AUTH_CONTEXT: Access token has been ${token ? "SET" : "CLEARED"}.`
    );
  }, []);

  // نسخه بهینه fetchUser که به رهگیر axios اجازه کار می‌دهد
  const fetchUser = async () => {
    console.log("AUTH_CONTEXT: Fetching user data...");
    try {
      const { data } = await apiClient.get("/api/admin/me");
      setUser(data);
      console.log(
        "AUTH_CONTEXT_FETCH_SUCCESS: User data fetched and set.",
        data
      );
      return data;
    } catch (error) {
      console.error(
        "AUTH_CONTEXT_FETCH_FAILED: Could not fetch user data.",
        error
      );
      // خطا را دوباره پرتاب می‌کنیم تا رهگیر axios آن را مدیریت کند
      throw error;
    }
  };

  const login = async ({ username, password }) => {
    console.log("AUTH_CONTEXT_LOGIN: Attempting login for user:", username);
    try {
      const response = await apiClient.post("/api/admin/login", {
        username,
        password,
      });
      console.log("AUTH_CONTEXT_LOGIN_SUCCESS: Login API call successful.");

      const tokenData = response.data;
      setToken(tokenData);

      if (tokenData.access_token) {
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${tokenData.access_token}`;
      }

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
    console.log("AUTH_CONTEXT_LOGOUT: Logging out user...");
    // پاک کردن توکن از هدرهای پیش‌فرض axios در زمان خروج
    delete apiClient.defaults.headers.common["Authorization"];
    try {
      await apiClient.post("/api/admin/logout", {});
      console.log("AUTH_CONTEXT_LOGOUT: Logout API call successful.");
    } catch (error) {
      console.error(
        "AUTH_CONTEXT_LOGOUT_API_FAILED: Logout API failed, but logging out from client anyway.",
        error
      );
    } finally {
      setUser(null);
      setAccessToken(null);
      router.push("/login");
      console.log(
        "AUTH_CONTEXT_LOGOUT: Client-side state cleared and redirected to login."
      );
    }
  }, [router]);

  // useEffect برای بازیابی جلسه در زمان رفرش صفحه
  useEffect(() => {
    const tryAutoLogin = async () => {
      console.log(
        "AUTH_CONTEXT_AUTOLOGIN: Trying to auto-login on component mount..."
      );
      try {
        const csrfCookie = getCookie("ADMIN_CSRF");
        if (csrfCookie) {
          console.log(
            "AUTH_CONTEXT_AUTOLOGIN: ADMIN_CSRF cookie found. Attempting refresh."
          );

          const { data: tokenData } = await apiClient.post(
            "/api/admin/refresh",
            {},
            { headers: { "X-ADMIN-CSRF": csrfCookie } }
          );

          console.log(
            "AUTH_CONTEXT_AUTOLOGIN_SUCCESS: Auto-login refresh successful."
          );

          // توکن را در state قرار می‌دهیم
          setToken(tokenData);

          // *** راه‌حل کلیدی برای مشکل رفرش ***
          // توکن را مستقیماً روی هدرهای پیش‌فرض axios ست می‌کنیم
          // تا درخواست بعدی (fetchUser) بلافاصله از آن استفاده کند.
          if (tokenData.access_token) {
            apiClient.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${tokenData.access_token}`;
          }

          // حالا fetchUser را صدا می‌زنیم که از هدر جدید استفاده خواهد کرد
          await fetchUser();
        } else {
          console.log(
            "AUTH_CONTEXT_AUTOLOGIN: No ADMIN_CSRF cookie found. Skipping auto-login."
          );
        }
      } catch (error) {
        console.warn(
          "AUTH_CONTEXT_AUTOLOGIN_FAILED: Auto-login failed.",
          error.response?.data
        );
      } finally {
        setLoading(false);
        console.log(
          "AUTH_CONTEXT_AUTOLOGIN: Finished. Loading state is now false."
        );
      }
    };
    tryAutoLogin();
  }, [setToken]);

  // useEffect برای اتصال توکن به رهگیر
  useEffect(() => {
    setGetAccessToken(() => accessToken);
  }, [accessToken]);

  // useEffect برای مدیریت رویدادهای سفارشی
  useEffect(() => {
    const handleTokenRefreshed = (event) => {
      console.log("AUTH_CONTEXT_EVENT: 'tokenRefreshed' event received.");
      setToken(event.detail);
    };
    const handleLogout = () => {
      console.log("AUTH_CONTEXT_EVENT: 'logout' event received.");
      logout();
    };
    window.addEventListener("tokenRefreshed", handleTokenRefreshed);
    window.addEventListener("logout", handleLogout);
    return () => {
      window.removeEventListener("tokenRefreshed", handleTokenRefreshed);
      window.removeEventListener("logout", handleLogout);
    };
  }, [setToken, logout]);

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
