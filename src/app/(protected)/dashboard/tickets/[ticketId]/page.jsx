// فایل: app/admin/tickets/[ticketId]/page.js
"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminTicket,
  replyAdminTicket,
  closeAdminTicket,
  reopenAdminTicket,
} from "@/lib/adminTicketsApi";
import toast from "react-hot-toast";

// آیکن‌ها و کامپوننت‌های UI
import TicketIcon from "@/components/icons/ticketIcon";
import TicketWitheIcon from "@/components/icons/ticketWitheIcon";
import BackIcon from "@/components/icons/back";
import UserIconRejecter from "@/components/icons/userIconRejecter";
import AdminIcon from "@/components/icons/AdminIcon"; // آیکن برای ادمین
import FileIcon from "@/components/icons/fileIcon";
import { TicketSkeleton } from "@/components/ui/TicketSkeleton";

// کامپوننت اصلی صفحه جزئیات تیکت
export default function AdminTicketDetailsPage() {
  const params = useParams();
  const ticketId = params.ticketId;
  const queryClient = useQueryClient();

  const [body, setBody] = useState("");
  const [files, setFiles] = useState([]); // ✅ برای پشتیبانی از چند فایل
  const fileInputRef = useRef(null);

  // --- دریافت داده‌های تیکت با useQuery ---
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "ticket", ticketId],
    queryFn: () => getAdminTicket(ticketId),
    enabled: !!ticketId, // کامنت: کوئری فقط زمانی اجرا می‌شود که ticketId موجود باشد
  });

  // --- ارسال پاسخ با useMutation ---
  const replyMutation = useMutation({
    mutationFn: replyAdminTicket,
    onSuccess: () => {
      toast.success("پاسخ شما با موفقیت ارسال شد.");
      // ✅ کلید کوئری جزئیات تیکت را باطل می‌کنیم تا پیام‌ها رفرش شوند
      queryClient.invalidateQueries({
        queryKey: ["admin", "ticket", ticketId],
      });
      // ✅ کلید کوئری لیست تیکت‌ها را هم باطل می‌کنیم تا وضعیت unread آپدیت شود
      queryClient.invalidateQueries({ queryKey: ["admin", "tickets"] });
      setBody("");
      setFiles([]);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "خطا در ارسال پاسخ."),
  });

  // --- بستن تیکت با useMutation ---
  const closeMutation = useMutation({
    mutationFn: closeAdminTicket,
    onSuccess: () => {
      toast.success("تیکت با موفقیت بسته شد.");
      queryClient.invalidateQueries({
        queryKey: ["admin", "ticket", ticketId],
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "tickets"] });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "خطا در بستن تیکت."),
  });

  // --- باز کردن تیکت با useMutation ---
  const reopenMutation = useMutation({
    mutationFn: reopenAdminTicket,
    onSuccess: () => {
      toast.success("تیکت مجدداً باز شد.");
      queryClient.invalidateQueries({
        queryKey: ["admin", "ticket", ticketId],
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "tickets"] });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "خطا در باز کردن تیکت."),
  });

  const handleFileChange = (e) => {
    if (e.target.files) {
      // کامنت: محدودیت تعداد و حجم فایل‌ها را اینجا اعمال کنید
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!body.trim() && files.length === 0) return;
    replyMutation.mutate({ id: ticketId, body, files });
  };

  if (isLoading)
    return (
      <div className="p-10">
        <TicketSkeleton />
      </div>
    );
  if (isError)
    return <div className="text-red-500 p-10">خطا: {error.message}</div>;

  const { ticket, messages } = data;
    // ✅ این متغیر باید اینجا تعریف شود، یعنی بعد از اینکه ticket از data استخراج شد
  const isTicketClosed = ticket.status === "closed";

  return (
    <div className="min-h-screen flex items-center justify-center bg-colorThemeDark-primary px-4">
      <div className="w-full max-w-3xl bg-dark rounded-2xl shadow-xl border border-green-800/40 flex flex-col mb-14">
        {/* هدر */}
        <div className="flex items-center justify-between pt-3 px-3">
          <h1 className="flex items-center gap-2 text-xl font-semibold text-colorThemeLite-accent">
            <TicketIcon />
            {ticket.subject}
          </h1>
          <div className="flex items-center gap-2">
            {/* دکمه‌های بستن و باز کردن */}
            {ticket.status !== "closed" ? (
              <button
                onClick={() => closeMutation.mutate(ticketId)}
                disabled={closeMutation.isPending}
                className="px-4 py-2 text-xs bg-red-700 rounded-full hover:bg-red-600 disabled:bg-gray-500"
              >
                {closeMutation.isPending ? "در حال بستن..." : "بستن تیکت"}
              </button>
            ) : (
              <button
                onClick={() => reopenMutation.mutate(ticketId)}
                disabled={reopenMutation.isPending}
                className="px-4 py-2 text-xs bg-blue-700 rounded-full hover:bg-blue-600 disabled:bg-gray-500"
              >
                {reopenMutation.isPending ? "..." : "باز کردن مجدد"}
              </button>
            )}
            <Link href="/dashboard">
              {" "}
              {/* لینک به داشبورد ادمین */}
              <button className="flex items-center gap-2 px-8 py-2 bg-colorThemeDark-primary text-white rounded-full hover:bg-green-600">
                <BackIcon className="w-5 h-5" />
                <span>بازگشت</span>
              </button>
            </Link>
          </div>
        </div>
        <div className="border-b border-colorThemeLite-green pb-3 w-full"></div>

        {/* بخش چت */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 h-96">
          {messages.data.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${
                msg.sender.type === "admin" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-3 rounded-2xl max-w-md text-sm shadow-md flex flex-col gap-2 ${
                  msg.sender.type === "admin"
                    ? "bg-green-700/30"
                    : "bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {msg.sender.type === "admin" ? (
                    <AdminIcon className="w-5 h-5 text-green-400" />
                  ) : (
                    <UserIconRejecter className="w-5 h-5 text-blue-400" />
                  )}
                  <span className="font-semibold text-white">
                    {msg.sender.display_name}
                  </span>
                </div>
                {msg.body && <p className="break-words text-white">{msg.body}</p>}

                {/* نمایش فایل‌های پیوست */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-2 space-y-2 border-t border-gray-600 pt-2">
                    {msg.attachments.map((file, index) => (
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={index}
                        className="flex items-center gap-2 text-xs text-blue-400 hover:underline"
                      >
                        <FileIcon /> {file.name}
                      </a>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-gray-400 self-end mt-1">
                  {new Date(msg.created_at).toLocaleString("fa-IR")}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* فرم ارسال پیام */}
        <form onSubmit={handleSend} className="p-4">
          {/* ✅ جدید: اگر تیکت بسته بود، یک پیام نمایش می‌دهیم */}
          {isTicketClosed && (
            <div className="text-center p-3 mb-2 bg-yellow-900/50 text-yellow-300 text-sm rounded-lg">
              این تیکت بسته شده است و امکان ارسال پیام جدید وجود ندارد.
            </div>
            
          )}
          <div className="flex flex-col items-center gap-2 border border-colorThemeLite-green rounded-2xl">
            <div className="flex justify-between w-full px-3 py-1 border-b border-colorThemeLite-green">
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <FileIcon />
                </button>
              </div>
              {/* نمایش فایل‌های انتخاب شده */}
              <div className="flex flex-wrap gap-2">
                {files.map((file, i) => (
                  <div
                    key={i}
                    className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-lg flex items-center gap-1"
                  >
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFiles(files.filter((f) => f.name !== file.name))
                      }
                      className="text-red-500 text-xs"
                    >
                      ⨯
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <textarea
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={isTicketClosed} // ✅ جدید: غیرفعال کردن textarea
              placeholder="پاسخ خود را بنویسید..."
              className="flex-1 w-full px-4 py-3 bg-dark text-gray-100 resize-none focus:outline-none rounded-xl mt-1"
            />
            <button
              type="submit"
              disabled={isTicketClosed || replyMutation.isPending}
              className="flex items-center gap-2 px-6 py-3 bg-colorThemeDark-primary text-white rounded-full hover:bg-green-600 transition font-medium shadow-md mb-2 disabled:bg-gray-600"
            >
              <TicketWitheIcon className="w-5 h-5" />
              <span>
                {replyMutation.isPending ? "در حال ارسال..." : "ارسال پاسخ"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
