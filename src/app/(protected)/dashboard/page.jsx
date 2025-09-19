"use client";
import useAuth from "@/hooks/useAuth";
import PanelAdmin from "@/components/Template/PanelAdmin/PanelAdmin"; // کامپوننت UI را وارد می‌کنیم

// این کامپوننت صفحه اصلی داشبورد است
// چون داخل پوشه (protected) قرار دارد، به صورت خودکار محافظت می‌شود
export default function DashboardPage() {
  // اطلاعات کاربر و تابع خروج را از کانتکست می‌گیریم
  const { user, logout } = useAuth();
  console.log(user);

  return (
    <div className="min-h-screen flex flex-col items-center bg-colorThemeDark-primary text-center pt-10 px-4">
      <div className="w-full max-w-5xl mb-8 flex justify-between items-center px-2">
        {/* نمایش پیام خوش‌آمدگویی */}
        <h1 className="text-xl md:text-2xl font-bold text-white">
          خوش آمدی، {user?.username || "ادمین عزیز"}!
        </h1>
        {/* دکمه خروج */}
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
        >
          خروج از حساب ادمین
        </button>
      </div>

      {/* کامپوننت پنل ادمین که شما طراحی کردید در اینجا نمایش داده می‌شود */}
      <PanelAdmin />
    </div>
  );
}
