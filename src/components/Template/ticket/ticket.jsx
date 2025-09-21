// کامپوننت: /components/Template/ticket/ticket.js (نسخه ادمین - اصلاح شده)
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { listAdminTickets } from "@/lib/adminTicketsApi";
import { TicketSkeleton } from "@/components/ui/TicketSkeleton";

// کامپوننت برای نمایش پیام خطا
const ErrorMessage = ({ message }) => (
  <div className="text-center text-red-400 p-8 bg-red-900/20 rounded-lg">
    <p>خطا در دریافت اطلاعات: {message}</p>
  </div>
);

// ✅ جدید: یک آبجکت برای مدیریت استایل و ترجمه اولویت‌ها
// این کار باعث تمیزتر شدن کد JSX می‌شود.
const priorityStyles = {
  low: { text: "کم", className: "bg-gray-700 text-gray-300" },
  normal: { text: "معمولی", className: "bg-blue-800 text-blue-300" },
  high: { text: "زیاد", className: "bg-red-800 text-red-300" },
};

export default function AdminTicketsList() {
  const [statusFilter, setStatusFilter] = useState("open");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "tickets", statusFilter],
    queryFn: () => listAdminTickets({ status: statusFilter, per_page: 20 }),
  });

  const tickets = data?.data || [];

  return (
    <div className="p-4 bg-dark text-white border-t border-green-700 ">
      {/* تب‌های فیلتر وضعیت (بدون تغییر) */}
      <div className="flex items-center gap-2 mb-4 border-b border-green-800 pb-2">
        {/* ... دکمه‌های فیلتر ... */}
        <button
          onClick={() => setStatusFilter("open")}
          className={`px-4 py-2 text-sm rounded-full transition ${
            statusFilter === "open"
              ? "bg-green-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          باز
        </button>
        <button
          onClick={() => setStatusFilter("closed")}
          className={`px-4 py-2 text-sm rounded-full transition ${
            statusFilter === "closed"
              ? "bg-green-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          بسته
        </button>
      </div>

      {/* 🔄 تغییر: هدر جدول به ۶ ستون تغییر کرد */}
      <div className="hidden md:grid grid-cols-6 text-center font-medium text-green-400 border-b border-green-700 pb-2">
        <span>موضوع</span>
        <span>کاربر</span>
        <span>دپارتمان</span>
        <span>اولویت</span> {/* ✅ جدید: هدر ستون اولویت */}
        <span>آخرین بروزرسانی</span>
        <span>وضعیت</span>
      </div>

      {isLoading && <TicketSkeleton />}
      {isError && <ErrorMessage message={error.message} />}

      {!isLoading && !isError && (
        <div className="mt-4 space-y-4">
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/tickets/${ticket.id}`} // ✅ اطمینان از مسیر صحیح ادمین
                className="block"
              >
                {/* 🔄 تغییر: ردیف جدول به ۶ ستون تغییر کرد */}
                <div className="grid grid-cols-2 md:grid-cols-6 items-center gap-4 rounded-2xl border border-green-800 px-4 py-4 bg-dark shadow-sm hover:bg-green-200/10 text-center text-sm">
                  <span className="flex items-center justify-center gap-2">
                    {ticket.unread > 0 && (
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                    {ticket.subject}
                  </span>
                  <span className="text-gray-300">
                    {ticket.user.display_name}
                  </span>
                  <span className="text-gray-300">{ticket.department}</span>

                  {/* ✅ جدید: نمایش اولویت با استایل مخصوص */}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      priorityStyles[ticket.priority]?.className ||
                      priorityStyles.normal.className
                    }`}
                  >
                    {priorityStyles[ticket.priority]?.text || ticket.priority}
                  </span>

                  <span className="text-gray-400 text-xs">
                    {new Date(ticket.last_message_at).toLocaleString("fa-IR")}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      ticket.status === "open"
                        ? "bg-green-800 text-green-300"
                        : ""
                    } ${
                      ticket.status === "pending"
                        ? "bg-yellow-800 text-yellow-300"
                        : ""
                    } ${
                      ticket.status === "closed"
                        ? "bg-red-800 text-red-300"
                        : ""
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center text-gray-400 p-8">
              هیچ تیکتی با وضعیت «{statusFilter === "open" ? "باز" : "بسته"}»
              یافت نشد.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
