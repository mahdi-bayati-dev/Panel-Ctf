"use client";
import React, { useState } from "react";
import Ticket from "@/components/Template/ticket/ticket";
import LeaderBoard from "@/components/Template/users/page";

// آیکون ها
import FaqIcon from "@/components/icons/faqIcon";
import RulesIcon from "@/components/icons/rulesIcon";
import ChevronIcon from "@/components/icons/ChevronIcon";
import FAQAdmin from "@/components/Template/faq/faq";

// این کامپوننت فقط مسئول نمایش UI پنل است
export default function PanelAdmin() {
  const [openSection, setOpenSection] = useState("rules"); // بخش کاربران به صورت پیش‌فرض باز است

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="m-2 space-y-4 w-full max-w-md sm:max-w-lg md:max-w-5xl">
      {/* کاربران */}
      <div className="flex flex-col gap-2 rounded-lg bg-dark p-5 text-white border border-colorThemeLite-green">
        <div
          className="flex cursor-pointer items-center justify-between"
          onClick={() => toggleSection("rules")}
        >
          <h2 className="flex gap-2 items-center text-colorThemeLite-accent text-base font-bold text-center">
            <RulesIcon />
            کاربران
          </h2>
          <ChevronIcon
            className={`h-5 w-5 text-white transition-transform duration-500 ${
              openSection === "rules" ? "rotate-180" : ""
            }`}
          />
        </div>
        <div
          className={`grid transition-all duration-500 ease-in-out ${
            openSection === "rules"
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            {/* کامپوننت لیست کاربران در اینجا قرار می‌گیرد */}
            <LeaderBoard />
          </div>
        </div>
      </div>

      {/* تیکت ها */}
      <div className="flex flex-col gap-2 rounded-lg bg-dark p-5 text-white border border-colorThemeLite-green">
        <div
          className="flex cursor-pointer items-center justify-between"
          onClick={() => toggleSection("ticket")}
        >
          <h2 className="flex gap-2 items-center text-colorThemeLite-accent text-base font-bold">
            <FaqIcon />
            تیکت ها
          </h2>
          <ChevronIcon
            className={`h-5 w-5 text-white transition-transform duration-500 ${
              openSection === "ticket" ? "rotate-180" : ""
            }`}
          />
        </div>
        <div
          className={`grid transition-all duration-500 ease-in-out ${
            openSection === "ticket"
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            {/* کامپوننت تیکت‌ها در اینجا قرار می‌گیرد */}
            <Ticket />
          </div>
        </div>
      </div>

      {/* سوالات متداول */}
      <div className="flex flex-col gap-2 rounded-lg bg-dark p-5 text-white border border-colorThemeLite-green">
        <div
          className="flex cursor-pointer items-center justify-between"
          onClick={() => toggleSection("faq")}
        >
          <h2 className="flex gap-2 items-center text-colorThemeLite-accent text-base font-bold">
            <FaqIcon />
            سوالات متداول
          </h2>
          <ChevronIcon
            className={`h-5 w-5 text-white transition-transform duration-500 ${
              openSection === "faq" ? "rotate-180" : ""
            }`}
          />
        </div>
        <div
          className={`grid transition-all duration-500 ease-in-out ${
            openSection === "faq"
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            {/* کامپوننت سوالات متداول در اینجا قرار می‌گیرد */}
            <FAQAdmin />
          </div>
        </div>
      </div>
    </div>
  );
}
