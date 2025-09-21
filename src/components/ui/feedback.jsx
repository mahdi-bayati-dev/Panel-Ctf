// فایل: src/components/ui/feedback.jsx
"use client"; // چون کامپوننت‌های UI هستن

// کامپوننت برای نمایش حالت لودینگ
export const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-500"></div>
  </div>
);

// کامپوننت برای نمایش خطا
export const ErrorMessage = ({ message }) => (
  <div className="text-center text-red-400 p-8 bg-red-900/20 rounded-lg">
    <p>متاسفانه در دریافت اطلاعات خطایی رخ داد.</p>
    <p className="text-xs mt-2 text-gray-500 dir-ltr">{message}</p>
  </div>
);