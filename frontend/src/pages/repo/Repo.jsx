import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Star,
  GitBranch,
  Clock,
  Layers,
  ArrowUpDown,
  FilterX,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import useRepoStore from "@/store/useRepoStore";
import RepoCard from "@/components/repo/RepoCard";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

export default function Repo() {
  const { repos, fetchUserRepos, loading, error } = useRepoStore();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("updated");

  useEffect(() => {
    fetchUserRepos();
  }, [fetchUserRepos]);

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

  const stats = useMemo(() => ({
    total: repos.length,
    stars: repos.reduce((a, r) => a + r.stars, 0),
    forks: repos.reduce((a, r) => a + r.forks, 0),
  }), [repos]);

  return (
    <TooltipProvider>
      <Card className="overflow-hidden border-none bg-background/40 shadow-[0_0_50px_-12px_rgba(0,0,0,0.05)] backdrop-blur-md">
        {/* --- DYNAMIC HEADER --- */}
        <CardHeader className="p-8 pb-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2.5 text-3xl font-bold tracking-tight">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Layers className="h-6 w-6" />
                </div>
                Repositories
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Showing {filteredRepos.length} of {repos.length} linked projects.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative group min-w-[240px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Filter by name..."
                  className="h-11 pl-10 border-none bg-muted/50 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20 transition-all"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="h-11 w-[180px] border-none bg-muted/50 rounded-xl focus:ring-1 focus:ring-primary/20 transition-all">
                  <ArrowUpDown className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-muted">
                  <SelectItem value="updated">Recently Updated</SelectItem>
                  <SelectItem value="stars">Most Stars</SelectItem>
                  <SelectItem value="name">Name (A–Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard icon={<GitBranch className="h-4 w-4" />} label="Total Repos" value={stats.total} />
            <StatCard icon={<Star className="h-4 w-4" />} label="Total Stars" value={stats.stars} />
            <StatCard icon={<Clock className="h-4 w-4" />} label="Global Forks" value={stats.forks} />
          </div>
        </CardHeader>

        <Separator className="mx-8 w-auto opacity-50" />

        {/* --- CONTENT AREA --- */}
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </motion.div>
            ) : error ? (
              <motion.div key="error" className="flex h-60 flex-col items-center justify-center text-center">
                <div className="rounded-full bg-destructive/10 p-3 text-destructive">
                  <FilterX className="h-6 w-6" />
                </div>
                <p className="mt-2 font-semibold text-destructive">{error}</p>
                <Badge variant="outline" className="mt-4 cursor-pointer" onClick={() => fetchUserRepos()}>Try Again</Badge>
              </motion.div>
            ) : filteredRepos.length === 0 ? (
              <motion.div key="empty" className="flex h-60 flex-col items-center justify-center text-center">
                <div className="rounded-full bg-muted p-4 text-muted-foreground">
                  <Search className="h-8 w-8" />
                </div>
                <p className="mt-4 text-xl font-bold">No results found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } }
                }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredRepos.map((repo) => (
                  <motion.div
                    key={repo.id}
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <RepoCard repo={repo} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

/* --- SMALL REUSABLE COMPONENTS --- */

function StatCard({ icon, label, value }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="group flex items-center gap-4 rounded-2xl border border-transparent bg-muted/30 p-4 transition-all hover:border-primary/20 hover:bg-muted/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background text-muted-foreground transition-colors group-hover:text-primary">
            {icon}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
              {label}
            </p>
            <p className="text-xl font-bold tabular-nums tracking-tight">
              {value}
            </p>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="rounded-lg border-muted bg-popover px-3 py-1.5 text-xs">
        Overall <strong>{label}</strong> across GitHub
      </TooltipContent>
    </Tooltip>
  );
}

function SkeletonCard() {
  return (
    <div className="relative space-y-4 overflow-hidden rounded-2xl border border-muted/50 bg-muted/20 p-6">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
        <div className="h-5 w-1/2 rounded bg-muted animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-muted animate-pulse" />
        <div className="h-3 w-4/5 rounded bg-muted animate-pulse" />
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-4 w-12 rounded-full bg-muted animate-pulse" />
        <div className="h-4 w-12 rounded-full bg-muted animate-pulse" />
      </div>
    </div>
  );
}