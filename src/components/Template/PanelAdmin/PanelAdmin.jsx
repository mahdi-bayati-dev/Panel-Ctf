"use client";
import React, { useState } from "react";
import Ticket from "@/components/Template/ticket/ticket";
// کامپوننت لیست کاربران را با نام جدید وارد می‌کنیم
import UsersPage from "../users/page";

// آیکون ها
import FaqIcon from "@/components/icons/faqIcon";
import RulesIcon from "@/components/icons/rulesIcon";
import ChevronIcon from "@/components/icons/ChevronIcon";
import FAQAdmin from "@/components/Template/faq/faq";

// این کامپوننت فقط مسئول نمایش UI پنل است
export default function PanelAdmin() {
  // بخش کاربران را به "users" تغییر می‌دهیم و آن را پیش‌فرض می‌کنیم
  const [openSection, setOpenSection] = useState("users");

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="m-2 space-y-4 w-full max-w-md sm:max-w-lg md:max-w-5xl">
      {/* کاربران */}
      <div className="flex flex-col gap-2 rounded-lg bg-dark p-5 text-white border border-colorThemeLite-green">
        <div
          className="flex cursor-pointer items-center justify-between"
          onClick={() => toggleSection("users")} // اینجا را هم به "users" تغییر می‌دهیم
        >
          <h2 className="flex gap-2 items-center text-colorThemeLite-accent text-base font-bold text-center">
            <RulesIcon /> کاربران
          </h2>
          <ChevronIcon
            className={`h-5 w-5 text-white transition-transform duration-500 ${
              openSection === "users" ? "rotate-180" : "" // اینجا را هم به "users" تغییر می‌دهیم
            }`}
          />
        </div>

        <div
          className={`grid transition-all duration-500 ease-in-out ${
            openSection === "users" // اینجا را هم به "users" تغییر می‌دهیم
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            {/* کامپوننت جدید لیست کاربران را در اینجا قرار می‌دهیم */}
            <UsersPage />
          </div>
        </div>
      </div>
      {/* تیکت ها (بدون تغییر) */}
      <div className="flex flex-col gap-2 rounded-lg bg-dark p-5 text-white border border-colorThemeLite-green">
               {" "}
        <div
          className="flex cursor-pointer items-center justify-between"
          onClick={() => toggleSection("ticket")}
        >
                   {" "}
          <h2 className="flex gap-2 items-center text-colorThemeLite-accent text-base font-bold">
                        <FaqIcon />            تیکت ها          {" "}
          </h2>
                   {" "}
          <ChevronIcon
            className={`h-5 w-5 text-white transition-transform duration-500 ${
              openSection === "ticket" ? "rotate-180" : ""
            }`}
          />
                 {" "}
        </div>
               {" "}
        <div
          className={`grid transition-all duration-500 ease-in-out ${
            openSection === "ticket"
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
                 
          <div className="overflow-hidden">
                        <Ticket /> 
          </div>
           
        </div>
      </div>
      {/* سوالات متداول (بدون تغییر) */}
      <div className="flex flex-col gap-2 rounded-lg bg-dark p-5 text-white border border-colorThemeLite-green">
        <div
          className="flex cursor-pointer items-center justify-between"
          onClick={() => toggleSection("faq")}
        >
          <h2 className="flex gap-2 items-center text-colorThemeLite-accent text-base font-bold">
                        <FaqIcon />            سوالات متداول          {" "}
          </h2>
                   {" "}
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
                        <FAQAdmin /> 
          </div>
                 
        </div>
             
      </div>
    </div>
  );
}
