// کامپوننت برای نمایش اسکلت لودینگ
const UserSkeleton = () => (
  <div className="border border-colorThemeLite-green/30 rounded-2xl p-4 flex gap-4 my-2 items-center animate-pulse">
    <div className="w-16 h-16 rounded-2xl bg-gray-700"></div>
    <div className="flex flex-col gap-2">
      <div className="h-4 w-32 bg-gray-700 rounded"></div>
      <div className="h-3 w-24 bg-gray-700 rounded"></div>
    </div>
  </div>
);