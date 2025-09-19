"use client";

import React from 'react';

// کامنت فارسی برای توضیح کد
// این کامپوننت یک اسکلت لودینگ (Skeleton) برای صفحه جزئیات کاربر است.
// هدف آن نمایش یک پیش‌نمایش بصری از ساختار صفحه است، در حالی که داده‌های واقعی در حال بارگذاری هستند.
// این کار تجربه کاربری (UX) را به شدت بهبود می‌بخشد، زیرا کاربر به جای دیدن یک صفحه سفید یا یک لودر ساده،
// طرح کلی محتوا را می‌بیند و حس می‌کند که برنامه سریع‌تر است.
const UserDetailSkeleton = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-colorThemeDark-primary pt-10 px-4 animate-pulse">
      <div className="w-full max-w-2xl">
        {/* Placeholder for the back link */}
        <div className="h-6 w-48 bg-gray-700 rounded-md mb-6"></div>

        <div className="bg-dark rounded-2xl shadow-lg p-8 border border-colorThemeLite-green/30">
          <div className="flex flex-col items-center text-center mb-8">
            {/* Placeholder for the avatar */}
            <div className="w-32 h-32 rounded-full bg-gray-700 border-4 border-colorThemeLite-green/30 mb-4"></div>
            {/* Placeholder for the name */}
            <div className="h-8 w-40 bg-gray-700 rounded-md mb-2"></div>
            {/* Placeholder for the username */}
            <div className="h-5 w-24 bg-gray-700 rounded-md"></div>
          </div>

          <div className="space-y-4">
            {/* Creating 5 rows of placeholders for user details */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-gray-700/50">
                <div className="h-4 w-1/4 bg-gray-700 rounded"></div>
                <div className="h-4 w-1/3 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailSkeleton;
