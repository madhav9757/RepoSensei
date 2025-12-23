"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Github, Star, GitBranch, Activity, Folder, BarChart2, Zap,
  Settings, Info, TrendingUp, History, ArrowUpRight,
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

import Repo from "./repo/Repo";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const repos = useRepoStore((s) => s.repos);

  useEffect(() => {
    if (!user) fetchMe();
  }, [user, fetchMe]);

  if (!user) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-3">
        <Activity className="h-8 w-8 animate-pulse text-primary" />
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
          Syncing Environment
        </p>
      </div>
    );
  }

  const totalStars = repos.reduce((a, r) => a + r.stars, 0);
  const totalForks = repos.reduce((a, r) => a + r.forks, 0);
  const mostStarred = [...repos].sort((a, b) => b.stars - a.stars)[0];

  return (
    <TooltipProvider>
      <div className="mx-auto max-w-6xl space-y-5 pb-6 pt-2">
        
        {/* --- COMPACT HEADER --- */}
        <header className="flex items-center justify-between">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="h-4 text-[9px] uppercase font-bold px-1.5 rounded-sm">
                Pro
              </Badge>
              <span className="text-[10px] text-muted-foreground tabular-nums">v2.4.0-stable</span>
            </div>
            <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
              System Dashboard <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </h1>
          </motion.div>

          <div className="flex gap-1.5">
            <Button variant="outline" size="sm" className="h-7 text-[11px] px-2.5 gap-1.5">
              <History className="h-3 w-3" /> Logs
            </Button>
            <Button size="sm" className="h-7 text-[11px] px-2.5 gap-1.5 bg-primary hover:bg-primary/90">
              <Zap className="h-3 w-3 fill-current" /> Global Scan
            </Button>
          </div>
        </header>

        <Separator className="opacity-50" />

        {/* --- TIGHT STATS GRID --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard title="Total Repos" value={repos.length} icon={<Folder size={14} />} trend="+2" />
          <StatCard title="Stars" value={totalStars} icon={<Star size={14} />} trend="+12%" />
          <StatCard title="Forks" value={totalForks} icon={<GitBranch size={14} />} trend="+5" />
          <StatCard title="Top Build" value={mostStarred?.name || "N/A"} icon={<TrendingUp size={14} />} isCompact />
        </div>

        {/* --- CONTENT TABS --- */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="h-8 bg-transparent p-0 gap-4 mb-4 border-b w-full justify-start rounded-none">
            <TabsTrigger value="overview" className="text-[11px] uppercase tracking-wider font-bold h-8 px-0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none">
              Overview
            </TabsTrigger>
            <TabsTrigger value="repos" className="text-[11px] uppercase tracking-wider font-bold h-8 px-0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none">
              Projects
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-[11px] uppercase tracking-wider font-bold h-8 px-0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none">
              Config
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* SYSTEM INSIGHTS */}
              <Card className="md:col-span-2 border-border/50 shadow-none">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Quality Metrics</CardTitle>
                  <BarChart2 className="h-3.5 w-3.5 text-muted-foreground/50" />
                </CardHeader>
                <CardContent className="p-4 pt-2 grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <ProgressCard label="Logic" value={75} color="bg-blue-500" />
                    <ProgressCard label="Docs" value={90} color="bg-emerald-500" />
                    <ProgressCard label="Tests" value={65} color="bg-amber-500" />
                  </div>
                  <div className="flex flex-col items-center justify-center border-l border-dashed border-border pl-6">
                    <div className="text-3xl font-black text-primary italic">A+</div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1">Health Grade</p>
                  </div>
                </CardContent>
              </Card>

              {/* ACTIVITY FEED */}
              <Card className="border-border/50 shadow-none">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Latest Event</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <ScrollArea className="h-[105px]">
                    <div className="space-y-3">
                      {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex gap-2.5">
                          <div className="h-1.5 w-1.5 mt-1 rounded-full bg-primary shrink-0" />
                          <div className="space-y-0.5">
                            <p className="text-[11px] font-semibold leading-none truncate w-[140px]">Sync: {mostStarred?.name}</p>
                            <p className="text-[9px] text-muted-foreground uppercase font-medium">45m ago</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

            </div>
          </TabsContent>

          <TabsContent value="repos" className="outline-none">
            <Repo />
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}

/* ---------- INTERNAL UI COMPONENTS (MINIFIED) ---------- */

function StatCard({ title, value, icon, trend, isCompact }) {
  return (
    <Card className="border-border/40 shadow-none group hover:border-primary/50 transition-colors">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[9px] font-black uppercase text-muted-foreground tracking-tighter">{title}</p>
          <div className="text-muted-foreground group-hover:text-primary transition-colors">{icon}</div>
        </div>
        <div className="flex items-end gap-2">
          <div className={`font-bold tabular-nums ${isCompact ? "text-[13px] truncate" : "text-lg"}`}>
            {value}
          </div>
          {trend && (
            <span className="text-[9px] font-bold text-emerald-500 mb-0.5">{trend}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressCard({ label, value, color }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
        <span className="text-muted-foreground/70">{label}</span>
        <span>{value}%</span>
      </div>
      <Progress value={value} className={`h-1 ${color}`} />
    </div>
  );
}