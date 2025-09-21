// فایل: app/admin/users/[id]/page.js (نسخه بهبود یافته)
"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import BackIcon from "@/components/icons/back";
import UserDetailSkeleton from "@/components/Template/users/UserDetailSkeleton";

// تابع API (بدون تغییر)
const fetchUserById = async (userId) => {
  const { data } = await apiClient.get(`/api/admin/user/${userId}`);
  return data;
};

// --- کامپوننت‌های بهینه شده ---

/**
 * ✅ کامپوننت هدر پروفایل برای خوانایی بهتر
 * @param {object} user - آبجکت اطلاعات کاربر
 */
const UserProfileHeader = ({ user }) => (
  <div className="flex flex-col items-center text-center mb-8">
    <img
      src={user.picture_url || "/img/p-user/person.png"}
      alt={user.name}
      // کامنت: سایز آواتار برای موبایل و دسکتاپ ریسپانسیو شده است
      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-colorThemeLite-green mb-4 shadow-lg"
    />
    {/* کامنت: با break-words از سرریز شدن نام‌های طولانی جلوگیری می‌شود */}
    <h1 className="text-2xl sm:text-3xl font-bold text-white break-words">
      {user.name}
    </h1>
    <p className="text-gray-400">@{user.username}</p>
  </div>
);

/**
 * ✅ کامپوننت InfoRow با قابلیت ریسپانسیو و مدیریت متون طولانی
 */
const InfoRow = ({ label, value, isVerified }) => (
  // کامنت: در سایز کوچک، آیتم‌ها زیر هم قرار می‌گیرند (flex-col) و در سایز بزرگتر کنار هم (sm:flex-row)
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-gray-700/50 gap-1 sm:gap-4">
    <span className="text-gray-400 text-sm whitespace-nowrap">{label}:</span>
    {/* کامنت: min-w-0 یک ترفند کلیدی در flexbox است که به truncate اجازه می‌دهد به درستی کار کند */}
    <div className="flex items-center gap-2 min-w-0">
      {/* کامنت: کلاس truncate متن‌های طولانی را با سه نقطه (...) کوتاه می‌کند */}
      <span
        className="font-semibold text-sm text-white truncate"
        title={value || ""}
      >
        {value || "ثبت نشده"}
      </span>
      {isVerified !== undefined && (
        <span
          className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
            isVerified
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {isVerified ? "تأیید شده" : "تأیید نشده"}
        </span>
      )}
    </div>
  </div>
);

// --- کامپوننت اصلی صفحه ---

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id;
  const { accessToken } = useAuth();

  const {
    data: user,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserById(userId),
    enabled: !!userId && !!accessToken,
  });

  if (isLoading) {
    return <UserDetailSkeleton />;
  }

  if (isError) {
    return (
      <div className="text-center mt-20 text-red-500">
        خطا در دریافت اطلاعات: {error.message}
      </div>
    );
  }

  // کامنت: ساخت آرایه‌ای از اطلاعات کاربر برای رندر کردن داینامیک و تمیزتر
  const userInfoRows = [
    { label: "شناسه کاربری", value: user.id },
    { label: "ایمیل", value: user.email, isVerified: user.is_email_verified },
    {
      label: "شماره تلفن",
      value: user.phone,
      isVerified: user.is_phone_verified,
    },
    { label: "ادمین", value: user.is_admin ? "بله" : "خیر" },
    {
      label: "تاریخ عضویت",
      value: new Date(user.created_at).toLocaleString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
  ];

  return (
    // کامنت: با py-10 فاصله عمودی مناسب در همه سایزها ایجاد می‌شود
    <div className="min-h-screen flex flex-col items-center bg-colorThemeDark-primary py-10 px-4">
      <div className="w-full max-w-2xl">
        <Link
          href="/dashboard"
          // کامنت: بهبود استایل دکمه بازگشت با transition
          className="inline-flex items-center gap-2 text-colorThemeLite-accent hover:text-red-500 mb-6 transition-colors duration-200"
        >
          <BackIcon />
          <span>بازگشت به لیست </span>
        </Link>

        {/* کامنت: پدینگ ریسپانسیو برای کارت اصلی */}
        <div className="bg-dark rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-800">
          <UserProfileHeader user={user} />

          <div className="space-y-2">
            {/* کامنت: رندر کردن اطلاعات با استفاده از map برای خوانایی و توسعه‌پذیری بهتر */}
            {userInfoRows.map((row) => (
              <InfoRow key={row.label} {...row} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
