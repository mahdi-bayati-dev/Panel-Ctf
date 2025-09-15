import React from "react";

// این یک کامپوننت ساده برای نمایش آیکون فلش (شورون) است
// استفاده از ...props به ما اجازه می‌دهد تا هر ویژگی‌ای مثل className را از بیرون به تگ svg پاس بدهیم
const ChevronIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor" // با استفاده از currentColor، رنگ آیکون از والد خود ارث‌بری می‌کند
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props} // اینجا className و سایر props ها اعمال می‌شوند
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
};

export default ChevronIcon;
