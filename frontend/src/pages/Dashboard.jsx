import { useEffect } from "react";
import {
  Github,
  Star,
  GitBranch,
  Activity,
} from "lucide-react";

import useAuthStore from "@/store/authStore";
import useRepoStore from "@/store/useRepoStore";
import Repo from "./repo/Repo";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Welcome back,
          <span className="ml-2 text-blue-600 dark:text-blue-400">
            {user.username}
          </span>
        </h1>

        <p className="text-muted-foreground max-w-2xl">
          Here’s a snapshot of your repositories and recent activity.
        </p>
      </div>

      {/* ---------- STATS GRID ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Repositories"
          value={repos.length}
          icon={<Github />}
        />
        <StatCard
          title="Total Stars"
          value={totalStars}
          icon={<Star />}
        />
        <StatCard
          title="Total Forks"
          value={totalForks}
          icon={<GitBranch />}
        />
        <StatCard
          title="Top Repo"
          value={mostStarred?.name || "—"}
          icon={<Activity />}
          small
        />
      </div>

      {/* ---------- REPO LIST ---------- */}
      <Repo />
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function StatCard({ title, value, icon, small }) {
  return (
    <Card className="group rounded-2xl border border-border bg-background/80 backdrop-blur hover:shadow-xl transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm text-muted-foreground">
          {title}
        </CardTitle>
        <span className="text-muted-foreground group-hover:text-foreground transition">
          {icon}
        </span>
      </CardHeader>

      <CardContent>
        <p
          className={`font-bold ${
            small ? "text-lg truncate" : "text-3xl"
          }`}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
