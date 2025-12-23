import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import AppRoutes from "@/routes/AppRoutes";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function App() {
  const { fetchMe, loading } = useAuthStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="relative min-h-screen bg-background font-sans antialiased selection:bg-primary/10">
        
        {/* Global Loading State: Professional Splash */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 1, 0.5] 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="flex flex-col items-center gap-4"
              >
                <div className="relative flex h-12 w-12 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <div className="absolute inset-0 h-12 w-12 animate-pulse rounded-full bg-primary/20" />
                </div>
                <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground animate-pulse">
                  Initializing RepoSensei
                </p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <AppRoutes />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Toast Configuration */}
        <Toaster 
          position="top-right" 
          expand={false} 
          richColors 
          closeButton
          theme="system"
        />
      </div>
    </ThemeProvider>
  );
}