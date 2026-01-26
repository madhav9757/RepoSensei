import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, HomeIcon, LayoutDashboard, Github, Settings } from "lucide-react";

// Shadcn Components (Ensure these are installed)
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

// Your Pages & Components
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Repo from "@/pages/Repo/Repo";
import RepoStructure from "@/components/RepoStructure/RepoStructure";
import RepoInfo from "@/pages/repo/RepoInfo";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/**
 * Animated Layout Component
 * Uses Framer Motion for smooth page transitions and 
 * Shadcn tokens for spacing and colors.
 */
function Layout({ children }) {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/10">
      {/* Sticky Glassmorphism Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Navbar />
      </header>

      <div className="flex-1 flex flex-col">
        {/* Dynamic Breadcrumb Bar - Forcefully improving UX */}
        {pathSegments.length > 0 && (
          <div className="border-b bg-muted/30">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="flex items-center gap-1">
                      <HomeIcon className="h-3.5 w-3.5" />
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {pathSegments.map((segment, index) => {
                    const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
                    const isLast = index === pathSegments.length - 1;
                    return (
                      <div key={href} className="flex items-center gap-2">
                        <BreadcrumbSeparator>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                          {isLast ? (
                            <BreadcrumbPage className="capitalize font-medium text-primary">
                              {segment}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink href={href} className="capitalize">
                              {segment}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </div>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        )}

        {/* Main Content Area with Entry Animation */}
        <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Separator />
      <Footer />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/login" element={<Layout><Login /></Layout>} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        }
      />

      {/* Repo Scopes */}
      <Route
        path="/repo/:id"
        element={
          <ProtectedRoute>
            <Layout><Repo /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/repo/:owner/:repo"
        element={
          <ProtectedRoute>
            <Layout><RepoInfo /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/repo/:owner/:repo/structure"
        element={
          <ProtectedRoute>
            <Layout><RepoStructure /></Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}