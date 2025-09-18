"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuth from "@/hooks/useAuth";
import { loginSchema } from "@/lib/validation/loginSchema";

// آیکون‌ها
import UserIconRejecter from "@/components/icons/userIconRejecter"; // آیکون کاربر جایگزین TelIcon شد
import PassIcon from "@/components/icons/passIcon";
import Loading from "@/components/icons/Loading";
import EyeIcon from "@/components/icons/EyeIcon";
import EyeOffIcon from "@/components/icons/EyeOffIcon";
import LoginIcon from "@/components/icons/loginIcon";

function LoginForm() {
  // --- مدیریت State ---
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth(); // دریافت تابع login از کانتکست

  // --- راه‌اندازی React Hook Form ---
  const {
    register, // برای اتصال input ها به فرم
    handleSubmit, // برای مدیریت ارسال فرم
    formState: { errors, isSubmitting }, // برای دسترسی به خطاها و وضعیت ارسال
  } = useForm({
    resolver: zodResolver(loginSchema), // اتصال Zod برای اعتبارسنجی
  });

  // --- تابع ارسال فرم ---
  // این تابع فقط زمانی اجرا می‌شود که فرم معتبر باشد
  const onSubmit = async (data) => {
    // data حاوی مقادیر فرم است: { username: "...", password: "..." }
    console.log(
      "LOGIN_FORM: Form submitted with valid data. Calling login function...",
      data
    );
    await login(data);
  };

  return (
    // از handleSubmit برای wrap کردن تابع onSubmit خودمان استفاده می‌کنیم
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* نام کاربری */}
      <div>
        <label
          htmlFor="username"
          className="flex items-center gap-2 text-gray-300 mb-1 mr-4"
        >
          <UserIconRejecter />
          نام کاربری
        </label>
        <input
          id="username"
          type="text"
          placeholder="نام کاربری خود را وارد کنید"
          // با استفاده از register، این input به react-hook-form متصل می‌شود
          {...register("username")}
          className={`w-full px-4 py-2 rounded-2xl bg-colorThemeDark-primary text-gray-100 border ${
            // اگر خطایی برای این فیلد وجود داشت، بوردر قرمز می‌شود
            errors.username ? "border-red-500" : "border-colorThemeLite-blue"
          } focus:outline-none focus:ring-2 focus:ring-gradient2-mid`}
        />
        {/* نمایش پیام خطا در صورت وجود */}
        <p className="text-red-500 text-sm mt-1 min-h-[20px] px-2">
          {errors.username?.message}
        </p>
      </div>

      {/* رمز عبور */}
      <div>
        <label
          htmlFor="password"
          className="flex items-center gap-2 text-gray-300 mb-1 mr-4"
        >
          <PassIcon className="w-5 h-5 text-gradient2-mid" />
          رمز عبور
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="رمز عبور"
            // اتصال اینپوت رمز عبور
            {...register("password")}
            className={`w-full px-4 py-2 rounded-2xl bg-colorThemeDark-primary text-gray-100 border ${
              errors.password ? "border-red-500" : "border-colorThemeLite-blue"
            } focus:outline-none focus:ring-2 focus:ring-gradient2-mid`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)} // منطق نمایش/مخفی کردن رمز
            aria-label={showPassword ? "مخفی کردن رمز" : "نمایش رمز"}
            className="absolute left-3 top-2 text-gray-400 hover:text-white p-1 rounded"
          >
            {showPassword ? (
              <EyeOffIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-red-500 text-sm mt-1 min-h-[20px] px-2">
          {errors.password?.message}
        </p>
      </div>

      {/* دکمه‌ها */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center pt-4">
        <button
          type="submit"
          // دکمه در زمان ارسال درخواست، غیرفعال می‌شود
          disabled={isSubmitting}
          className={`flex items-center justify-center gap-2 bg-colorThemeDark-primary text-white border border-[#11A9D6] font-semibold w-full sm:w-auto px-6 sm:px-14 py-3 rounded-2xl hover:bg-colorThemeLite-blue transition-all duration-300 text-base sm:text-lg shadow-md hover:shadow-lg ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {/* نمایش آیکون لودینگ در زمان ارسال */}
          {isSubmitting ? <Loading /> : <LoginIcon />}
          ورود
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
