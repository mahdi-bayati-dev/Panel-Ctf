"use client";
import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import TikIcon from "@/components/icons/tik";
import BackIcon from "@/components/icons/back";
import RulesIcon from "@/components/icons/rulesIcon";
// وارد کردن سرویس API قوانین
import { getRules, updateRule } from "@/lib/rulesService";

function Rules() {
  // === استیت‌ها ===
  const [content, setContent] = useState("");
  const [ruleId, setRuleId] = useState(null); // ID قانونی که در حال ویرایش است
  const [initialRule, setInitialRule] = useState(null); // برای نگهداری آبجکت کامل قانون
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // === دریافت داده‌ها ===
  const fetchRuleContent = useCallback(async () => {
    setIsLoading(true);
    try {
      const rulesList = await getRules();
      // فرض می‌کنیم که همیشه حداقل یک قانون وجود دارد و ما اولین مورد را ویرایش می‌کنیم
      if (rulesList && rulesList.length > 0) {
        const firstRule = rulesList[0];
        setInitialRule(firstRule);
        setContent(firstRule.content);
        setRuleId(firstRule.id);
      } else {
        // اگر قانونی وجود نداشت، یک پیام مناسب نمایش می‌دهیم
        setContent("هیچ قانونی برای ویرایش یافت نشد. لطفاً از طریق پنل بک‌اند یک قانون ایجاد کنید.");
      }
    } catch (error) {
      // خطا قبلاً در سرویس لاگ شده و toast نمایش داده شده است
      setContent("خطا در بارگذاری قوانین.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRuleContent();
  }, [fetchRuleContent]);

  // === توابع مدیریتی ===
  const handleSave = async () => {
    if (!ruleId || !initialRule) {
      toast.error("هیچ قانونی برای به‌روزرسانی انتخاب نشده است.");
      return;
    }
    setIsSubmitting(true);
    try {
      // برای ویرایش، به title و content نیاز داریم. title را از آبجکت اولیه برمی‌داریم
      await updateRule(ruleId, {
        title: initialRule.title,
        content: content,
      });
      // نیازی به دریافت مجدد داده نیست چون toast موفقیت در سرویس نمایش داده شده است
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // بازگشت به حالت اولیه
  const handleReset = () => {
      if (initialRule) {
          setContent(initialRule.content);
      }
  }

  // === نمایش کامپوننت ===
  return (
    <div className="bg-dark min-h-screen flex flex-col p-6 pt-0">
      <header className="flex items-center gap-x-3 border-b border-colorThemeLite-green pb-4 mb-6">
        <RulesIcon className="text-green-400 w-7 h-7" />
        <h1 className="text-2xl font-bold text-colorThemeLite-accent">
          قوانین
        </h1>
      </header>
      <p className="my-4">در اینجا میتوانید قوانین وب سایت را ویرایش کنید:</p>

      <main className="flex justify-center items-start flex-1">
        <div className="w-full max-w-3xl border border-green-500/40 rounded-2xl p-6 shadow-lg shadow-green-500/10 bg-dark/70 backdrop-blur">
          {isLoading ? (
            <p className="text-center">در حال بارگذاری قوانین...</p>
          ) : (
            <textarea
              id="rules_content"
              aria-label="متن قوانین"
              className="w-full h-72 bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-gray-300 text-justify leading-7"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
            />
          )}

          <div className="flex justify-center items-center gap-x-4 mt-6">
            <button
              onClick={handleSave}
              className="flex items-center gap-x-2 bg-green-500 hover:bg-green-600 text-dark font-semibold py-2 px-6 rounded-lg transition-all duration-300 border border-colorThemeLite-green disabled:bg-gray-400"
              disabled={isLoading || isSubmitting}
            >
              <TikIcon className="w-5 h-5" />
              <span>{isSubmitting ? "در حال ذخیره..." : "تایید"}</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-x-2 bg-gray-600 hover:bg-slate-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 border border-colorThemeLite-green disabled:bg-gray-400"
              disabled={isLoading || isSubmitting}
            >
              <BackIcon className="w-5 h-5" />
              <span>بازگشت به حالت اولیه</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Rules;