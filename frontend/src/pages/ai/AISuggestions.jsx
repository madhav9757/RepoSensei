"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useSuggestionsStore from "@/store/useSuggestionsStore";
import {
  AlertTriangle,
  FileCode2,
  Sparkles,
  ShieldCheck,
  Zap,
  Layers,
  Info,
  ChevronRight,
  Terminal,
  RefreshCcw,
  GitCompare,
  ArrowUpRight,
  Code2,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CodeDiffViewer from "@/components/ai/CodeDiffViewer";

export default function RepoAISuggestions({ owner, repo }) {
  const navigate = useNavigate();
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  // Use Zustand store
  const {
    suggestions,
    loading,
    error,
    fetchSuggestions,
    refreshSuggestions,
    clearError
  } = useSuggestionsStore();

  useEffect(() => {
    if (owner && repo) {
      fetchSuggestions(owner, repo);
    }
  }, [owner, repo, fetchSuggestions]);

  const handleRefresh = () => {
    if (owner && repo) {
      refreshSuggestions(owner, repo);
    }
  };

  if (loading) return <AISkeletonGrid />;

  if (error) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-destructive/30 bg-destructive/5 py-12 px-4 text-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-3">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-tight text-destructive">Insight Sync Failed</h3>
        <p className="mt-1 text-xs text-muted-foreground/80">{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchSuggestions}
          className="mt-6 h-8 gap-2 border-destructive/20 text-destructive hover:bg-destructive/10"
        >
          <RefreshCcw className="h-3 w-3" /> Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <section className="mt-10 space-y-8">
      {/* Header Container */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner">
            <Sparkles className="h-5 w-5 text-primary fill-primary/20" />
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-primary/20"
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight">AI Intelligence Insights</h2>
              <Badge variant="secondary" className="h-5 px-1.5 text-[9px] font-black uppercase tracking-widest bg-primary/5 text-primary border-primary/20">
                Live
              </Badge>
            </div>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="h-3 w-3" /> Technical Audit Report
              <span className="opacity-30">•</span>
              <span className="text-primary/70 font-mono italic">v1.4.2-stable</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="h-8 gap-2 text-[11px] font-bold text-muted-foreground hover:text-foreground"
          >
            <RefreshCcw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Analysis
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-muted-foreground hover:text-foreground">
            Archive All
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex h-8 items-center rounded-lg border border-border/50 bg-muted/30 px-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Found: {suggestions.length}</span>
          </div>
        </div>
      </div>

      <Separator className="bg-border/40" />

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {suggestions.length ? (
            suggestions.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="group relative h-full overflow-hidden border-border/40 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="flex h-full flex-col justify-between p-5">
                    <div className="space-y-4">
                      {/* Top Row: File & Priority */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/20">
                            <FileCode2 className="h-4 w-4 text-sky-600 fill-sky-600/10" />
                          </div>
                          <code className="truncate text-[12px] font-mono font-semibold text-muted-foreground transition-colors group-hover:text-sky-600/90">
                            {item.file}
                          </code>
                        </div>
                        <PriorityBadge priority={item.priority} />
                      </div>

                      {/* Content Section */}
                      <div className="space-y-2">
                        <h4 className="text-[13px] font-bold text-foreground/90 group-hover:text-foreground transition-colors">
                          {item.type} Improvement Detected
                        </h4>
                        <p className="text-[12.5px] leading-relaxed text-muted-foreground/90 transition-colors group-hover:text-foreground/80">
                          {item.suggestion}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Row: Metadata & Action */}
                    <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
                      <TypeBadge type={item.type} />

                      <div className="flex items-center gap-2">
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedSuggestion(item)}
                                className="h-8 gap-2 rounded-lg text-[11px] font-bold transition-all hover:bg-primary hover:text-primary-foreground"
                              >
                                <Code2 className="h-3.5 w-3.5" />
                                View Diff
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-foreground text-background text-[10px] font-bold uppercase tracking-wider">
                              View code changes (GitHub-style)
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => navigate(`/repo/${owner}/${repo}/structure?file=${item.file}`)}
                                className="h-8 gap-2 rounded-lg bg-foreground text-[11px] font-bold text-background transition-all hover:bg-primary"
                              >
                                <GitCompare className="h-3.5 w-3.5" />
                                Go to File
                                <ArrowUpRight className="h-3 w-3 opacity-50" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-foreground text-background text-[10px] font-bold uppercase tracking-wider">
                              Navigate to file in repository
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </CardContent>

                  {/* Aesthetic left-border hint */}
                  <div className="absolute left-0 top-0 h-full w-[3px] bg-primary/60 scale-y-0 transition-transform duration-300 group-hover:scale-y-100" />
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/5 py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 shadow-sm">
                <ShieldCheck className="h-7 w-7 text-emerald-500 fill-emerald-500/10" />
              </div>
              <h3 className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-foreground">Codebase Secure</h3>
              <p className="mx-auto mt-2 max-w-[280px] text-[12px] leading-relaxed text-muted-foreground/60">
                Our AI model analyzed the repository and found no immediate architectural vulnerabilities or bottlenecks.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Code Diff Viewer Modal */}
      <AnimatePresence>
        {selectedSuggestion && (
          <CodeDiffViewer
            suggestion={selectedSuggestion}
            onClose={() => setSelectedSuggestion(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------- UI Helpers ---------- */

function PriorityBadge({ priority }) {
  const p = priority.toLowerCase();
  const styles = {
    high: "bg-red-500/10 text-red-600 border-red-500/20 shadow-red-500/5",
    medium: "bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-amber-500/5",
    low: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-emerald-500/5",
  };

  const icons = { high: ShieldCheck, medium: Zap, low: Info };
  const Icon = icons[p] || Info;

  return (
    <Badge
      variant="outline"
      className={`h-5 border-2 px-2 py-0 text-[10px] font-black uppercase tracking-tight shadow-sm ${styles[p]}`}
    >
      <Icon className="mr-1 h-3 w-3 fill-current opacity-80" />
      {priority}
    </Badge>
  );
}

function TypeBadge({ type }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-2.5 py-1.5 transition-colors group-hover:bg-indigo-500/10">
      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700/80">
        {type}
      </span>
    </div>
  );
}

function AISkeletonGrid() {
  return (
    <div className="mt-10 space-y-8">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-44 rounded-2xl shadow-sm" />
        ))}
      </div>
    </div>
  );
}