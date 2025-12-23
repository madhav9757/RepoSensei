import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Github, ChevronRight, ExternalLink } from "lucide-react";

export default function RepoHeader({ owner, repo }) {
  return (
    <header className="shrink-0 border-b bg-card/30 backdrop-blur-md px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/5 rounded-lg border border-primary/10">
            <Github size={18} className="text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <span>{owner}</span>
              <ChevronRight size={10} />
              <span className="text-primary">{repo}</span>
            </div>
            <h1 className="text-lg font-bold tracking-tight leading-tight">File Explorer</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="h-6 text-[10px] font-mono px-2">main</Badge>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <Button variant="outline" size="sm" className="h-8 text-xs gap-2">
            <ExternalLink size={14} /> GitHub
          </Button>
        </div>
      </div>
    </header>
  );
}
