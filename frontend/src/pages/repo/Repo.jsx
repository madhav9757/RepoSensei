import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Star,
  GitBranch,
  Clock,
  Code,
  Layers,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

import useRepoStore from "@/store/useRepoStore";
import RepoCard from "@/components/repo/RepoCard";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export default function Repo() {
  const { repos, fetchUserRepos, loading, error } = useRepoStore();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("updated");

  useEffect(() => {
    fetchUserRepos();
  }, []);

  /* ---------- FILTER + SORT ---------- */
  const filteredRepos = useMemo(() => {
    let data = repos.filter((r) =>
      r.name.toLowerCase().includes(query.toLowerCase())
    );

    if (sort === "stars") {
      data.sort((a, b) => b.stars - a.stars);
    } else if (sort === "name") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    return data;
  }, [repos, query, sort]);

  /* ---------- STATS ---------- */
  const stats = useMemo(() => {
    return {
      total: repos.length,
      stars: repos.reduce((a, r) => a + r.stars, 0),
      forks: repos.reduce((a, r) => a + r.forks, 0),
    };
  }, [repos]);

  return (
    <Card className="border border-border rounded-2xl shadow-xl bg-background/80 backdrop-blur">
      {/* ---------- HEADER ---------- */}
      <CardHeader className="space-y-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Layers className="w-5 h-5" /> Your Repositories
          </CardTitle>

          {/* Controls */}
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search repos..."
                className="pl-9 w-[220px]"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Recently Updated</SelectItem>
                <SelectItem value="stars">Most Stars</SelectItem>
                <SelectItem value="name">Name (A–Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <Stat icon={<GitBranch />} label="Repos" value={stats.total} />
          <Stat icon={<Star />} label="Stars" value={stats.stars} />
          <Stat icon={<Clock />} label="Forks" value={stats.forks} />
        </div>
      </CardHeader>

      {/* ---------- CONTENT ---------- */}
      <CardContent className="py-6">
        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-600 font-medium">{error}</p>
        )}

        {/* Empty */}
        {!loading && !error && filteredRepos.length === 0 && (
          <div className="text-center py-16 space-y-2">
            <p className="text-xl font-semibold">
              No repositories found
            </p>
            <p className="text-muted-foreground">
              Try changing search or sort
            </p>
          </div>
        )}

        {/* Repo Grid */}
        {!loading && !error && filteredRepos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRepos.map((repo) => (
              <motion.div
                key={repo.id}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <RepoCard
                  repo={repo}
                  className="group transition-all hover:-translate-y-1 hover:shadow-2xl"
                />
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function Stat({ icon, label, value }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 cursor-pointer hover:bg-muted/10 transition">
          <span className="text-muted-foreground">{icon}</span>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-semibold">{value}</p>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        Total <strong>{label}</strong> in your repositories
      </TooltipContent>
    </Tooltip>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-border p-4 space-y-3 bg-background/50">
      <div className="h-5 w-2/3 bg-muted rounded" />
      <div className="h-4 w-full bg-muted rounded" />
      <div className="h-4 w-1/2 bg-muted rounded" />
      <div className="flex gap-2 mt-2">
        <div className="h-3 w-8 bg-muted rounded" />
        <div className="h-3 w-12 bg-muted rounded" />
      </div>
    </div>
  );
}
