// کامپوننت: /components/Template/ticket/ticket.js (نسخه ادمین - اصلاح شده)
"use client";
import React from "react"; // ✅ ایمپورت کردن useState
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { listAdminTickets } from "@/lib/tickets/adminTicketsApi"; // ✅ اطمینان از مسیر صحیح
import { TicketSkeleton } from "@/components/ui/TicketSkeleton";

// کامپوننت برای نمایش پیام خطا
const ErrorMessage = ({ message }) => (
  <div className="text-center text-red-400 p-8 bg-red-900/20 rounded-lg">
    <p>خطا در دریافت اطلاعات: {message}</p>
  </div>
);

export default function AdminTicketsList() {
  // ✅ قدم ۱: تعریف state برای فیلتر
  const [statusFilter, setStatusFilter] = useState("open");

  // ✅ قدم ۲: استفاده از state در useQuery
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "tickets", statusFilter], // کلید کوئری باید شامل فیلتر باشد
    queryFn: () => listAdminTickets({ status: statusFilter, per_page: 20 }),
  });

  const tickets = data?.data || [];

  return (
    <div className="p-4 bg-dark text-white border-t border-green-700 ">
      {/* تب‌های فیلتر وضعیت */}
      <div className="flex items-center gap-2 mb-4 border-b border-green-800 pb-2">
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

      {/* هدر جدول */}
      <div className="hidden md:grid grid-cols-5 text-center font-medium text-green-400 border-b border-green-700 pb-2">
        <span>موضوع</span>
        <span>کاربر</span>
        <span>دپارتمان</span>
        <span>آخرین بروزرسانی</span>
        <span>وضعیت</span>
      </div>

      {/* مدیریت حالت لودینگ و خطا */}
      {isLoading && <TicketSkeleton />}
      {isError && <ErrorMessage message={error.message} />}

      {/* لیست تیکت‌ها */}
      {!isLoading && !isError && (
        <div className="mt-4 space-y-4">
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              // ✅ اطمینان از مسیر صحیح لینک برای پنل ادمین
              <Link
                key={ticket.id}
                href={`/admin/tickets/${ticket.id}`}
                className="block"
              >
                <div className="grid grid-cols-2 md:grid-cols-5 items-center gap-4 rounded-2xl border border-green-800 px-4 py-4 bg-dark shadow-sm hover:bg-green-200/10 text-center text-sm">
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
                  <span className="text-gray-400 text-xs">
                    {new Date(ticket.last_message_at).toLocaleString("fa-IR")}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${
                        ticket.status === "open"
                          ? "bg-green-800 text-green-300"
                          : ""
                      }
                      ${
                        ticket.status === "pending"
                          ? "bg-yellow-800 text-yellow-300"
                          : ""
                      }
                      ${
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
            // ✅ قدم ۳: پیام داینامیک بر اساس فیلتر
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
