import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import AppRoutes from "@/routes/AppRoutes";
import { Toaster as Sonner } from "@/components/ui/sonner";

export default function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]); // ✅ dependency added

  return (
    <>
      <AppRoutes />
      <Sonner />
    </>
  );
}
