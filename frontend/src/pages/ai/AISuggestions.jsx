import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSuggestions } from "@/api/suggestions";
import { 
  AlertTriangle, 
  FileCode2, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Layers,
  Info,
  ArrowUpRight
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function RepoAISuggestions({ owner, repo }) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!owner || !repo) return;
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getSuggestions({ owner, repo, goal: "Improve code quality" });
        setSuggestions(res.suggestions || []);
      } catch (err) {
        setError("Failed to load AI suggestions.");
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, [owner, repo]);

  if (loading) return <AISkeletonGrid />;

  if (error) {
    return (
      <div className="mt-6 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-destructive">
        <AlertTriangle className="h-4 w-4" />
        <p className="text-xs font-medium">{error}</p>
      </div>
    );
  }

  return (
    <section className="mt-8 space-y-4">
      {/* Header - Scaled Down */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-md">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">AI Insights</h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              Automated Audit
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="text-[10px] h-5 rounded-md">
          {suggestions.length} Issues Found
        </Badge>
      </div>

      <Separator className="opacity-50" />

      {/* 2-Column Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {suggestions.length > 0 ? (
            suggestions.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-200">
                  <CardContent className="p-3 space-y-3">
                    {/* Top Row: File & Badges */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileCode2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-[11px] font-mono text-foreground/70 truncate">
                          {item.file}
                        </span>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <PriorityBadge priority={item.priority} />
                      </div>
                    </div>

                    {/* Suggestion Text - Compact */}
                    <p className="text-[12px] leading-snug text-muted-foreground line-clamp-2 group-hover:text-foreground transition-colors">
                      {item.suggestion}
                    </p>

                    {/* Footer Row */}
                    <div className="flex items-center justify-between pt-1">
                      <TypeBadge type={item.type} />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] gap-1 hover:text-primary">
                              Solution <ArrowUpRight className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="text-[10px]">Analyze code block</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed py-12">
              <Layers className="h-6 w-6 text-muted-foreground/30" />
              <p className="mt-2 text-[11px] text-muted-foreground uppercase tracking-widest font-bold">No Issues Detected</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* -------------------- Refined Mini Badges -------------------- */

function PriorityBadge({ priority }) {
  const p = priority.toLowerCase();
  const styles = {
    high: "bg-red-500/10 text-red-600 border-red-200/50",
    medium: "bg-amber-500/10 text-amber-600 border-amber-200/50",
    low: "bg-emerald-500/10 text-emerald-600 border-emerald-200/50",
  };

  const icons = {
    high: ShieldCheck,
    medium: Zap,
    low: Info,
  };

  const Icon = icons[p] || Info;

  return (
    <Badge variant="outline" className={`h-4 text-[9px] px-1.5 gap-1 border ${styles[p] || styles.low}`}>
      <Icon className="h-2.5 w-2.5" />
      {priority}
    </Badge>
  );
}

function TypeBadge({ type }) {
  return (
    <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-tighter">
      {type}
    </span>
  );
}

function AISkeletonGrid() {
  return (
    <div className="mt-8 space-y-4">
      <div className="flex gap-4 items-center">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}