import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import clsx from "clsx";

export default function Navbar() {
  const { user, loading, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        {/* LEFT - LOGO */}
        <Link to="/" className="text-xl font-bold tracking-tight">
          RepoSensei
        </Link>

        {/* CENTER - NAV LINKS */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className={navLinkClass("/")}>
            Home
          </Link>

          {user && (
            <Link to="/dashboard" className={navLinkClass("/dashboard")}>
              Dashboard
            </Link>
          )}
        </nav>

        {/* RIGHT - AUTH */}
        <div className="flex items-center gap-4">
          {loading && (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          )}

          {!loading && !user && (
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}

          {!loading && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback>
                    {user.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-52">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{user.username}</p>
                  <p className="text-xs text-muted-foreground">
                    Logged in
                  </p>
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
      </div>
    </header>
  );
}
