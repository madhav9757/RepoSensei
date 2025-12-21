import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import clsx from "clsx";
import { ModeToggle } from "../ui/mode-toggle";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const { user, loading, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  const navLinkClass = (path) =>
    clsx(
      "text-sm font-medium transition-colors",
      location.pathname === path
        ? "text-primary"
        : "text-muted-foreground hover:text-foreground"
    );

  const links = [
    { label: "Home", path: "/" },
    ...(user ? [{ label: "Dashboard", path: "/dashboard" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          RepoSensei
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link key={link.path} to={link.path} className={navLinkClass(link.path)}>
              {link.label}
            </Link>
          ))}

          {/* Mode Toggle */}
          <ModeToggle />
        </nav>

        {/* Auth / Avatar */}
        <div className="hidden md:flex items-center gap-4">
          {loading && (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          )}

          {!loading && !user && (
            <Button asChild size="sm" variant="outline">
              <Link to="/login">Login</Link>
            </Button>
          )}

          {!loading && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer w-10 h-10">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-52">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.username}
                  </p>
                  <p className="text-xs text-muted-foreground">Logged in</p>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded hover:bg-muted/20"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-background border-t border-border overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-4">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={navLinkClass(link.path)}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <ModeToggle />

              {!user && (
                <Button asChild size="sm" variant="outline">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    Login
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
