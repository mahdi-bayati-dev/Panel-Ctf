"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

export default function AppProviders({ children }) {
  // این اطمینان می‌دهد که QueryClient فقط یک بار در کلاینت ایجاد می‌شود
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster position="bottom-center" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
