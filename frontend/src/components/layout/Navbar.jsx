import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { 
  Menu, 
  X, 
  Home, 
  LayoutDashboard, 
  LogOut, 
  User, 
  Settings, 
  Github, 
  Search 
} from "lucide-react";

// Shadcn Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Logic & Theme
import useAuthStore from "@/store/authStore";
import { ModeToggle } from "../ui/mode-toggle";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { user, loading, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  const links = [
    { label: "Home", path: "/", icon: Home },
    ...(user ? [{ label: "Dashboard", path: "/dashboard", icon: LayoutDashboard }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LEFT: Logo & Desktop Nav */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:rotate-12">
              <Github className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              RepoSensei
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Button
                  key={link.path}
                  variant={isActive ? "secondary" : "ghost"}
                  asChild
                  className={cn(
                    "relative h-9 px-4 transition-colors",
                    isActive ? "text-primary font-semibold" : "text-muted-foreground"
                  )}
                >
                  <Link to={link.path}>
                    <Icon className="mr-2 h-4 w-4" />
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                      />
                    )}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Search Hint (Visual Only) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground border rounded-md bg-muted/50 cursor-not-allowed opacity-70">
            <Search className="h-3.5 w-3.5" />
            <span>Search...</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>

          <ModeToggle />

          <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />

          {loading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 ring-offset-background transition-all hover:ring-2 hover:ring-primary/20">
                  <Avatar className="h-9 w-9 border">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback className="bg-primary/5">{user.username?.[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      github.com/{user.username}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-not-allowed opacity-70">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-not-allowed opacity-70">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="rounded-full px-5">
              <Link to="/login">Login</Link>
            </Button>
          )}

          {/* MOBILE NAV (Sheet) */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <Github className="h-5 w-5" />
                    RepoSensei
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 py-8">
                  {links.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-lg font-medium transition-colors",
                          location.pathname === link.path ? "bg-muted text-primary" : "text-muted-foreground hover:bg-muted/50"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {link.label}
                        {location.pathname === link.path && (
                          <Badge variant="outline" className="ml-auto">Active</Badge>
                        )}
                      </Link>
                    );
                  })}
                </div>
                {user && (
                  <div className="absolute bottom-8 left-6 right-6">
                     <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                     </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}