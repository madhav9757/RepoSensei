import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import useRepoStore from "@/store/useRepoStore";
import AISuggestions from "../ai/AISuggestions";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Star,
  GitBranch,
  AlertCircle,
  Code2,
  Github,
  Activity,
  ShieldCheck,
  ChevronRight,
  Zap,
  RefreshCw,
  Calendar,
  History,
  Lock,
  Unlock,
  ExternalLink,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function RepoInfo() {
  const { owner, repo } = useParams();
  const { selectedRepo, fetchRepoDetails, loading, error } = useRepoStore();

  useEffect(() => {
    fetchRepoDetails(owner, repo);
  }, [owner, repo, fetchRepoDetails]);

  const languages = useMemo(() => {
    if (!selectedRepo?.languages) return [];
    const total = Object.values(selectedRepo.languages).reduce(
      (a, b) => a + b,
      0,
    );
    return Object.entries(selectedRepo.languages)
      .map(([name, value]) => ({
        name,
        percent: parseFloat(((value / total) * 100).toFixed(1)),
        color: getLangColor(name),
      }))
      .sort((a, b) => b.percent - a.percent);
  }, [selectedRepo]);

  if (loading) return <RepoLoadingSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full text-center px-6">
        <AlertCircle className="w-10 h-10 text-muted-foreground/40 mb-4" />
        <h2 className="text-lg font-bold tracking-tight mb-2">
          Analysis Failed
        </h2>
        <p className="text-xs text-muted-foreground max-w-xs mb-6">{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
          className="rounded-lg gap-2 tracking-tight"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Retry Sync
        </Button>
      </div>
    );
  }

  if (!selectedRepo) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col lg:flex-row h-screen w-full overflow-hidden bg-background"
      >
        {/* --- LEFT SIDEBAR: REPO INFO (COMPACT) --- */}
        <aside className="w-full lg:w-[320px] xl:w-[380px] h-full overflow-y-auto border-r border-border/50 bg-card/5 flex flex-col p-6 space-y-8 scrollbar-none">
          {/* Top Breadcrumb & Actions */}
          <div className="space-y-6">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground hover:text-foreground transition-all uppercase tracking-widest group"
            >
              <ChevronLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
              All Repositories
            </Link>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight truncate flex-1">
                  {selectedRepo.name}
                </h1>
                <Badge
                  variant="secondary"
                  className="bg-muted/50 text-muted-foreground border-none text-[9px] h-4"
                >
                  {selectedRepo.private ? "Private" : "Public"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed italic opacity-80 line-clamp-3">
                {selectedRepo.description ||
                  "Active development environment for managed codebase analysis."}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                asChild
                size="sm"
                className="h-8 px-3 text-[10px] font-bold gap-1.5 flex-1"
              >
                <Link to={`/repo/${owner}/${repo}/structure`}>
                  <Code2 className="h-3 w-3" /> Source
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-[10px] font-bold gap-1.5 flex-1"
                onClick={() => window.open(selectedRepo.html_url, "_blank")}
              >
                <Github className="h-3 w-3" /> GitHub
              </Button>
            </div>
          </div>

          <div className="h-px bg-border/40" />

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <StatSmall
              label="Stars"
              value={selectedRepo.stargazers_count}
              icon={<Star className="h-3 w-3" />}
            />
            <StatSmall
              label="Forks"
              value={selectedRepo.forks_count}
              icon={<GitBranch className="h-3 w-3" />}
            />
            <StatSmall
              label="Issues"
              value={selectedRepo.open_issues_count}
              icon={<AlertCircle className="h-3 w-3" />}
            />
            <StatSmall
              label="Watchers"
              value={selectedRepo.subscribers_count}
              icon={<Activity className="h-3 w-3" />}
            />
          </div>

          {/* Technology Distribution */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
              Technology Distribution
            </h4>
            <div className="space-y-4">
              <div className="flex h-1 w-full rounded-full overflow-hidden bg-muted/40">
                {languages.map((lang) => (
                  <div
                    key={lang.name}
                    style={{
                      width: `${lang.percent}%`,
                      backgroundColor: lang.color,
                    }}
                    className="h-full opacity-90"
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {languages.map((lang) => (
                  <div key={lang.name} className="flex items-center gap-2">
                    <div
                      className="h-1.5 w-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: lang.color }}
                    />
                    <span className="text-[10px] font-medium truncate">
                      {lang.name}
                    </span>
                    <span className="text-[9px] font-mono text-muted-foreground ml-auto">
                      {lang.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Infrastructure Box */}
          <div className="p-4 rounded-lg border bg-muted/5 space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Registry Details
            </h4>
            <div className="space-y-3">
              <DetailSmall
                label="Default Branch"
                value={selectedRepo.default_branch}
              />
              <DetailSmall
                label="License"
                value={selectedRepo.license?.spdx_id || "None"}
              />
              <DetailSmall
                label="Storage"
                value={`${(selectedRepo.size / 1024).toFixed(1)} MB`}
              />
              <DetailSmall
                label="Last Push"
                value={new Date(selectedRepo.pushed_at).toLocaleDateString()}
              />
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-border/40">
            <div className="flex items-center justify-between p-3 rounded-lg border border-dashed border-emerald-500/20 bg-emerald-500/5">
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter flex items-center gap-1.5">
                  <ShieldCheck className="h-3 w-3" /> Security Radar
                </p>
                <p className="text-[9px] text-muted-foreground">
                  Scan confirmed stable
                </p>
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </aside>

        {/* --- RIGHT SECTION: AI SUGGESTIONS --- */}
        <main className="flex-1 h-full overflow-y-auto bg-background/50 flex flex-col scrollbar-thin scrollbar-thumb-border">
          <div className="max-w-6xl w-full mx-auto px-8 py-10 space-y-8">
            <header className="flex items-center justify-between pb-4 border-b">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight">
                  AI Intelligence Audit
                </h2>
                <p className="text-xs text-muted-foreground">
                  Deep vector analysis of {owner}/{selectedRepo.name}{" "}
                  architecture
                </p>
              </div>
              <div className="flex gap-2">
                <Badge
                  variant="outline"
                  className="text-[10px] font-bold border-primary/20 bg-primary/5 text-primary"
                >
                  <Zap className="h-3 w-3 mr-1" /> Vector Model Enabled
                </Badge>
              </div>
            </header>

            {/* Project Health Overview */}
            <motion.section
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <HealthModule
                title="Security Posture"
                score="A+"
                detail="No critical CVEs found"
                color="text-emerald-500"
              />
              <HealthModule
                title="Performance"
                score="B"
                detail="Bottlenecks in logic"
                color="text-amber-500"
              />
              <HealthModule
                title="Maintainability"
                score="A-"
                detail="Strong pattern usage"
                color="text-sky-500"
              />
            </motion.section>

            <motion.div variants={itemVariants} className="pb-20">
              <AISuggestions owner={owner} repo={repo} />
            </motion.div>
          </div>
        </main>
      </motion.div>
    </TooltipProvider>
  );
}

function HealthModule({ title, score, detail, color }) {
  return (
    <div className="p-5 border rounded-xl bg-card/10 space-y-3">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
        {title}
      </h4>
      <div className="flex items-end gap-3">
        <span className={cn("text-3xl font-black leading-none", color)}>
          {score}
        </span>
        <span className="text-[11px] font-medium text-muted-foreground mb-1">
          {detail}
        </span>
      </div>
      <div className="h-1 w-full bg-muted/40 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full bg-current opacity-70", color)}
          style={{ width: score.includes("A") ? "90%" : "70%" }}
        />
      </div>
    </div>
  );
}

/* --- MINI HELPERS --- */

function StatSmall({ label, value, icon }) {
  return (
    <div className="p-3 border rounded-lg bg-card/10 space-y-2 hover:border-primary/20 transition-all">
      <div className="flex items-center justify-between text-muted-foreground/50">
        <span className="text-[9px] font-bold uppercase tracking-tight">
          {label}
        </span>
        {icon}
      </div>
      <p className="text-sm font-bold truncate">
        {value?.toLocaleString() || 0}
      </p>
    </div>
  );
}

function DetailSmall({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[10px] text-muted-foreground font-medium">
        {label}
      </span>
      <span className="text-[10px] font-bold truncate">{value}</span>
    </div>
  );
}

const getLangColor = (lang) => {
  const colors = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Python: "#3572A5",
    Rust: "#dea584",
    Go: "#00ADD8",
    Ruby: "#701516",
    Java: "#b07219",
    Swift: "#ffac45",
    PHP: "#4F5D95",
    "C++": "#f34b7d",
    C: "#555555",
    None: "#ccc",
  };
  return colors[lang] || "#888";
};

function RepoLoadingSkeleton() {
  return (
    <div className="flex h-screen w-full animate-pulse">
      <div className="w-[320px] border-r border-border p-6 space-y-10">
        <Skeleton className="h-4 w-24" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
      <div className="flex-1 p-10 space-y-10">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-full w-full rounded-2xl" />
      </div>
    </div>
  );
}
