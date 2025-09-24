// page.js (داخل پوشه داشبورد) - نسخه نهایی با آیکون
"use client";
import React, { useState } from "react";
import useAuth from "@/hooks/useAuth";
import PanelAdmin from "@/components/Template/PanelAdmin/PanelAdmin";

// وارد کردن کامپوننت‌های آیکون
// نکته: بهتر است نام کامپوننت‌ها با حرف بزرگ شروع شود (PascalCase)
import UserPanelIcon from "@/components/icons/userPanelIcon";
import FaqIcon from "@/components/icons/faqIcon";
import TicketIcon from "@/components/icons/ticketIcon";
import ChaleshIcon from "@/components/icons/chaleshIcon";
import RulesIcon from "@/components/icons/rulesIcon";
import TopPerformersIcon from "@/components/icons/TopPerformersIcon";
const DashboardHeader = ({ user, onLogout }) => (
  <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <h1 className="text-xl md:text-2xl font-bold text-white">
      خوش آمدی، {user?.username || "ادمین عزیز"}!
    </h1>
    <button
      onClick={onLogout}
      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300 flex-shrink-0"
    >
      خروج
    </button>
  </div>
);

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("users");

  // مرحله ۱: کامپوننت آیکون را به هر آبجکت در آرایه اضافه می‌کنیم
  const tabs = [
    { id: "users", label: "کاربران", icon: <UserPanelIcon /> },
    { id: "ticket", label: "تیکت ها", icon: <TicketIcon /> },
    { id: "challenges", label: "چالش‌ها", icon: <ChaleshIcon /> },
    { id: "faq", label: "سوالات متداول", icon: <FaqIcon /> },
    { id: "rules", label: "قوانین", icon: <RulesIcon /> },
    { id: "topPerformers", label: "نفرات برتر", icon: <TopPerformersIcon /> },
  ];

  return (
    <div className="bg-colorThemeDark-primary min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <DashboardHeader user={user} onLogout={logout} />
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-dark p-4 rounded-2xl sticky top-8">
              <ul className="flex flex-col gap-2">
                {tabs.map((tab) => (
                  <li
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    // مرحله ۲: کلاس flex را برای چیدمان آیکون و متن اضافه می‌کنیم
                    className={`flex items-center gap-3 border text-colorThemeLite-accent rounded-2xl py-2 px-6 cursor-pointer transition-colors duration-300 text-right ${
                      activeTab === tab.id
                        ? "bg-colorThemeLite-blue/50 border-colorThemeLite-blue font-bold shadow-lg"
                        : "border-colorThemeLite-green hover:bg-colorThemeDark-primary/60 hover:border-colorThemeLite-blue"
                    }`}
                  >
                    {/* آیکون را اینجا رندر می‌کنیم */}
                    {tab.icon}
                    {/* لیبل را اینجا رندر می‌کنیم */}
                    <span>{tab.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <main className="w-full flex-grow">
            <PanelAdmin activeTab={activeTab} />
          </main>
        </div>
      </div>
    </div>
  );
}
