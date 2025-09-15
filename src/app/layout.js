import "./globals.css";

import { Toaster } from "react-hot-toast";
import ReactQueryProvider from "@/providers/ReactQueryProvider"; // مسیر فایل را مطابق ساختار پروژه خود تنظیم کنید

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta name="geo.region" content="IR" />
        <meta name="geo.placename" content="Tehran, Iran" />
      </head>
      <body className="relative min-h-screen">
        <ReactQueryProvider>
          
          <main>
            {children}
            <Toaster
              position="top-left"
              reverseOrder={false}
              toastOptions={{
                style: {
                  background: "#333",
                  color: "#fff",
                  borderRadius: "12px",
                  padding: "12px 16px",
                },
                success: {
                  style: { background: "#22c55e" }, // سبز
                },
                error: {
                  style: { background: "#ef4444" }, // قرمز
                },
                loading: {
                  style: { background: "#3b82f6" }, // آبی
                },
              }}
            />
          </main>
         
        </ReactQueryProvider>
      </body>
    </html>
  );
}
