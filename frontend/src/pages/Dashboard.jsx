"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Star,
  GitBranch,
  Activity,
  Folder,
  BarChart3,
  History,
  ArrowUpRight,
  ChevronRight,
  Bell,
  RefreshCw,
  LayoutGrid,
  Box,
  Settings2,
  Zap,
  Github
} from "lucide-react";

import useAuthStore from "@/store/authStore";
import useRepoStore from "@/store/useRepoStore";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import Repo from "./repo/Repo";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const { repos, fetchUserRepos, loading: reposLoading } = useRepoStore();

  useEffect(() => {
    fetchUserRepos();
  }, [fetchUserRepos]);

  const stats = useMemo(() => {
    const totalStars = repos.reduce((a, r) => a + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((a, r) => a + (r.forks_count || 0), 0);
    const mostStarred = [...repos].sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))[0];
    return { totalStars, totalForks, mostStarred };
  }, [repos]);

  if (!user) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Activity className="h-10 w-10 text-primary animate-pulse" />
            <div className="absolute inset-0 h-10 w-10 animate-ping rounded-full bg-primary/20" />
          </div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Waking up Sensei...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-10 pb-20"
      >
        {/* Header / Hero Section */}
        <section className="relative overflow-hidden rounded-3xl border bg-card/30 p-8 md:p-12">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-none py-1">
                  <Zap size={12} className="mr-1 fill-current" />
                  v2.4 Pro
                </Badge>
                <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">Account Active</span>
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                  Welcome back, <span className="text-primary italic">{user.username}</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-lg">
                  Your codebase intelligence dashboard is ready. We've indexed {repos.length} repositories for analysis.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button onClick={() => fetchUserRepos()} className="rounded-full px-6 gap-2 h-11">
                  <RefreshCw className={reposLoading ? "animate-spin" : ""} size={16} />
                  Sync Repositories
                </Button>
                <Button variant="outline" className="rounded-full px-6 h-11 gap-2">
                  <Settings2 size={16} />
                  Preferences
                </Button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="hidden lg:block">
              <div className="relative p-1 rounded-full bg-gradient-to-br from-primary/20 via-border to-transparent">
                <Avatar className="h-32 w-32 border-4 border-background">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-3xl font-bold bg-muted">{user.username?.[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-background border rounded-2xl p-3 shadow-xl">
                  <Github className="text-primary" size={20} />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Repos"
            value={repos.length}
            icon={<Folder className="h-5 w-5 text-blue-500" />}
            description="Repositories connected"
          />
          <StatCard
            title="Global Stars"
            value={stats.totalStars}
            icon={<Star className="h-5 w-5 text-amber-500" />}
            description="Across all projects"
          />
          <StatCard
            title="Total Forks"
            value={stats.totalForks}
            icon={<GitBranch className="h-5 w-5 text-indigo-500" />}
            description="Impact & Reach"
          />
          <StatCard
            title="Top Performer"
            value={stats.mostStarred?.name || "N/A"}
            icon={<BarChart3 className="h-5 w-5 text-emerald-500" />}
            isCompact
            description="Most starred repository"
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-muted/50 p-1 h-12 w-fit">
            <TabsTrigger value="overview" className="gap-2 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <LayoutGrid size={16} />
              Overview
            </TabsTrigger>
            <TabsTrigger value="repos" className="gap-2 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Box size={16} />
              Repositories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 pt-4">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2 overflow-hidden border-border/50 bg-card/50">
                <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20 py-4">
                  <div>
                    <CardTitle className="text-lg font-bold">Codebase Health</CardTitle>
                    <CardDescription>Aggregate quality metrics</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                    <ArrowUpRight size={18} />
                  </Button>
                </CardHeader>
                <CardContent className="grid gap-10 md:grid-cols-2 p-8">
                  <div className="space-y-8">
                    <ProgressMetric label="Architecture Integrity" value={78} color="bg-blue-500" />
                    <ProgressMetric label="Documentation Score" value={92} color="bg-emerald-500" />
                    <ProgressMetric label="Complexity Index" value={45} color="bg-amber-500" inverse />
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-primary/[0.03] border border-primary/10 p-8 text-center">
                    <div className="relative">
                      <div className="text-7xl font-black text-primary drop-shadow-sm">A+</div>
                      <div className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                        <Zap size={16} fill="white" />
                      </div>
                    </div>
                    <p className="mt-4 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Overall Rating</p>
                    <Separator className="my-6 w-12" />
                    <p className="text-sm text-balance leading-relaxed text-muted-foreground">
                      Your code quality is <span className="font-bold text-foreground">15% higher</span> than the average RepoSensei user.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50">
                <CardHeader className="border-b bg-muted/20 py-4">
                  <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                  <CardDescription>Live tracking from GitHub</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[360px]">
                    <div className="divide-y divide-border/40">
                      {[1, 2, 3, 4, 5, 6, 7].map((_, i) => (
                        <div
                          key={i}
                          className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/30 cursor-pointer"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted group-hover:bg-primary/10 transition-colors">
                            <Activity size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <div className="flex-1 space-y-1 min-w-0">
                            <p className="text-sm font-bold truncate">
                              {repos[i % repos.length]?.name || "System Indexing"}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                              <History size={12} />
                              {i * 12 + 8} hours ago
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-muted-foreground/30 group-hover:translate-x-1 transition-transform" />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="repos" className="space-y-4 pt-4">
            <Repo />
          </TabsContent>
        </Tabs>
      </motion.div>
    </TooltipProvider>
  );
}

function StatCard({ title, value, icon, description, isCompact = false }) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="overflow-hidden border-border/50 bg-card/50 transition-all hover:border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-xl bg-muted p-2.5">
              {icon}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
              {title}
            </p>
            <div className={cn("font-black tracking-tight", isCompact ? "text-xl truncate" : "text-3xl")}>
              {value}
            </div>
          </div>
          <p className="mt-4 text-[11px] font-medium text-muted-foreground/60 italic">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ProgressMetric({ label, value, color, inverse = false }) {
  // For 'inverse', lower is better (complexity)
  const displayValue = inverse ? 100 - value : value;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-[13px] font-bold tracking-tight">{label}</span>
        <span className="text-[11px] font-black font-mono text-muted-foreground">{displayValue}%</span>
      </div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${displayValue}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full transition-all", color)}
        />
      </div>
    </div>
  );
}
