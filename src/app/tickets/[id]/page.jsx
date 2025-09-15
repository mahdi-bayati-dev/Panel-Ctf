"use client";
import TicketIcon from "@/components/icons/ticketIcon";
import TicketWitheIcon from "@/components/icons/ticketWitheIcon";
import BackIcon from "@/components/icons/back";
import AdminIcon from "@/components/icons/AdminIcon";
import UserIconRejecter from "@/components/icons/userIconRejecter";
import React, { useState, useRef } from "react";
import Link from "next/link";
import FileIcon from "@/components/icons/fileIcon";

function TicketDetails() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "user", text: "سلام، من یک مشکل دارم در بخش پرداخت." },
    {
      id: 2,
      sender: "admin",
      text: "سلام! لطفا توضیح بیشتری بدید تا بررسی کنم.",
    },
    {
      id: 3,
      sender: "user",
      text: "پرداخت من انجام شد اما توی داشبورد ثبت نشده.",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  // کامنت: یک state جدید برای نگهداری فایل انتخابی
  const [selectedFile, setSelectedFile] = useState(null);
  // کامنت: یک ref برای دسترسی به input فایل مخفی
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // کامنت: فایل انتخاب شده را در state ذخیره می‌کنیم
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return; // اگر نه متنی بود و نه فایلی، ارسال نکن

    // کامنت: در اینجا منطق ارسال واقعی به سرور قرار می‌گیرد
    console.log("ارسال پیام:", newMessage);
    console.log("ارسال فایل:", selectedFile);

    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        sender: "user",
        text: newMessage,
        file: selectedFile,
      },
    ]);

    // کامنت: بعد از ارسال، هر دو state را خالی می‌کنیم
    setNewMessage("");
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-colorThemeDark-primary px-4">
      <div className="w-full max-w-3xl bg-dark rounded-2xl shadow-xl border border-green-800/40 flex flex-col mb-14">
        {/* هدر */}
        <div className="flex items-center justify-between pt-3 px-3">
          <h1 className="flex items-center gap-2 text-xl font-semibold text-colorThemeLite-accent">
            <TicketIcon />
            عنوان تیکت
          </h1>
          <div className="flex justify-center">
            <Link href="/home">
              <button className="flex items-center gap-2 px-8 py-2 bg-colorThemeDark-primary text-white rounded-full hover:bg-green-600 transition font-medium shadow-md">
                <BackIcon className="w-5 h-5" />
                <span>بازگشت</span>
              </button>
            </Link>
          </div>
        </div>
        <div className="border-b border-colorThemeLite-green pb-3 w-full"></div>

        {/* بخش چت */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) =>
            msg.sender === "admin" ? ( // 🔄 اینجا تغییر دادیم
              <div key={msg.id} className="flex justify-end gap-2">
                <div className="bg-green-700/30 text-white px-4 py-3 rounded-2xl max-w-md text-sm shadow-md flex flex-col gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="break-all">{msg.text}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 self-end">
                    ۱۴۰۴/۰۶/۱۹ - ۱۰:۴۲
                  </span>
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex items-start gap-2">
                <div className="bg-gray-700 text-white px-4 py-3 rounded-2xl max-w-md text-sm shadow-md flex flex-col gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <UserIconRejecter className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="break-all">{msg.text}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 self-start">
                    ۱۴۰۴/۰۶/۱۹ - ۱۰:۴۵
                  </span>
                </div>
              </div>
            )
          )}
        </div>

        {/* فرم ارسال پیام */}
        <form onSubmit={handleSend} className=" p-4">
          <div className="flex flex-col items-center gap-2 border border-colorThemeLite-green rounded-2xl">
            {/* کامنت: دکمه انتخاب فایل */}
            <div className="flex justify-between  w-full px-3 py-1 border-b border-colorThemeLite-green">
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="p-2 text-gray-400 hover:text-white"
                  aria-label="پیوست کردن فایل"
                >
                  <FileIcon />
                </button>
              </div>

              {/* کامنت: بخش نمایش فایل انتخاب شده */}
              {selectedFile && (
                <div className="flex items-center justify-between text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-lg">
                  <span>{selectedFile.name}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-red-500 hover:text-red-400"
                    aria-label="حذف فایل"
                  >
                    ❌
                  </button>
                </div>
              )}
            </div>

            <textarea
              rows={3}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="پیامت رو بنویس..."
              className="flex-1 w-full px-4 py-3 bg-dark text-gray-100 resize-none focus:outline-none rounded-xl mt-1"
            />

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-colorThemeDark-primary text-white rounded-full hover:bg-green-600 transition font-medium shadow-md mb-2"
            >
              <TicketWitheIcon className="w-5 h-5" />
              <span>ارسال تیکت </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TicketDetails;
