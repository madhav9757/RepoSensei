// src/pages/Dashboard.jsx
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

import useStore from "@/store/useAuthStore";
import useAuth from "@/hooks/useAuth";
import api from "@/utils/api";
import { useToast } from "@/components/ui/toast";

import OAuthButton from "@/components/auth/OAuthButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Search,
  GitBranch,
  Star,
  TrendingUp,
  RefreshCw,
  Plus,
  ArrowUpDown,
  Filter,
  AlertCircle,
} from "lucide-react";

import { DashboardSkeleton, RepoCardSkeleton } from "@/components/common/SkeletonLoader";
import RepoCard from "@/components/repo/RepoCard";
import StatCard from "@/components/repo/StatCard";
import EmptyState from "@/components/repo/EmptyState";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const toast = useToast();

  // Global store state
  const repositories = useStore((state) => state.repositories) || [];
  const loading = useStore((state) => state.reposLoading);
  const error = useStore((state) => state.reposError);
  const setRepositories = useStore((state) => state.setRepositories);
  const setLoading = useStore((state) => state.setReposLoading);
  const setError = useStore((state) => state.setReposError);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("updated");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [syncing, setSyncing] = useState(false);

  // Fetch repositories when user logs in
  useEffect(() => {
    if (user) fetchRepositories();
  }, [user]);

  async function fetchRepositories() {
    try {
      setLoading(true);
      setError(null);

      const data = await api.repos.getAll(user.username);
      setRepositories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch repos:", err);
      setError(err.message || "Failed to load repositories");
      toast.error("Failed to load repositories", err.message || "");
    } finally {
      setLoading(false);
    }
  }

  async function handleSync() {
    try {
      setSyncing(true);
      await api.repos.sync(user.username);
      await fetchRepositories();
      toast.success("Repositories synced successfully");
    } catch (err) {
      toast.error("Failed to sync repositories", err.message || "");
    } finally {
      setSyncing(false);
    }
  }

  // Filtered and sorted repositories
  const filteredRepos = useMemo(() => {
    if (!repositories || !Array.isArray(repositories)) return [];

    let filtered = [...repositories]; // clone to avoid mutating store

    if (searchQuery) {
      filtered = filtered.filter(
        (repo) =>
          repo.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (languageFilter !== "all") {
      filtered = filtered.filter((repo) => repo.language === languageFilter);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "stars":
          return (b.stargazers_count || 0) - (a.stargazers_count || 0);
        case "updated":
        default:
          return new Date(b.updated_at || 0) - new Date(a.updated_at || 0);
      }
    });

    return filtered;
  }, [repositories, searchQuery, sortBy, languageFilter]);

  // Languages filter
  const languages = useMemo(() => {
    if (!repositories || !Array.isArray(repositories)) return ["all"];
    const langs = new Set(repositories.map((r) => r.language).filter(Boolean));
    return ["all", ...Array.from(langs)];
  }, [repositories]);

  // Stats
  const stats = useMemo(() => {
    const total = repositories.length;
    const analyzed = repositories.filter((r) => r.hasAnalysis).length;
    const avgScore = total
      ? Math.round(repositories.reduce((acc, r) => acc + (r.score || 0), 0) / total)
      : 0;

    return { total, analyzed, avgScore };
  }, [repositories]);

  if (authLoading) return <DashboardSkeleton />;

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <OAuthButton />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Repositories</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and analyze your GitHub repositories</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSync} disabled={syncing} variant="outline" className="gap-2">
            <RefreshCw className={`size-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Sync"}
          </Button>
          <Button className="gap-2">
            <Plus className="size-4" />
            Import Repo
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={GitBranch} label="Total Repositories" value={stats.total} color="blue" />
        <StatCard icon={TrendingUp} label="Analyzed" value={stats.analyzed} color="green" />
        <StatCard icon={Star} label="Average Score" value={`${stats.avgScore}/100`} color="purple" />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <ArrowUpDown className="size-4" />
                  Sort: {sortBy}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("updated")}>Recently Updated</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name")}>Name</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("stars")}>Stars</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="size-4" />
                  {languageFilter === "all" ? "All Languages" : languageFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {languages.map((lang) => (
                  <DropdownMenuItem key={lang} onClick={() => setLanguageFilter(lang)}>
                    {lang === "all" ? "All Languages" : lang}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <CardContent className="p-6 flex items-center gap-3">
            <AlertCircle className="size-5 text-red-600" />
            <div className="flex-1">
              <p className="font-semibold text-red-800 dark:text-red-200">Failed to load repositories</p>
              <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
            </div>
            <Button onClick={fetchRepositories} variant="outline" size="sm">
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Repo Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <RepoCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredRepos.length === 0 ? (
        <EmptyState
          searchQuery={searchQuery}
          onClear={() => {
            setSearchQuery("");
            setLanguageFilter("all");
          }}
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {filteredRepos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
