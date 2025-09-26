"use client";
import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import TikIcon from "@/components/icons/tik";
import BackIcon from "@/components/icons/back";
import RulesIcon from "@/components/icons/rulesIcon";
import { getRules, updateRule, createRule } from "@/lib/API/rulesService";

function Rules() {
  // === استیت‌ها (بدون تغییر) ===
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [ruleId, setRuleId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // === دریافت داده‌ها (بدون تغییر) ===
  const fetchRuleContent = useCallback(async () => {
    setIsLoading(true);
    try {
      const rulesList = await getRules();
      if (rulesList && rulesList.length > 0) {
        const firstRule = rulesList[0];
        setTitle(firstRule.title);
        setContent(firstRule.content);
        setRuleId(firstRule.id);
      } else {
        setTitle("");
        setContent("");
        setRuleId(null);
      }
    } catch (error) {
      setContent("خطا در بارگذاری قوانین.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRuleContent();
  }, [fetchRuleContent]);

  // === تابع هوشمند ذخیره (ایجاد یا ویرایش) ===
  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("لطفاً عنوان و محتوای قانون را وارد کنید.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (ruleId) {
        // --- شروع تغییرات در حالت ویرایش ---

        // ۱. قانون را آپدیت می‌کنیم و منتظر پاسخ سرور (آبجکت آپدیت‌شده) می‌مانیم.
        const updatedRule = await updateRule(ruleId, { title, content });

        // ۲. state را با اطلاعات جدید و آپدیت‌شده از سرور، به‌روز می‌کنیم.
        // این کار به جای فراخوانی مجدد fetchRuleContent انجام می‌شود.
        if (updatedRule && updatedRule.id) {
          setTitle(updatedRule.title);
          setContent(updatedRule.content);
        }
        // toast.success("قوانین با موفقیت به‌روزرسانی شد!");

        // --- پایان تغییرات ---
      } else {
        // حالت ایجاد که قبلا درست کردیم و عالی کار می‌کنه
        const newRule = await createRule({ title, content });
        if (newRule && newRule.id) {
          setTitle(newRule.title);
          setContent(newRule.content);
          setRuleId(newRule.id);
        }
      }
    } catch (error) {
      console.error("خطا در عملیات ذخیره‌سازی:", error);
      // از سمت سرویس یک toast خطا نمایش داده می‌شود، اینجا نیازی به تکرار نیست.
      // فقط در صورتی که بخواهیم پیام عمومی‌تری بدهیم:
      // toast.error("عملیات ذخیره‌سازی ناموفق بود.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // === بخش JSX و نمایش (بدون تغییر) ===
  return (
    <div className="bg-dark min-h-screen flex flex-col p-6 pt-0">
      <header className="flex items-center gap-x-3 border-b border-colorThemeLite-green pb-4 mb-6">
        <RulesIcon className="text-green-400 w-7 h-7" />
        <h1 className="text-2xl font-bold text-colorThemeLite-accent">
          {ruleId ? "ویرایش قوانین" : "ایجاد قانون جدید"}
        </h1>
      </header>
      <p className="my-4">
        {ruleId
          ? "در اینجا میتوانید قوانین وب سایت را ویرایش کنید:"
          : "یک قانون جدید برای سایت تعریف کنید:"}
      </p>

      <main className="flex justify-center items-start flex-1">
        <div className="w-full max-w-3xl border border-green-500/40 rounded-2xl p-6 shadow-lg shadow-green-500/10 bg-dark/70 backdrop-blur">
          {isLoading ? (
            <p className="text-center">در حال بارگذاری...</p>
          ) : (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="rules_title"
                  className="block mb-2 text-sm font-medium text-gray-400"
                >
                  عنوان قانون
                </label>
                <input
                  type="text"
                  id="rules_title"
                  className="w-full bg-dark/50 border border-colorThemeLite-green rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label
                  htmlFor="rules_content"
                  className="block mb-2 text-sm font-medium text-gray-400"
                >
                  محتوای قانون
                </label>
                <textarea
                  id="rules_content"
                  className="w-full h-72 bg-dark/50 border border-colorThemeLite-green rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          <div className="flex justify-center items-center gap-x-4 mt-6">
            <button
              onClick={handleSave}
              className="flex items-center gap-x-2 bg-green-500 hover:bg-green-600 text-dark font-semibold py-2 px-6 rounded-lg transition-all duration-300 border border-colorThemeLite-green disabled:bg-gray-400"
              disabled={isLoading || isSubmitting}
            >
              <TikIcon className="w-5 h-5" />
              <span>{isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Rules;
