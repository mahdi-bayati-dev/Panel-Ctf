"use client";

import { useState, useEffect } from "react";

// کامنت فارسی برای توضیح کد
// این یک هوک سفارشی (Custom Hook) است که برای بهینه‌سازی جستجو استفاده می‌شود.
// ورودی: یک مقدار (مثل متنی که کاربر تایپ می‌کند) و یک زمان تأخیر (مثلاً 400 میلی‌ثانیه).
// خروجی: مقداری که با تأخیر آپدیت می‌شود.
// چرا از این هوک استفاده می‌کنیم؟ برای اینکه با هر بار تایپ کاربر، یک درخواست به API ارسال نشود.
// این هوک صبر می‌کند تا کاربر برای مدت مشخصی تایپ نکند، سپس مقدار نهایی را برمی‌گرداند.
// این کار باعث کاهش چشمگیر تعداد درخواست‌ها به سرور و بهبود عملکرد برنامه می‌شود.
function useDebounce(value, delay) {
  // State برای نگهداری مقدار با تأخیر
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // یک تایمر تنظیم می‌کنیم که پس از زمان 'delay' مقدار را آپدیت کند
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // این تابع cleanup بسیار مهم است.
    // اگر کاربر قبل از پایان تأخیر، دوباره تایپ کند، تایمر قبلی پاک می‌شود
    // و یک تایمر جدید شروع به کار می‌کند.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // این افکت فقط زمانی اجرا می‌شود که 'value' یا 'delay' تغییر کند

  return debouncedValue;
}

export default useDebounce;
