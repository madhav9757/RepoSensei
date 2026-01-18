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
  Search,
  Bell,
  RefreshCw,
  LayoutGrid,
  Box,
  Settings2,
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
import { Input } from "@/components/ui/input";

import Repo from "./repo/Repo";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const repos = useRepoStore((s) => s.repos);

  useEffect(() => {
    if (!user) fetchMe();
  }, [user, fetchMe]);

  const stats = useMemo(() => {
    const totalStars = repos.reduce((a, r) => a + r.stars, 0);
    const totalForks = repos.reduce((a, r) => a + r.forks, 0);
    const mostStarred = [...repos].sort((a, b) => b.stars - a.stars)[0];
    return { totalStars, totalForks, mostStarred };
  }, [repos]);

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Activity className="h-6 w-6 text-muted-foreground animate-pulse" />
          <p className="text-sm text-muted-foreground">Loading dashboard</p>
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
        className="min-h-screen bg-background"
      >
        <div className="container mx-auto max-w-7xl p-6 space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <motion.div variants={itemVariants} className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Live
                </Badge>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Monitor your repositories and activity
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Button size="sm" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Sync
              </Button>
            </motion.div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Repositories"
              value={repos.length}
              icon={<Folder className="h-4 w-4 text-blue-500" />}
              trend="+2.4%"
              description="Total projects"
            />
            <StatCard
              title="Stars"
              value={stats.totalStars}
              icon={<Star className="h-4 w-4 text-amber-500" />}
              trend="+12%"
              description="Total stars"
            />
            <StatCard
              title="Forks"
              value={stats.totalForks}
              icon={<GitBranch className="h-4 w-4 text-indigo-500" />}
              trend="+5"
              description="Total forks"
            />
            <StatCard
              title="Top Project"
              value={stats.mostStarred?.name || "N/A"}
              icon={<BarChart3 className="h-4 w-4 text-emerald-500" />}
              isCompact
              description="Most starred"
            />
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview" className="gap-2">
                <LayoutGrid className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="repos" className="gap-2">
                <Box className="h-4 w-4" />
                Repositories
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings2 className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle>Project Health</CardTitle>
                      <CardDescription>Quality metrics overview</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-6">
                      <ProgressMetric label="Code Quality" value={75} />
                      <ProgressMetric label="Documentation" value={90} />
                      <ProgressMetric label="Test Coverage" value={65} />
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                      <div className="text-6xl font-bold text-primary">
                        A+
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Overall Grade
                      </p>
                      <Separator className="my-4 w-16" />
                      <p className="text-xs text-muted-foreground">
                        Performance improved by{" "}
                        <span className="font-semibold text-foreground">12%</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest repository events</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[320px]">
                      <div className="space-y-0">
                        {[1, 2, 3, 4, 5, 6].map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 border-b px-6 py-3 transition-colors hover:bg-muted/50"
                          >
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium leading-none">
                                {stats.mostStarred?.name || "Repository"}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <History className="h-3 w-3" />
                                {i * 15 + 5}m ago
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="repos" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <Repo />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Manage your preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Settings content goes here
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}

function StatCard({ title, value, icon, trend, description, isCompact = false }) {
  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <div className="rounded-md bg-muted p-2">
              {icon}
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <div className={`font-semibold ${isCompact ? "text-xl truncate" : "text-2xl"}`}>
              {value}
            </div>
            {trend && (
              <Badge variant="secondary" className="text-xs">
                {trend}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ProgressMetric({ label, value }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <Progress value={value} />
    </div>
  );
}