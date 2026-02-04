import { useEffect, useState, useMemo } from "react";
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
  Boxes,
  FileSearch,
  BookOpen,
  Activity,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";

export default function RepoAISuggestions({ owner, repo }) {
  const navigate = useNavigate();
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [goal, setGoal] = useState("General code quality audit");

  const {
    loading,
    error,
    fetchSuggestions,
    refreshSuggestions,
    getSuggestionsForRepo,
    clearSuggestions,
  } = useSuggestionsStore();

  const suggestions = getSuggestionsForRepo(owner, repo);

  useEffect(() => {
    if (owner && repo) {
      fetchSuggestions(owner, repo, goal);
    }
  }, [owner, repo, fetchSuggestions]);

  const handleRefresh = () => {
    if (owner && repo) {
      refreshSuggestions(owner, repo, goal);
    }
  };

  const categorizedSuggestions = useMemo(() => {
    const categories = {
      security: {
        title: "Security & Vulnerabilities",
        icon: ShieldCheck,
        items: [],
        color: "text-red-500",
      },
      performance: {
        title: "Performance Optimization",
        icon: Zap,
        items: [],
        color: "text-amber-500",
      },
      architecture: {
        title: "Architectural Pattern",
        icon: Boxes,
        items: [],
        color: "text-blue-500",
      },
      documentation: {
        title: "Documentation & Readability",
        icon: BookOpen,
        items: [],
        color: "text-emerald-500",
      },
      tooling: {
        title: "Tooling & Infrastructure",
        icon: Terminal,
        items: [],
        color: "text-indigo-500",
      },
      other: {
        title: "Other Improvements",
        icon: Layers,
        items: [],
        color: "text-slate-500",
      },
    };

    suggestions.forEach((item) => {
      const type = item.type?.toLowerCase() || "other";
      if (categories[type]) {
        categories[type].items.push(item);
      } else {
        categories.other.items.push(item);
      }
    });

    return Object.entries(categories).filter(
      ([_, cat]) => cat.items.length > 0,
    );
  }, [suggestions]);

  if (loading) return <AISkeletonGrid />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-destructive/30 bg-destructive/5 py-12 px-4 text-center">
        <AlertTriangle className="h-6 w-6 text-destructive mb-4" />
        <h3 className="text-sm font-bold uppercase tracking-tight text-destructive">
          Insight Sync Failed
        </h3>
        <p className="mt-1 text-xs text-muted-foreground/80">{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchSuggestions(owner, repo, goal)}
          className="mt-6 h-8 gap-2 border-destructive/20 text-destructive hover:bg-destructive/10"
        >
          <RefreshCcw className="h-3 w-3" /> Retry
        </Button>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return <EmptyState onAudit={handleRefresh} owner={owner} repo={repo} />;
  }

  return (
    <div className="space-y-12">
      {/* Dynamic Filter / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">
              Intelligence Audit Results
            </h2>
            <Badge
              variant="secondary"
              className="bg-primary/5 text-primary border-primary/10 text-[9px] uppercase tracking-widest"
            >
              {suggestions.length} findings
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Comprehensive scan of{" "}
            <span className="text-foreground font-mono">
              {owner}/{repo}
            </span>{" "}
            context
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-[11px] font-bold text-muted-foreground focus:ring-1 focus:ring-primary outline-none"
          >
            <option value="General code quality audit">General Audit</option>
            <option value="Security vulnerabilities check">
              Security Check
            </option>
            <option value="Performance optimization">Performance</option>
            <option value="Documentation and readability">Documentation</option>
            <option value="Refactoring and architecture">Architecture</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="h-9 gap-2 text-[11px] font-bold"
          >
            <RefreshCcw className="h-3.5 w-3.5" /> Regenerate
          </Button>
        </div>
      </div>

      {/* Suggested Sections */}
      <div className="space-y-16">
        {categorizedSuggestions.map(([key, category], catIndex) => (
          <motion.section
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.1 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn("p-2 rounded-lg bg-current/10", category.color)}
              >
                <category.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/80">
                {category.title}
              </h3>
              <div className="flex-1 h-px bg-border/40" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.items.map((item, index) => (
                <SuggestionCard
                  key={`${item.file}-${index}`}
                  item={item}
                  onViewDiff={() => setSelectedSuggestion(item)}
                  onNavigate={() =>
                    navigate(
                      `/repo/${owner}/${repo}/structure?file=${encodeURIComponent(item.file.trim())}`,
                    )
                  }
                />
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* Diff Modal */}
      <AnimatePresence>
        {selectedSuggestion && (
          <CodeDiffViewer
            suggestion={selectedSuggestion}
            onClose={() => setSelectedSuggestion(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SuggestionCard({ item, onViewDiff, onNavigate }) {
  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/20 hover:border-primary/30 transition-all">
      <CardContent className="p-5 flex flex-col h-full justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 truncate">
              <FileCode2 className="h-4 w-4 text-primary shrink-0" />
              <code className="text-[11px] font-mono font-bold text-muted-foreground truncate">
                {item.file}
              </code>
            </div>
            <PriorityBadge priority={item.priority} />
          </div>
          <p className="text-sm font-medium leading-relaxed group-hover:text-foreground transition-colors">
            {item.suggestion}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/30">
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewDiff}
            className="h-7 text-[10px] font-bold gap-1.5 hover:bg-primary/10 hover:text-primary"
          >
            <Code2 className="h-3 w-3" /> View Change
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNavigate}
            className="h-7 text-[10px] font-bold gap-1.5"
          >
            <GitCompare className="h-3 w-3" /> Inspect File
          </Button>
        </div>
      </CardContent>
      <div className="absolute left-0 top-0 h-full w-1 bg-primary/20 group-hover:bg-primary transition-colors" />
    </Card>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    high: "text-red-500 bg-red-500/10 border-red-500/20",
    medium: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    low: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  };
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[8px] font-black uppercase px-1.5 h-4 border",
        styles[priority.toLowerCase()] || styles.medium,
      )}
    >
      {priority}
    </Badge>
  );
}

function EmptyState({ onAudit, owner, repo }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="h-20 w-20 rounded-3xl bg-primary/5 flex items-center justify-center mb-6">
        <Sparkles className="h-10 w-10 text-primary animate-pulse" />
      </div>
      <h3 className="text-xl font-bold tracking-tight">
        Intelligence Engine Ready
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-8 italic">
        Begin an exhaustive technical audit of{" "}
        <span className="text-foreground font-mono">
          {owner}/{repo}
        </span>
        .
      </p>
      <Button
        onClick={onAudit}
        className="h-12 px-10 rounded-xl font-bold gap-2 shadow-xl shadow-primary/20"
      >
        <Zap className="h-4 w-4 fill-current" /> Run Deep-Vector Audit
      </Button>
    </div>
  );
}

function AISkeletonGrid() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="space-y-10">
        {[1, 2].map((s) => (
          <div key={s} className="space-y-6">
            <Skeleton className="h-6 w-48" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
