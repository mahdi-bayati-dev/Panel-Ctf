// کامپوننت برای یک ردیف اسکلتون (یک تیکت)
 const TicketRowSkeleton = () => (
  <div className="flex items-center gap-4 rounded-2xl border border-green-800/20 px-4 py-4 bg-dark shadow-sm">
    {/* اسکلتون آیکون */}
    <div className="w-6 h-6 bg-gray-700 rounded-full"></div>

    <div className="w-full">
      {/* اسکلتون برای حالت دسکتاپ (سه ستونه) */}
      <div className="hidden md:grid grid-cols-3 text-center gap-4">
        <div className="h-5 bg-gray-700 rounded-md w-3/4 mx-auto"></div>
        <div className="h-5 bg-gray-700 rounded-md w-1/2 mx-auto"></div>
        <div className="h-5 bg-gray-700 rounded-md w-1/4 mx-auto"></div>
      </div>

      {/* اسکلتون برای حالت موبایل (عمودی) */}
      <div className="flex flex-col space-y-3 text-sm md:hidden">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  </div>
);

// کامپوننت اصلی اسکلتون که کل صفحه را مدیریت می‌کند
 export const TicketSkeleton = () => (
  <div className="p-4 bg-dark text-white border-t border-green-700 animate-pulse">
    {/* هدر دسکتاپ */}
    <div className="hidden md:grid grid-cols-3 text-center font-medium text-green-400 border-b border-green-700 pb-2">
      <span>عنوان</span>
      <span>آخرین بروزرسانی</span>
      <span>وضعیت</span>
    </div>

    {/* ردیف‌های اسکلتون */}
    <div className="mt-4 space-y-4">
      <TicketRowSkeleton />
      <TicketRowSkeleton />
      <TicketRowSkeleton />
      <TicketRowSkeleton />
    </div>

    {/* اسکلتون دکمه ارسال تیکت */}
    <div className="flex justify-center mt-6">
      <div className="h-11 w-48 bg-gray-700 rounded-full"></div>
    </div>
  </div>
);

// ====================================================================
// پایان کامپوننت اسکلتون
// ====================================================================
