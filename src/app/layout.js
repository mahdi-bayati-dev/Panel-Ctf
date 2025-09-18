import "./globals.css";

import { Toaster } from "react-hot-toast";
import AppProviders from "@/providers/ReactQueryProvider";

export const metadata = {
  title: "Admin Panel",
  description: "Admin Panel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="relative min-h-screen">
        <main>
          <AppProviders>{children}</AppProviders>

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
      </body>
    </html>
  );
}
