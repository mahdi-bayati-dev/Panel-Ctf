"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

// کامپوننت لودینگ (بدون تغییر)
const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col justify-center items-center bg-colorThemeDark-primary text-colorThemeLite-accent">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-colorThemeLite-accent mb-4"></div>
    <p className="text-lg font-semibold">
      در حال بررسی وضعیت ورود، لطفاً صبر کنید...
    </p>
  </div>
);

// کامپوننت نگهبان (Guard) برای محافظت از مسیرها
const AuthGuard = ({ children }) => {
  // ✅ جدید: این شرط گارد را در حالت توسعه به طور کامل غیرفعال می‌کند
  // با این کار می‌توانید بدون نیاز به لاگین، روی صفحات محافظت‌شده کار کنید.
  if (process.env.NODE_ENV === "development") {
    return <>{children}</>;
  }

  // --- بقیه منطق گارد فقط در حالت Production اجرا خواهد شد ---

  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log("AUTH_GUARD: User not authenticated. Redirecting to /login.");
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return null;
};

export default AuthGuard;
