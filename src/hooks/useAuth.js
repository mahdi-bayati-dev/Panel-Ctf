import { useContext } from "react";
import AuthContext from "../context/AuthContext";

// این هوک سفارشی کار با کانتکست را ساده‌تر می‌کند
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
