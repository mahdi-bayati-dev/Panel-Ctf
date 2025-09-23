"use client"
// PanelAdmin.js
import React from "react";
import Ticket from "@/components/Template/ticket/ticket";
import UsersPage from "../users/page";
import FAQAdmin from "@/components/Template/faq/faq";
import Rules from "../rules/rules";
import ChallengesAdmin from "../challenges/challenges";

// کامپوننت دیگر استیت داخلی ندارد و فقط یک prop به نام activeTab دریافت می‌کند
export default function PanelAdmin({ activeTab }) {
  // تابعی برای رندر کردن محتوای تب فعال
  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UsersPage />;
      case "ticket":
        return <Ticket />;
      case "faq":
        return <FAQAdmin />;
      case "challenges":
        // کامپوننت چالش‌ها را اینجا قرار دهید
        return <ChallengesAdmin/>;
      case "rules":
        // کامپوننت قوانین را اینجا قرار دهید
        return <Rules/>;
      default:
        // اگر هیچ تبی انتخاب نشده بود، یک پیام پیش‌فرض نشان بده
        return <p>لطفا یک بخش را از منو انتخاب کنید.</p>;
    }
  };

  return (
    // یک کانتینر ثابت برای نمایش محتوا که استایل‌های قبلی را دارد
    <div className="w-full rounded-lg bg-dark p-5 text-white border border-colorThemeLite-green">
      {/* محتوای تب فعال در اینجا رندر می‌شود */}
      {renderContent()}
    </div>
  );
}
