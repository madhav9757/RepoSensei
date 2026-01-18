"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Star,
  GitBranch,
  Clock,
  Layers,
  ArrowUpDown,
  RefreshCw,
  Plus,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import useRepoStore from "@/store/useRepoStore";
import RepoCard from "@/components/repo/RepoCard";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

export default function Repo() {
  const { repos, fetchUserRepos, loading, error } = useRepoStore();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("updated");

  useEffect(() => {
    fetchUserRepos();
  }, [fetchUserRepos]);

  const filteredRepos = useMemo(() => {
    let data = [...repos].filter((r) =>
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-2xl font-semibold tracking-tight">
              Repositories
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {filteredRepos.length} {filteredRepos.length === 1 ? 'repository' : 'repositories'} found
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search repositories..."
              className="pl-9 w-full sm:w-64"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Last Updated</SelectItem>
              <SelectItem value="stars">Most Stars</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
          
          <Button size="icon" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator />

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </motion.div>
        ) : error ? (
          <motion.div 
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="rounded-full bg-destructive/10 p-4 mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Failed to Load</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">{error}</p>
            <Button variant="outline" size="sm" onClick={() => fetchUserRepos()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </motion.div>
        ) : filteredRepos.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="rounded-full bg-muted p-4 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Repositories Found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {query ? 'Try adjusting your search query' : 'No repositories available'}
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="grid"
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredRepos.map((repo) => (
              <motion.div
                key={repo.id}
                variants={itemVariants}
              >
                <RepoCard repo={repo} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SkeletonCard() {
  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}