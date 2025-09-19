"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

// کامپوننت برای نمایش یک صفحه لودینگ زیبا
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
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // این افکت فقط زمانی اجرا می‌شود که فرآیند لودینگ اولیه تمام شده باشد
    if (!loading && !isAuthenticated) {
      console.log("AUTH_GUARD: User not authenticated. Redirecting to /login.");
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // --- منطق نمایش ---

  // ۱. تا زمانی که در حال بررسی هستیم، همیشه صفحه لودینگ را نشان بده
  if (loading) {
    return <LoadingScreen />;
  }

  // ۲. اگر لودینگ تمام شده و کاربر احراز هویت شده، محتوای صفحه را نشان بده
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // ۳. اگر لودینگ تمام شده و کاربر احراز هویت نشده، چیزی نشان نده (null)
  // تا از نمایش لحظه‌ای محتوای محافظت شده قبل از ریدایرکت جلوگیری شود.
  // `useEffect` بالا کار ریدایرکت را انجام خواهد داد.
  return null;
};

export default AuthGuard;
