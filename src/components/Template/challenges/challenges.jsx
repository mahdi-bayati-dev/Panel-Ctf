// فایل: app/dashboard/challenges/page.js
"use client";
import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import Delete from "@/components/icons/delete";
import Edit from "@/components/icons/edite";

// ۱. توابع API را از ماژول جدید ایمپورت می‌کنیم
import {
  listChallenges,
  createChallenge,
  updateChallenge,
  deleteChallenge,
} from "@/lib/API/challengesApi"; // مسیر فایل را چک کنید

const LoadingSpinner = () => (
  <div className="text-center p-10">
    <p>در حال بارگذاری اطلاعات...</p>
  </div>
);

const initialFormState = {
  title: "",
  description: "",
  category: "web",
  points: 100,
  hint: "",
  is_active: false,
};

function ChallengesAdmin() {
  // ۲. State ها دوباره به داخل کامپوننت بازگشته‌اند
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State های مربوط به UI
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  // ۳. تابع دریافت داده‌ها که تابع listChallenges را از ماژول API فراخوانی می‌کند
  const fetchChallenges = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await listChallenges(); // فراخوانی تابع API
      setChallenges(data); // به‌روزرسانی state داخلی کامپوننت
    } catch (error) {
      console.error("Failed to fetch challenges:", error);
      toast.error("خطا در دریافت لیست چالش‌ها.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  // --- مدیریت فرم ---
  // این تابع با تغییر هر فیلد متنی، state مربوط به فرم را آپدیت می‌کند
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // تابع مجزا برای چک‌باکس
  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setFormData((prev) => ({ ...prev, is_active: checked }));
  };

  // تابع برای ریست کردن فرم و بستن آن
  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setShowForm(false);
  };

  // --- عملیات CRUD ---

  // تابع اصلی برای ذخیره (ایجاد یا ویرایش)
  const handleSave = async () => {
    // اعتبارسنجی ساده
    if (!formData.title || !formData.description || !formData.points) {
      toast.error("لطفاً فیلدهای عنوان، توضیحات و امتیاز را پر کنید.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        // ۴. فراخوانی تابع ویرایش از ماژول API
        const updatedData = await updateChallenge(editingId, formData);
        // آپدیت دستی state کامپوننت با داده‌ی برگشتی
        setChallenges((prev) =>
          prev.map((c) => (c.id === editingId ? updatedData : c))
        );
        toast.success("چالش با موفقیت ویرایش شد!");
      } else {
        // ۵. فراخوانی تابع ایجاد از ماژول API
        const newData = await createChallenge(formData);
        // افزودن آیتم جدید به state کامپوننت
        setChallenges((prev) => [newData, ...prev]);
        toast.success("چالش جدید با موفقیت ثبت شد!");
      }
      resetForm();
    } catch (error) {
      // چون توابع API خطا را throw نمی‌کنند (مگر اینکه بخواهیم)، toast خطا در اینجا هم مفید است
      toast.error(error.response?.data?.message || "عملیات با خطا مواجه شد.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // تابع برای آماده‌سازی فرم جهت ویرایش
  const handleEdit = (challenge) => {
    // تنظیم ID برای حالت ویرایش
    setEditingId(challenge.id);
    // پر کردن فرم با داده‌های چالش انتخاب شده
    setFormData({
      title: challenge.title,
      description: challenge.description,
      category: challenge.category,
      points: challenge.points,
      hint: challenge.hint || "", // اگر hint وجود نداشت، رشته خالی بگذار
      is_active: !!challenge.is_active, // تبدیل 0 و 1 به boolean
    });
    // نمایش فرم
    setShowForm(true);
  };

  // تابع برای حذف یک چالش
  const handleDelete = async (id) => {
    if (!window.confirm("آیا از حذف این چالش اطمینان دارید؟")) return;

    try {
      // ۶. فراخوانی تابع حذف از ماژول API
      await deleteChallenge(id);
      // حذف آیتم از state کامپوننت
      setChallenges((prev) => prev.filter((c) => c.id !== id));
      toast.success("چالش با موفقیت حذف شد.");
    } catch (error) {
      toast.error("خطا در حذف چالش.");
    }
  };

  // اگر در حال بارگذاری اولیه بود، اسپینر را نمایش بده
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-dark text-white flex flex-col items-center py-4">
      <div className="w-full max-w-4xl rounded-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">مدیریت چالش‌ها</h1>

        {/* دکمه افزودن که فرم را باز می‌کند */}
        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="w-full rounded-xl bg-green-500 text-dark px-4 py-2 font-bold hover:bg-green-600 transition mb-6"
          >
            افزودن چالش جدید
          </button>
        )}

        {/* فرم افزودن/ویرایش */}
        {showForm && (
          <div className="space-y-4 p-4 mb-6 border border-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold">
              {editingId ? "ویرایش چالش" : "ایجاد چالش جدید"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* فیلد عنوان */}
              <input
                type="text"
                name="title"
                placeholder="عنوان چالش"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full rounded-xl px-4 py-2 bg-dark border border-colorThemeLite-green focus:outline-none focus:ring-2 focus:ring-colorThemeLite-green"
              />
              {/* فیلد امتیاز */}
              <input
                type="number"
                name="points"
                placeholder="امتیاز"
                value={formData.points}
                onChange={handleInputChange}
                className="w-full rounded-xl px-4 py-2 bg-dark border border-colorThemeLite-green focus:outline-none focus:ring-2 focus:ring-colorThemeLite-green"
              />
            </div>
            {/* فیلد توضیحات */}
            <textarea
              name="description"
              placeholder="توضیحات..."
              value={formData.description}
              onChange={handleInputChange}
              className="w-full rounded-xl px-4 py-2 bg-dark border border-colorThemeLite-green focus:outline-none focus:ring-2 focus:ring-colorThemeLite-green"
              rows={4}
            />
            {/* فیلد راهنمایی */}
            <textarea
              name="hint"
              placeholder="راهنمایی (اختیاری)"
              value={formData.hint}
              onChange={handleInputChange}
              className="w-full rounded-xl px-4 py-2 bg-dark border border-colorThemeLite-green focus:outline-none focus:ring-2 focus:ring-colorThemeLite-green"
              rows={2}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* فیلد دسته‌بندی */}
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full rounded-xl px-4 py-2 bg-dark border border-colorThemeLite-green focus:outline-none focus:ring-2 focus:ring-colorThemeLite-green"
              >
                <option value="web">Web</option>
                <option value="network">Network</option>
              </select>
              {/* چک‌باکس فعال‌سازی */}
              <div className="flex items-center gap-x-2">
                <input
                  type="checkbox"
                  id="is_active_checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="is_active_checkbox" className="text-sm">
                  فعال (نمایش در سایت عمومی)
                </label>
              </div>
            </div>

            {/* دکمه‌های ذخیره و لغو */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                className="flex-1 rounded-xl bg-green-500 text-dark px-4 py-2 font-bold hover:bg-green-600 transition disabled:bg-gray-500 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "در حال ذخیره..."
                  : editingId
                  ? "ذخیره ویرایش"
                  : "ثبت چالش"}
              </button>
              <button
                onClick={resetForm}
                className="flex-1 rounded-xl bg-gray-600 text-white px-4 py-2 font-bold hover:bg-gray-700 transition"
                disabled={isSubmitting}
              >
                لغو
              </button>
            </div>
          </div>
        )}

        {/* لیست چالش‌ها */}
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="border border-colorThemeLite-green rounded-2xl p-4 flex flex-col sm:flex-row justify-between gap-4 items-start"
            >
              <div className="text-right flex-1">
                <p className="font-bold text-lg">{challenge.title}</p>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {challenge.description}
                </p>
                <div className="flex items-center gap-x-4 mt-2 text-xs">
                  <span>امتیاز: {challenge.points}</span>
                  <span>دسته‌بندی: {challenge.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-x-4 w-full sm:w-auto justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(challenge)}
                    className="p-2 rounded-lg hover:bg-gray-700 transition"
                  >
                    <Edit />
                  </button>
                  <button
                    onClick={() => handleDelete(challenge.id)}
                    className="p-2 rounded-lg hover:bg-red-800/50 transition"
                  >
                    <Delete />
                  </button>
                </div>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    challenge.is_active
                      ? "bg-green-500 text-dark"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  {challenge.is_active ? "فعال" : "غیرفعال"}
                </span>
              </div>
            </div>
          ))}
          {challenges.length === 0 && !isLoading && (
            <p className="text-center text-gray-500">هیچ چالشی یافت نشد.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChallengesAdmin;
