"use client";
import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import TikIcon from "@/components/icons/tik";
import BackIcon from "@/components/icons/back";
import RulesIcon from "@/components/icons/rulesIcon";
// ✨ هر دو تابع create و update را وارد می‌کنیم
import { getRules, updateRule, createRule } from "@/lib/rulesService"

function Rules() {
  // === استیت‌ها ===
  const [title, setTitle] = useState(""); // ✨ استیت برای عنوان قانون
  const [content, setContent] = useState("");
  const [ruleId, setRuleId] = useState(null); // اگر null باشد یعنی در حالت "ایجاد" هستیم
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // === دریافت داده‌ها ===
  const fetchRuleContent = useCallback(async () => {
    setIsLoading(true);
    try {
      const rulesList = await getRules();
      if (rulesList && rulesList.length > 0) {
        // اگر قانونی وجود داشت، وارد حالت "ویرایش" می‌شویم
        const firstRule = rulesList[0];
        setTitle(firstRule.title);
        setContent(firstRule.content);
        setRuleId(firstRule.id);
      } else {
        // ✨ اگر قانونی وجود نداشت، فرم را برای "ایجاد" آماده می‌کنیم
        setTitle(""); // عنوان خالی برای قانون جدید
        setContent(""); // محتوای خالی
        setRuleId(null); // اطمینان از اینکه در حالت ایجاد هستیم
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
    // ولیدیشن ساده
    if (!title.trim() || !content.trim()) {
      toast.error("لطفاً عنوان و محتوای قانون را وارد کنید.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (ruleId) {
        // ✨ حالت ویرایش: اگر ruleId وجود دارد، update می‌کنیم
        await updateRule(ruleId, { title, content });
      } else {
        // ✨ حالت ایجاد: اگر ruleId وجود ندارد، create می‌کنیم
        await createRule({ title, content });
        // ✨ نکته مهم: پس از ایجاد موفق، داده‌ها را مجدد فراخوانی می‌کنیم
        // تا کامپوننت ID قانون جدید را دریافت کند و به حالت ویرایش برود.
        await fetchRuleContent();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-dark min-h-screen flex flex-col p-6 pt-0">
      <header className="flex items-center gap-x-3 border-b border-colorThemeLite-green pb-4 mb-6">
        <RulesIcon className="text-green-400 w-7 h-7" />
        <h1 className="text-2xl font-bold text-colorThemeLite-accent">
          {/* عنوان صفحه بر اساس حالت تغییر می‌کند */}
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
              {/* ✨ فیلد ورودی برای عنوان */}
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

              {/* ✨ فیلد ورودی برای محتوا */}
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
