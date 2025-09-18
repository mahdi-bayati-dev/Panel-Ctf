"use client"; // <-- این خط مهم‌ترین تغییر است

import { createContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation"; // <-- تغییر در import
import apiClient, { setGetAccessToken } from "../lib/axios";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ... (بقیه کد بدون تغییر باقی می‌ماند)

  const setToken = useCallback((tokenData) => {
    if (tokenData && tokenData.access_token) {
      setAccessToken(tokenData.access_token);
    } else {
      setAccessToken(null);
    }
  }, []);

  const login = async ({ username, password }) => {
    try {
      const response = await apiClient.post("/api/admin/login", {
        username,
        password,
      });
      setToken(response.data);
      await fetchUser();
      router.push("/dashboard");
      toast.success("خوش آمدید!");
    } catch (error) {
      console.error("خطا در ورود:", error);
      toast.error("نام کاربری یا رمز عبور اشتباه است.");
    }
  };

  const logout = useCallback(async () => {
    try {
      await apiClient.post(
        "/api/admin/logout",
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
    } catch (error) {
      console.error(
        "خطا در API خروج، اما به هر حال از کلاینت خارج می‌شویم:",
        error
      );
    } finally {
      setUser(null);
      setAccessToken(null);
      router.push("/login");
    }
  }, [accessToken, router]);

  const fetchUser = async () => {
    try {
      const { data } = await apiClient.get("/api/admin/me");
      setUser(data);
    } catch (error) {
      console.error("خطا در دریافت اطلاعات کاربر:", error);
      setUser(null);
      setAccessToken(null);
    }
  };

  useEffect(() => {
    const handleTokenRefreshed = (event) => setToken(event.detail);
    const handleLogout = () => logout();

    window.addEventListener("tokenRefreshed", handleTokenRefreshed);
    window.addEventListener("logout", handleLogout);

    return () => {
      window.removeEventListener("tokenRefreshed", handleTokenRefreshed);
      window.removeEventListener("logout", handleLogout);
    };
  }, [setToken, logout]);

  useEffect(() => {
    setGetAccessToken(() => accessToken);
  }, [accessToken]);

  useEffect(() => {
    const tryAutoLogin = async () => {
      try {
        const csrfToken = getCookie("ADMIN_CSRF");
        // فقط در صورتی تلاش کن که کوکی CSRF وجود داشته باشد
        if (document.cookie.includes("ADMIN_CSRF")) {
          const { data } = await apiClient.post(
            "/api/admin/refresh",
            {},
            {
              headers: { "X-ADMIN-CSRF": csrfToken },
            }
          );
          setToken(data);
          await fetchUser();
        }
      } catch (error) {
        console.log("ورود خودکار ممکن نیست.");
      } finally {
        setLoading(false);
      }
    };
    tryAutoLogin();
  }, [setToken]);

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
