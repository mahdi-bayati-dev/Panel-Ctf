"use client";
// PanelAdmin.js
import React, { Suspense, lazy } from "react";
import { TicketSkeleton } from "@/components/ui/TicketSkeleton"; // یک کامپوننت لودینگ ساده بساز

// کامنت: کامپوننت‌ها را به صورت lazy وارد می‌کنیم
const UsersPage = lazy(() => import("../users/page"));
const Ticket = lazy(() => import("@/components/Template/ticket/ticket"));
const FAQAdmin = lazy(() => import("@/components/Template/faq/faq"));
const Rules = lazy(() => import("../rules/rules"));
const ChallengesAdmin = lazy(() => import("../challenges/challenges"));
const TopPerformers = lazy(() => import("../TopPerformers/TopPerformers"));

export default function PanelAdmin({ activeTab }) {
  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UsersPage />;
      case "ticket":
        return <Ticket />;
      case "faq":
        return <FAQAdmin />;
      case "challenges":
        return <ChallengesAdmin />;
      case "rules":
        return <Rules />;
      case "topPerformers":
        return <TopPerformers />;
      default:
        return <p>لطفا یک بخش را از منو انتخاب کنید.</p>;
    }
  };

  return (
    <div className="w-full rounded-lg bg-dark p-5 text-white border border-colorThemeLite-green">
      {/* کامنت: از Suspense برای نمایش یک لودینگ در زمان بارگذاری کد هر بخش استفاده می‌کنیم */}

      <Suspense fallback={< TicketSkeleton />}> {renderContent()}</Suspense>
    </div>
  );
}
