"use client";
import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import Delete from "@/components/icons/delete";
import Edit from "@/components/icons/edite";

// وارد کردن سرویس‌های API که ساختیم
import { getFaqs, createFaq, updateFaq, deleteFaq } from "@/lib/API/faqService";

function FAQAdmin() {
  // === استیت‌ها ===
  // استیت اصلی برای نگهداری لیست سوالات
  const [faqs, setFaqs] = useState([]);
  // استیت برای مدیریت فرم افزودن/ویرایش
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editId, setEditId] = useState(null); // اگر در حال ویرایش باشیم، ID اینجا ذخیره می‌شود
  const [showForm, setShowForm] = useState(false);
  // استیت‌های مدیریتی برای بارگذاری و خطا
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // برای غیرفعال کردن دکمه‌ها حین عملیات
  const [isActive, setIsActive] = useState(true);

  // === دریافت داده‌ها ===
  // این تابع مسئول دریافت داده‌ها از سرور است
  const fetchFaqs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getFaqs();
      setFaqs(data);
    } catch (error) {
      toast.error("خطا در دریافت لیست سوالات.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // با استفاده از useEffect، داده‌ها را فقط یک بار پس از رندر اولیه کامپوننت دریافت می‌کنیم
  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  // === توابع مدیریتی (Handlers) ===

  // تابع ذخیره تغییرات (هم برای ایجاد و هم ویرایش)
  const handleSave = async () => {
    // ... ولیدیشن
    setIsSubmitting(true);

    // ✨ آبجکت داده‌ها برای ارسال به سرور
    const payload = {
      question: newQuestion,
      answer: newAnswer,
      is_active: isActive,
    };

    try {
      if (editId) {
        await updateFaq(editId, payload); // ارسال داده‌های کامل
        toast.success("سوال با موفقیت ویرایش شد.");
      } else {
        await createFaq(payload); // ارسال داده‌های کامل
        toast.success("سوال جدید با موفقیت ثبت شد.");
      }
      resetForm();
      await fetchFaqs();
    } catch (error) {
      // ...
    } finally {
      setIsSubmitting(false);
    }
  };

  // تابع حذف یک سوال
  const handleDelete = async (id) => {
    // نکته مهم: بهتر است قبل از حذف، از کاربر تاییدیه بگیریم
    if (window.confirm("آیا از حذف این سوال مطمئن هستید؟")) {
      try {
        await deleteFaq(id);
        toast.success("سوال با موفقیت حذف شد.");
        // به جای دریافت مجدد کل لیست، آیتم حذف شده را به صورت محلی از استیت حذف می‌کنیم (بهینه‌تر است)
        setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq.id !== id));
      } catch (error) {
        toast.error("خطا در حذف سوال.");
      }
    }
  };

  // تابع آماده‌سازی فرم برای ویرایش
  const handleEdit = (faq) => {
    setEditId(faq.id);
    setNewQuestion(faq.question);
    setNewAnswer(faq.answer);
    setIsActive(faq.is_active); // ✨ تنظیم وضعیت چک‌باکس بر اساس داده فعلی
    setShowForm(true);
  };

  // تابع آماده‌سازی فرم برای افزودن سوال جدید
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  // تابع برای ریست کردن فرم
  const resetForm = () => {
    setEditId(null);
    setNewQuestion("");
    setNewAnswer("");
    setIsActive(true); // ✨ ریست کردن چک‌باکس به حالت پیش‌فرض (فعال)
    setShowForm(false);
  };

  // === نمایش کامپوننت ===
  if (isLoading) {
    return <div className="text-center p-10">در حال بارگذاری...</div>;
  }

  return (
    <div className="bg-dark text-white flex flex-col items-center py-4">
      <div className="w-full max-w-3xl rounded-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">
          مدیریت سوالات متداول
        </h1>

        {/* فرم افزودن/ویرایش */}
        {showForm && (
          <div className="space-y-3 pb-2">
            <input
              type="text"
              placeholder="سوال..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full rounded-xl px-4 py-2 bg-dark border border-colorThemeLite-green focus:outline-none focus:ring-2 focus:ring-colorThemeLite-green"
              disabled={isSubmitting}
            />
            <textarea
              placeholder="پاسخ..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="w-full rounded-xl px-4 py-2 bg-dark border border-colorThemeLite-green focus:outline-none focus:ring-2 focus:ring-colorThemeLite-green"
              rows={3}
              disabled={isSubmitting}
            />
            <div className="flex items-center gap-x-2">
              <input
                type="checkbox"
                id="is_active_checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded"
                disabled={isSubmitting}
              />
              <label htmlFor="is_active_checkbox" className="text-sm">
                فعال (نمایش در سایت عمومی)
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 rounded-xl bg-green-500 text-dark px-4 py-2 font-bold hover:bg-green-600 transition disabled:bg-gray-400"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "در حال ذخیره..."
                  : editId
                  ? "ذخیره ویرایش"
                  : "ثبت سوال"}
              </button>
              <button
                onClick={resetForm}
                className="flex-1 rounded-xl bg-gray-500 text-white px-4 py-2 font-bold hover:bg-gray-600 transition"
                disabled={isSubmitting}
              >
                لغو
              </button>
            </div>
          </div>
        )}

        {/* لیست سوالات */}
        <div className="space-y-4 mb-6">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="border border-colorThemeLite-green rounded-2xl p-4 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center"
            >
              <div className="text-right flex-1">
                <p className="font-bold">{faq.question}</p>
                <p className="text-sm text-colorThemeLite-accent mt-1">
                  {faq.answer}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(faq)}
                  className="p-2 rounded-lg hover:bg-colorThemeDark-secondary transition"
                >
                  <Edit />
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="p-2 rounded-lg hover:bg-colorThemeDark-secondary transition"
                >
                  <Delete />
                </button>
              </div>
            </div>
          ))}
          {faqs.length === 0 && !isLoading && (
            <p className="text-center text-colorThemeLite-accent">
              هیچ سوالی یافت نشد.
            </p>
          )}
        </div>

        {/* دکمه افزودن سوال */}
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="w-full rounded-xl bg-green-500 text-dark px-4 py-2 font-bold hover:bg-green-600 transition"
          >
            افزودن سوال جدید
          </button>
        )}
      </div>
    </div>
  );
}

export default FAQAdmin;
