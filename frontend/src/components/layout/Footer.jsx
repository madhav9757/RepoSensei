import { Github, Twitter, Cpu } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background/50 backdrop-blur-sm">
      <div className="container max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Brand & Status */}
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-muted-foreground">
            © {new Date().getFullYear()} <span className="text-foreground">RepoSensei</span>
          </p>
          <Separator orientation="vertical" className="h-4 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
              Systems Operational
            </span>
          </div>
        </div>

        {/* Right Side: Quick Links */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
             <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-mono font-medium opacity-60">
               OSS
             </Badge>
          </div>
          
          <nav className="flex items-center gap-3">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <Separator orientation="vertical" className="h-4" />
            <a 
              href="/privacy" 
              className="text-xs font-medium text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
            >
              Privacy
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}