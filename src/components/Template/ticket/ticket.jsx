// کامپوننت: /components/Template/ticket/ticket.js (نسخه ادمین)
"use client";
import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { listAdminTickets } from "@/lib/adminTicketsApi";
import { TicketSkeleton } from "@/components/ui/TicketSkeleton"; // فرض می‌کنیم یک کامپوننت اسکلتون دارید

// کامپوننت برای نمایش پیام خطا
const ErrorMessage = ({ message }) => (
  <div className="text-center text-red-400 p-8 bg-red-900/20 rounded-lg">
    <p>خطا در دریافت اطلاعات: {message}</p>
  </div>
);

export default function AdminTicketsList() {
  // ✅ استفاده از useQuery برای دریافت لیست تیکت‌های ادمین
  const { data, isLoading, isError, error } = useQuery({
    // کامنت: کلید کوئری را با 'admin' مشخص می‌کنیم تا با تیکت‌های کاربر قاطی نشود
    queryKey: ["admin", "tickets"],
    queryFn: () => listAdminTickets({ status: "open", per_page: 20 }), // فراخوانی تابع API
  });

  // ✅ مدیریت حالت لودینگ
  if (isLoading) {
    return <TicketSkeleton />;
  }

  // ✅ مدیریت حالت خطا
  if (isError) {
    return <ErrorMessage message={error.message} />;
  }

  const tickets = data?.data || [];

  return (
    <div className="p-4 bg-dark text-white border-t border-green-700 ">
      {/* هدر جدول */}
      <div className="hidden md:grid grid-cols-5 text-center font-medium text-green-400 border-b border-green-700 pb-2">
        <span>موضوع</span>
        <span>کاربر</span>
        <span>دپارتمان</span>
        <span>آخرین بروزرسانی</span>
        <span>وضعیت</span>
      </div>

      {/* لیست تیکت‌ها */}
      <div className="mt-4 space-y-4">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <Link key={ticket.id} href={`/admin/tickets/${ticket.id}`} className="block">
              <div className="grid grid-cols-2 md:grid-cols-5 items-center gap-4 rounded-2xl border border-green-800 px-4 py-4 bg-dark shadow-sm hover:bg-green-200/10 text-center text-sm">
                
                {/* کامنت: استفاده از Unread برای نمایش نقطه قرمز خوانده نشده */}
                <span className="flex items-center justify-center gap-2">
                  {ticket.unread > 0 && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
                  {ticket.subject}
                </span>
                
                <span className="text-gray-300">{ticket.user.display_name}</span>
                <span className="text-gray-300">{ticket.department}</span>
                <span className="text-gray-400 text-xs">
                  {new Date(ticket.last_message_at).toLocaleString("fa-IR")}
                </span>
                
                {/* کامنت: استایل‌دهی به وضعیت تیکت */}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${ticket.status === 'open' ? 'bg-green-800 text-green-300' : ''}
                    ${ticket.status === 'pending' ? 'bg-yellow-800 text-yellow-300' : ''}
                    ${ticket.status === 'closed' ? 'bg-red-800 text-red-300' : ''}`}
                >
                  {ticket.status}
                </span>

              </div>
            </Link>
          ))
        ) : (
          <div className="text-center text-gray-400 p-8">هیچ تیکت بازی یافت نشد.</div>
        )}
      </div>
    </div>
  );
}