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
import { Menu, X, Home, LayoutDashboard } from "lucide-react";
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
      "text-sm font-medium transition-all relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-primary after:w-0 hover:after:w-full",
      location.pathname === path
        ? "text-primary after:w-full"
        : "text-muted-foreground hover:text-foreground"
    );

  const links = [
    { label: "Home", path: "/", icon: <Home className="inline w-4 h-4 mr-1" /> },
    ...(user ? [{ label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="inline w-4 h-4 mr-1" /> }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-lg shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-gray-900 dark:text-white transition-transform hover:scale-105 hover:animate-pulse"
        >
          RepoSensei
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link key={link.path} to={link.path} className={navLinkClass(link.path)}>
              {link.icon}
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
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button asChild size="sm" variant="outline">
                <Link to="/login">Login</Link>
              </Button>
            </motion.div>
          )}

          {!loading && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Avatar className="cursor-pointer w-10 h-10">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </motion.div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-52 motion-safe:animate-fadeIn"
              >
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
          className="md:hidden p-2 rounded hover:bg-muted/20 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden fixed top-16 left-0 bottom-0 w-64 bg-background border-r border-border shadow-lg z-40 flex flex-col p-6 gap-6"
          >
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={navLinkClass(link.path)}
                onClick={() => setMobileOpen(false)}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            <ModeToggle />

            {!user && (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="mt-auto"
              >
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
