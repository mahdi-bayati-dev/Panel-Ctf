"use client";
import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// داده‌های فیک (می‌تونی بعداً به API وصلش کنی)
const fakeUsers = [
  {
    id: 1,
    name: "Mahdi Bayati",
    email: "mahdi@example.com",
    role: "کاربر عادی",
    score: 22440,
    avatar: "/img/p-user/person.png",
    joinDate: "1402/07/15",
  },
  {
    id: 2,
    name: "Ali Rezaei",
    email: "ali@example.com",
    role: "ادمین",
    score: 19870,
    avatar: "/img/p-user/person.png",
    joinDate: "1402/06/12",
  },
  {
    id: 3,
    name: "Sara Mohammadi",
    email: "sara@example.com",
    role: "کاربر عادی",
    score: 17650,
    avatar: "/img/p-user/person.png",
    joinDate: "1402/05/01",
  },
];

function UserDetails() {
  const params = useParams();
  const userId = parseInt(params.id); // گرفتن id از url
  const user = fakeUsers.find((u) => u.id === userId);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg font-bold">
        کاربر یافت نشد 😢
      </div>
    );
  }

  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center  bg-colorThemeDark-primary  text-white px-6 py-10">
      <div className="max-w-lg w-full bg-dark rounded-2xl shadow-lg p-6">
        {/* تصویر و نام */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-2xl border border-colorThemeLite-green/60 object-cover"
          />
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <span className="text-colorThemeLite-accent text-sm">
            نقش: {user.role}
          </span>
        </div>

        {/* اطلاعات کاربر */}
        <div className="space-y-3 text-right">
          <p>
            <span className="font-semibold">ایمیل:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">امتیاز:</span>{" "}
            {user.score.toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">تاریخ عضویت:</span> {user.joinDate}
          </p>
        </div>


        {/* بازگشت */}
        <div className="mt-6 text-center">
          <Link
            href="/home"
            className="text-colorThemeLite-accent hover:underline text-sm"
          >
            ← بازگشت به لیست کاربران
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
