// فایل: app/api/[...slug]/route.js

import { NextResponse } from "next/server";

// آدرس دامنه اصلی بک‌اند شما
const BACKEND_URL = "https://api.eitebar.ir";

async function handler(req) {
  // ۱. ساخت URL کامل برای ارسال به بک‌اند
  // ----------------------------------------------------
  // کامنت: مسیر درخواست ورودی را می‌گیریم (مثلاً /api/admin/login)
  const pathname = new URL(req.url).pathname;

  // کامنت: پیشوند /api را از مسیر حذف می‌کنیم تا مسیر خالص برای بک‌اند به دست آید (مثلاً /admin/login)
  const backendPath = pathname.replace(/^\/api/, "");

  // کامنت: URL نهایی برای ارسال به بک‌اند ساخته می‌شود
  const backendUrl = `${BACKEND_URL}${backendPath}`;

  // ۲. ارسال درخواست به بک‌اند
  // ----------------------------------------------------
  try {
    const backendResponse = await fetch(backendUrl, {
      method: req.method,
      headers: req.headers, // کامنت: تمام هدرهای مرورگر را به بک‌اند منتقل می‌کنیم
      body: req.body, // کامنت: بدنه درخواست را (در صورت وجود) منتقل می‌کنیم
      redirect: "manual", // کامنت: مدیریت ریدایرکت‌ها را خودمان انجام می‌دهیم
    });

    // ۳. ساخت پاسخ برای ارسال به مرورگر
    // ----------------------------------------------------
    // کامنت: یک پاسخ جدید با بدنه و وضعیت پاسخ بک‌اند می‌سازیم
    const response = new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: backendResponse.headers, // کامنت: هدرهای پاسخ بک‌اند را کپی می‌کنیم
    });

    // ۴. جادوی اصلی: اصلاح کوکی‌ها
    // ----------------------------------------------------
    // کامنت: هدر 'set-cookie' را از پاسخ بک‌اند استخراج می‌کنیم
    const setCookieHeader = backendResponse.headers.get("set-cookie");

    if (setCookieHeader) {
      // کامنت: ویژگی 'Domain' را از کوکی‌ها حذف می‌کنیم.
      // با این کار، مرورگر به صورت خودکار دامنه فرانت‌اند را برای کوکی ست می‌کند و آن را First-Party می‌کند.
      const modifiedCookie = setCookieHeader
        .split(";")
        .filter((part) => !part.trim().toLowerCase().startsWith("domain="))
        .join(";");

      // کامنت: هدر کوکی اصلاح شده را در پاسخی که برای مرورگر ارسال می‌شود، قرار می‌دهیم
      response.headers.set("set-cookie", modifiedCookie);
    }

    return response;
  } catch (error) {
    console.error("API Proxy Error:", error);
    return NextResponse.json(
      { error: "Proxy request failed." },
      { status: 500 }
    );
  }
}

// کامنت: این پراکسی را برای تمام متدهای HTTP فعال می‌کنیم
export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
};
