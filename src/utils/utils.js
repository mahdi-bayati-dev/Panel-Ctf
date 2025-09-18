// این تابع یک کوکی را با نام آن از document.cookie می‌خواند
export const getCookie = (n) =>
  document.cookie
    .split("; ")
    .find((c) => c.startsWith(n + "="))
    ?.split("=")[1] ?? "";
