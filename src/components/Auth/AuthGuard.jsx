"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

const AuthGuard = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-colorThemeDark-primary ">
        <p>در حال بارگذاری صفحه لطفا صبر کنید ...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
