"use client";
import React, { useState } from "react";

// آیکون‌ها
import TelIcon from "@/components/icons/telIcon"; // آیکون تلفن جایگزین شد
import PassIcon from "@/components/icons/passIcon";
import Loading from "@/components/icons/Loading";
import EyeIcon from "@/components/icons/EyeIcon";
import EyeOffIcon from "@/components/icons/EyeOffIcon";
import LoginIcon from "@/components/icons/loginIcon";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const errors = false;
  const mutation = false;

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gradient2-start via-gradient2-mid to-gradient2-end p-6 md:p-12">
      <div className=" max-w-[600px] w-full bg-colorThemeDark-secondary rounded-2xl shadow-lg overflow-hidden">
        {/* فرم */}
        <div className="md:col-span-8 flex flex-col justify-center p-10 md:px-16">
          <h2 className="text-xl font-bold text-white mb-6 text-center">
            ورود
          </h2>
          <form className="space-y-4">
            {/* شماره تماس */}
            <div>
              <label
                htmlFor="phone"
                className="flex items-center gap-2 text-gray-300 mb-1 mr-4"
              >
                <TelIcon className="w-5 h-5 text-gradient2-mid" />
                شماره تماس
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                placeholder="شماره تماس"
                className={`w-full px-4 py-2 rounded-2xl bg-colorThemeDark-primary text-gray-100 border ${
                  errors.phone ? "border-red-500" : "border-colorThemeLite-blue"
                } focus:outline-none focus:ring-2 focus:ring-gradient2-mid`}
              />
              {/* <p className="text-red-500 text-sm mt-1 min-h-[20px] px-2">
                {errors.phone?.message}
              </p> */}
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
                  className={`w-full px-4 py-2 rounded-2xl bg-colorThemeDark-primary text-gray-100 border ${
                    errors.password
                      ? "border-red-500"
                      : "border-colorThemeLite-blue"
                  } focus:outline-none focus:ring-2 focus:ring-gradient2-mid`}
                />
                <button
                  type="button"
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
              {/* <p className="text-red-500 text-sm mt-1 min-h-[20px] px-2">
                {errors.password?.message}
              </p> */}
            </div>

            {/* دکمه‌ها */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center pt-4">
              <button
                type="submit"
                // disabled={mutation.isPending}
                className={`flex items-center justify-center gap-2 bg-colorThemeDark-primary text-white border border-[#11A9D6] font-semibold w-full sm:w-auto px-6 sm:px-14 py-3 rounded-2xl hover:bg-colorThemeLite-blue transition-all duration-300 text-base sm:text-lg shadow-md hover:shadow-lg ${
                  mutation.isPending ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {mutation.isPending ? <Loading /> : <LoginIcon />}
                ورود
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;
