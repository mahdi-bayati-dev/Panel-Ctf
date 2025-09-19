"use client";

import { createContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import apiClient, { setGetAccessToken } from "../lib/axios"; // مسیر را چک کن
import toast from "react-hot-toast";
import { getCookie } from "@/utils/utils"; // مسیر را چک کن

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

  const fetchUser = async () => {
    console.log("AUTH_CONTEXT: Fetching user data...");
    try {
      const { data } = await apiClient.get("/api/admin/me");
      setUser(data);
      console.log(
        "AUTH_CONTEXT_FETCH_SUCCESS: User data fetched and set.",
        data
      );
    } catch (error) {
      console.error(
        "AUTH_CONTEXT_FETCH_FAILED: Could not fetch user data.",
        error
      );
      setUser(null);
      setAccessToken(null);
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
      setToken(response.data);
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

  // const logout = useCallback(async () => {
  //   console.log("AUTH_CONTEXT_LOGOUT: Logging out user...");
  //   try {
  //     await apiClient.post(
  //       "/api/admin/logout",
  //       {},
  //       {
  //         headers: { Authorization: `Bearer ${accessToken}` },
  //       }
  //     );
  //     console.log("AUTH_CONTEXT_LOGOUT: Logout API call successful.");
  //   } catch (error) {
  //     console.error(
  //       "AUTH_CONTEXT_LOGOUT_API_FAILED: Logout API failed, but logging out from client anyway.",
  //       error
  //     );
  //   } finally {
  //     setUser(null);
  //     setAccessToken(null);
  //     router.push("/login");
  //     console.log(
  //       "AUTH_CONTEXT_LOGOUT: Client-side state cleared and redirected to login."
  //     );
  //   }
  // }, [accessToken, router]);

  useEffect(() => {
    const tryAutoLogin = async () => {
      console.log(
        "AUTH_CONTEXT_AUTOLOGIN: Trying to auto-login on component mount..."
      );
      try {
        if (document.cookie.includes("ADMIN_CSRF")) {
          const csrfToken = getCookie("ADMIN_CSRF");
          console.log(
            "AUTH_CONTEXT_AUTOLOGIN: ADMIN_CSRF cookie found. Attempting refresh."
          );
          const { data } = await apiClient.post(
            "/api/admin/refresh",
            {},
            {
              headers: { "X-ADMIN-CSRF": csrfToken },
            }
          );
          console.log(
            "AUTH_CONTEXT_AUTOLOGIN_SUCCESS: Auto-login refresh successful."
          );
          setToken(data);
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

  useEffect(() => {
    setGetAccessToken(() => accessToken);
  }, [accessToken]);

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
