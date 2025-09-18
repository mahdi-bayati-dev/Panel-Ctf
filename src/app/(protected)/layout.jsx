import AuthGuard from "@/components/Auth/AuthGuard";

export default function ProtectedLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}
