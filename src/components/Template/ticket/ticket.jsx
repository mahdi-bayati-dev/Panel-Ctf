"use client";
import React from "react";

import TicketWitheIcon from "@/components/icons/ticketWitheIcon";
import SendTicked from "@/components/icons/sendTicked";

import Link from "next/link";

export default function Ticket() {
  const tickets = [
    {
      id: 1,
      title: "کمک",
      updatedAt: "1430/30/32",
      status: "پیگیری وضعیت",
    },
    {
      id: 2,
      title: "خوشامدید",
      updatedAt: "1430/30/30",
      status: "پاسخ ادمین",
    },
  ];

  return (
    <div className="p-4 bg-dark text-white border-t border-green-700 ">
      {/* Header (فقط دسکتاپ) */}
      <div className="hidden md:grid grid-cols-3 text-center font-medium text-green-400 border-b border-green-700 pb-2">
        <span>عنوان</span>
        <span>آخرین بروزرسانی</span>
        <span>وضعیت</span>
      </div>

      {/* Rows */}
      <div className="mt-4 space-y-4">
        {tickets.map((ticket) => (
          <div key={ticket.id}>
            <Link
              href={`/tickets/${ticket.id}`}
              className="block" // تا کل تیکت کلیک‌پذیر باشه
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-green-800 px-4 py-4 bg-dark shadow-sm hover:bg-green-200/10">
                <div className="flex justify-end md:justify-start">
                  <span className="text-green-400 hover:text-red-500 transition">
                    <TicketWitheIcon />
                  </span>
                </div>

                {/* نمایش اطلاعات */}
                <div className="w-full">
                  {/* دسکتاپ: سه ستونه */}
                  <div className="hidden md:grid grid-cols-3 text-center">
                    <span>{ticket.title}</span>
                    <span>{ticket.updatedAt}</span>
                    <span>{ticket.status}</span>
                  </div>

                  {/* موبایل: کارت عمودی */}
                  <div className="flex flex-col space-y-2 text-sm md:hidden">
                    <div className="flex justify-between">
                      <span className="text-gray-400">عنوان:</span>
                      <span>{ticket.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">آخرین بروزرسانی:</span>
                      <span>{ticket.updatedAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">وضعیت:</span>
                      <span className="text-green-400">{ticket.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

     
    </div>
  );
}
