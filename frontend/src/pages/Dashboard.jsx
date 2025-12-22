import { useEffect } from "react";
import {
  Github,
  Star,
  GitBranch,
  Activity,
  Folder,
  BarChart2,
  Zap,
  Settings,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";

import useAuthStore from "@/store/authStore";
import useRepoStore from "@/store/useRepoStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import Repo from "./repo/Repo";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const repos = useRepoStore((s) => s.repos);

  useEffect(() => {
    if (!user) fetchMe();
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <p className="text-muted-foreground text-lg animate-pulse">
          Loading dashboard…
        </p>
      </div>
    );
  }

  /* ---------- DASHBOARD METRICS ---------- */
  const totalStars = repos.reduce((a, r) => a + r.stars, 0);
  const totalForks = repos.reduce((a, r) => a + r.forks, 0);
  const mostStarred = [...repos].sort((a, b) => b.stars - a.stars)[0];

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-10">
      {/* ---------- HERO ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-3"
      >
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Welcome back,{" "}
          <span className="ml-2 text-blue-600 dark:text-blue-400">{user.username}</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Here’s a snapshot of your repositories and recent activity.
        </p>
      </motion.div>

      {/* ---------- STATS GRID ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Repositories" value={repos.length} icon={<Folder />} />
        <StatCard title="Total Stars" value={totalStars} icon={<Star />} />
        <StatCard title="Total Forks" value={totalForks} icon={<GitBranch />} />
        <StatCard title="Top Repo" value={mostStarred?.name || "—"} icon={<Activity />} small />
      </div>

      {/* ---------- ADVANCED TABS ---------- */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart2 className="w-4 h-4 mr-2" /> Overview
          </TabsTrigger>
          <TabsTrigger value="repos">
            <Folder className="w-4 h-4 mr-2" /> Repositories
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" /> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="space-y-4"
            >
              <Card className="p-4 bg-background/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="w-5 h-5" /> Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ProgressCard label="Code Quality" value={75} />
                  <ProgressCard label="Documentation" value={90} />
                  <ProgressCard label="Test Coverage" value={65} />
                </CardContent>
              </Card>

              <Card className="p-4 bg-background/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Info className="w-5 h-5" /> Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="mr-2 mb-2">
                    {mostStarred?.name || "—"} ⭐ {mostStarred?.stars || 0}
                  </Badge>
                  <Badge variant="secondary" className="mr-2 mb-2">
                    {repos.length} Repositories
                  </Badge>
                  <Badge variant="secondary" className="mr-2 mb-2">
                    {totalForks} Forks
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="repos">
          <Repo />
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-4 bg-background/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" /> Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Change Theme
              </Button>
              <Button variant="outline" className="w-full">
                Manage OAuth
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function StatCard({ title, value, icon, small }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group rounded-2xl border border-border bg-background/80 backdrop-blur hover:shadow-xl transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
          <span className="text-muted-foreground group-hover:text-foreground transition text-lg">
            {icon}
          </span>
        </CardHeader>
        <CardContent>
          <p className={`font-bold ${small ? "text-lg truncate" : "text-3xl"}`}>
            {value}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ProgressCard({ label, value }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex justify-between items-center mb-1 cursor-pointer">
          <span>{label}</span>
          <span>{value}%</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        Progress for <strong>{label}</strong>
      </TooltipContent>
      <Progress value={value} className="h-2 rounded-lg" />
    </Tooltip>
  );
}
