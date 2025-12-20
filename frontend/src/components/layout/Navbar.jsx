// frontend/src/components/layout/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Home,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Github,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import useStore from "@/store/useThemeStore";          // theme store
import useAuthStore from "@/store/useAuthStore"; // auth store

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* ---------------- THEME ---------------- */
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);

  /* ---------------- AUTH ---------------- */
  const {
    user,
    loading,
    logout,
    githubLogin,
  } = useAuthStore();

  const isAuthenticated = !!user;

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  /* ---------------- NAV DATA ---------------- */
  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
  };

  /* ---------------- RENDER ---------------- */
  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm"
          : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl group">
            <div className="size-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Code2 className="size-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              RepoSensei
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label, icon: Icon }) => {
              const active = isActive(path);
              return (
                <Link key={path} to={path} className="relative">
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="size-4" />
                    {label}
                  </button>
                  {active && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2">
            {/* THEME TOGGLE */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hidden sm:flex"
              aria-label="Toggle theme"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === "light" ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {theme === "light" ? <Moon /> : <Sun />}
              </motion.div>
            </Button>

            {/* AUTH */}
            {!loading && isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="size-8">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 size-4" /> Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <Settings className="mr-2 size-4" /> Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 dark:text-red-400"
                  >
                    <LogOut className="mr-2 size-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              !loading && (
                <Button className="gap-2 hidden sm:flex" onClick={githubLogin}>
                  <Github className="size-4" />
                  Sign In
                </Button>
              )
            )}

            {/* MOBILE TOGGLE */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t"
            >
              <div className="py-4 space-y-1">
                {navLinks.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className="flex items-center gap-3 px-4 py-3 text-sm"
                  >
                    <Icon className="size-5" />
                    {label}
                  </Link>
                ))}

                {!isAuthenticated && !loading && (
                  <Button className="w-full gap-2 mt-4" onClick={githubLogin}>
                    <Github className="size-4" />
                    Sign In with GitHub
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
