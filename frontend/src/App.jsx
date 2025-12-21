import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import AppRoutes from "@/routes/AppRoutes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "./context/ThemeContext"; // shadcn theme provider

export default function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {/* You can add a global Header here if needed */}
        <AppRoutes />
        <Sonner />
      </div>
    </ThemeProvider>
  );
}
