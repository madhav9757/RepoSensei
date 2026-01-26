import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import useRepoStore from "@/store/useRepoStore";
import AISuggestions from "../ai/AISuggestions";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  GitBranch,
  AlertCircle,
  Code2,
  ExternalLink,
  Github,
  FolderTree,
  Activity,
  ShieldCheck,
  Globe,
  Clock,
  History,
  Terminal,
  ChevronRight,
  Zap,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

export default function RepoInfo() {
  const { owner, repo } = useParams();
  const { selectedRepo, fetchRepoDetails, loading, error } = useRepoStore();

  useEffect(() => {
    fetchRepoDetails(owner, repo);
  }, [owner, repo, fetchRepoDetails]);

  const languages = useMemo(() => {
    if (!selectedRepo?.languages) return [];
    const total = Object.values(selectedRepo.languages).reduce((a, b) => a + b, 0);
    return Object.entries(selectedRepo.languages).map(([name, value]) => ({
      name,
      percent: ((value / total) * 100).toFixed(1),
      color: getLangColor(name)
    })).sort((a, b) => b.percent - a.percent);
  }, [selectedRepo]);

  if (loading) return <RepoLoadingSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center px-6">
        <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-destructive" />
        </div>
        <h2 className="text-2xl font-black tracking-tight mb-2">Technical Error</h2>
        <p className="text-muted-foreground max-w-sm mb-8">{error}</p>
        <Button variant="outline" className="rounded-full px-8 h-12" onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Recursive Retry
        </Button>
      </div>
    );
  }

  if (!selectedRepo) return null;

  return (
    <TooltipProvider>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Dynamic Header */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4">
          <motion.div variants={itemVariants} className="space-y-4 flex-1">
            <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
              <Globe className="w-3.5 h-3.5" />
              <span>{owner}</span>
              <span className="opacity-30">/</span>
              <span className="text-primary">{selectedRepo.name}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter">{selectedRepo.name}</h1>
              <div className="flex gap-2">
                <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-none">
                  {selectedRepo.private ? "Private" : "Public"}
                </Badge>
                {selectedRepo.language && (
                  <Badge variant="outline" className="px-3 py-1 font-bold">
                    {selectedRepo.language}
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {selectedRepo.description || "No description provided for this technical resource."}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-3 shrink-0">
            <Button asChild size="lg" className="h-12 px-6 rounded-xl gap-2 shadow-lg shadow-primary/20">
              <Link to={`/repo/${owner}/${repo}/structure`}>
                <FolderTree className="w-4 h-4" />
                Explore Files
              </Link>
            </Button>
            <Button variant="secondary" size="lg" className="h-12 px-6 rounded-xl gap-2 border bg-card/50 hover:bg-card" onClick={() => window.open(selectedRepo.html_url, "_blank")}>
              <Github className="w-4 h-4" />
              View Source
            </Button>
          </motion.div>
        </header>

        <Separator className="opacity-50" />

        {/* Language Bar */}
        {languages.length > 0 && (
          <motion.div variants={itemVariants} className="space-y-3">
            <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-muted">
              {languages.map((lang, i) => (
                <div
                  key={lang.name}
                  style={{ width: `${lang.percent}%`, backgroundColor: lang.color }}
                  className="h-full transition-all"
                  title={`${lang.name}: ${lang.percent}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {languages.map(lang => (
                <div key={lang.name} className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: lang.color }} />
                  <span className="text-[11px] font-bold uppercase tracking-widest">{lang.name}</span>
                  <span className="text-[10px] font-medium text-muted-foreground">{lang.percent}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <motion.div variants={itemVariants}>
            <TabsList className="h-12 p-1 bg-muted/30 border">
              <TabsTrigger value="overview" className="gap-2 px-8 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Terminal className="w-4 h-4" />
                Metrics
              </TabsTrigger>
              <TabsTrigger value="insights" className="gap-2 px-8 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Zap className="w-4 h-4" />
                AI Analysis
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="overview" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Stats Column */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard icon={<Star className="w-4 h-4 text-amber-500" />} label="Stars" value={selectedRepo.stargazers_count} />
                  <StatCard icon={<GitBranch className="w-4 h-4 text-blue-500" />} label="Forks" value={selectedRepo.forks_count} />
                  <StatCard icon={<AlertCircle className="w-4 h-4 text-rose-500" />} label="Issues" value={selectedRepo.open_issues_count} />
                  <StatCard icon={<Activity className="w-4 h-4 text-emerald-500" />} label="Watchers" value={selectedRepo.subscribers_count} />
                </div>

                <Card className="border-border/50 bg-card/30">
                  <CardHeader className="py-4 border-b">
                    <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                      <Info size={14} className="text-primary" />
                      System Metadata
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <MetaItem icon={<Clock />} label="Last Push" value={new Date(selectedRepo.pushed_at).toLocaleDateString()} />
                      <MetaItem icon={<History />} label="License" value={selectedRepo.license?.name || "No License"} />
                    </div>
                    <div className="space-y-6">
                      <MetaItem label="Default Branch" value={selectedRepo.default_branch} isMono />
                      <MetaItem label="Created At" value={new Date(selectedRepo.created_at).toLocaleDateString()} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Side Actions Column */}
              <div className="space-y-6">
                <Card className="bg-foreground text-background border-none overflow-hidden group">
                  <CardHeader className="relative z-10 p-6">
                    <div className="absolute -top-10 -right-10 h-32 w-32 bg-background/10 rounded-full blur-2xl group-hover:bg-background/20 transition-colors" />
                    <CardTitle className="text-lg font-black tracking-tight">Generate Report</CardTitle>
                    <CardDescription className="text-background/60">
                      Export complete codebase analysis to PDF format.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <Button variant="secondary" className="w-full h-11 font-bold group">
                      Download Intelligence
                      <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>

                <div className="p-6 rounded-2xl border border-dashed border-primary/20 bg-primary/5">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="text-primary" size={16} />
                    <span className="text-[11px] font-black uppercase tracking-widest">Security Status</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Our AI scanners have verified 34 dependencies. No Critical vulnerabilities detected in the latest scan.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="mt-8">
            <AISuggestions owner={owner} repo={repo} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </TooltipProvider>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
      <Card className="border-border/50 bg-card/50 transition-all hover:border-primary/20">
        <CardContent className="p-5 flex flex-col gap-3">
          <div className="h-9 w-9 bg-muted rounded-xl flex items-center justify-center">{icon}</div>
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
            <p className="text-2xl font-black tracking-tighter">{value?.toLocaleString() || 0}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MetaItem({ icon, label, value, isMono }) {
  return (
    <div className="space-y-2">
      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-1.5">
        {icon && <span className="text-primary/70">{icon}</span>} {label}
      </span>
      <p className={cn(
        "text-sm font-bold",
        isMono && "font-mono bg-muted/50 px-2 py-1 rounded w-fit text-primary"
      )}>
        {value}
      </p>
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
    None: "#ccc"
  };
  return colors[lang] || "#888";
};

function RepoLoadingSkeleton() {
  return (
    <div className="space-y-12 py-8">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div className="space-y-4 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="flex gap-4"><Skeleton className="h-12 w-32 rounded-xl" /><Skeleton className="h-12 w-32 rounded-xl" /></div>
      </div>
      <Skeleton className="h-3 w-full rounded-full" />
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
      </div>
      <Skeleton className="h-64 w-full rounded-3xl" />
    </div>
  );
}
