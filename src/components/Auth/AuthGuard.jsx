"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col justify-center items-center bg-colorThemeDark-primary text-colorThemeLite-accent">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-colorThemeLite-accent mb-4"></div>
    <p className="text-lg font-semibold">
      در حال بارگذاری صفحه، لطفاً صبر کنید...
    </p>
  </div>
);

const AuthGuard = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
    return () => {}; // جلوگیری از هشدار cleanup
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return <LoadingScreen />;
  }

  return children;
};

export default AuthGuard;
