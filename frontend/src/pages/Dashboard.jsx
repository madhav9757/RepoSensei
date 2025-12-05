// frontend/src/pages/Dashboard.jsx - ENHANCED VERSION
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  GitBranch,
  Star,
  GitFork,
  Calendar,
  ArrowUpDown,
  Filter,
  RefreshCw,
  Plus,
  Code2,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { useRepositories } from "@/store/useStore";
import { DashboardSkeleton, RepoCardSkeleton } from "@/components/common/SkeletonLoader";
import { useToast } from "@/components/ui/toast";
import api from "@/utils/api";
import { motion } from "framer-motion";

export default function Dashboard() {
  const {
    repositories,
    loading,
    error,
    setRepositories,
    setLoading,
    setError
  } = useRepositories();

  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("updated");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [syncing, setSyncing] = useState(false);

  // Fetch repositories
  useEffect(() => {
    fetchRepositories();
  }, []);

  async function fetchRepositories() {
    try {
      setLoading(true);
      setError(null);
      const data = await api.repos.getAll("demo-user");
      setRepositories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch repos:", err);
      setError(err.message || "Failed to load repositories");
      toast.error("Failed to load repositories", err.message);
      
      // Set mock data for demo
      setRepositories(generateMockRepos());
    } finally {
      setLoading(false);
    }
  }

  async function handleSync() {
    try {
      setSyncing(true);
      await api.repos.sync();
      await fetchRepositories();
      toast.success("Repositories synced successfully");
    } catch (err) {
      toast.error("Failed to sync repositories", err.message);
    } finally {
      setSyncing(false);
    }
  }

  // Filter and sort repositories
  const filteredRepos = useMemo(() => {
    let filtered = repositories;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(repo =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Language filter
    if (languageFilter !== "all") {
      filtered = filtered.filter(repo => repo.language === languageFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "stars":
          return (b.stars || 0) - (a.stars || 0);
        case "updated":
          return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [repositories, searchQuery, sortBy, languageFilter]);

  // Get unique languages
  const languages = useMemo(() => {
    const langs = new Set(repositories.map(r => r.language).filter(Boolean));
    return ["all", ...Array.from(langs)];
  }, [repositories]);

  // Stats
  const stats = useMemo(() => ({
    total: repositories.length,
    analyzed: repositories.filter(r => r.hasAnalysis).length,
    avgScore: repositories.reduce((acc, r) => acc + (r.score || 0), 0) / repositories.length || 0
  }), [repositories]);

  if (loading && repositories.length === 0) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your Repositories</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and analyze your GitHub repositories
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSync}
              disabled={syncing}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={`size-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync'}
            </Button>
            <Button className="gap-2">
              <Plus className="size-4" />
              Import Repo
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={GitBranch}
          label="Total Repositories"
          value={stats.total}
          color="blue"
        />
        <StatCard
          icon={TrendingUp}
          label="Analyzed"
          value={stats.analyzed}
          color="green"
        />
        <StatCard
          icon={Star}
          label="Average Score"
          value={`${Math.round(stats.avgScore)}/100`}
          color="purple"
        />
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <ArrowUpDown className="size-4" />
                  Sort: {sortBy}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("updated")}>
                  Recently Updated
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name")}>
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("stars")}>
                  Stars
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="size-4" />
                  {languageFilter === "all" ? "All Languages" : languageFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {languages.map(lang => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => setLanguageFilter(lang)}
                  >
                    {lang === "all" ? "All Languages" : lang}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <CardContent className="p-6 flex items-center gap-3">
            <AlertCircle className="size-5 text-red-600" />
            <div className="flex-1">
              <p className="font-semibold text-red-800 dark:text-red-200">
                Failed to load repositories
              </p>
              <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
            </div>
            <Button onClick={fetchRepositories} variant="outline" size="sm">
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Repository Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <RepoCardSkeleton key={i} />)}
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
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
        >
          {filteredRepos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`size-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="size-6" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RepoCard({ repo }) {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={variants}>
      <Link to={`/repo/${repo.id}`}>
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code2 className="size-4 shrink-0" />
                  <span className="truncate">{repo.name}</span>
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-2">
                  {repo.description || "No description available"}
                </CardDescription>
              </div>
              {repo.hasAnalysis && (
                <Badge variant="outline" className="shrink-0">
                  Analyzed
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              {repo.language && (
                <span className="flex items-center gap-1">
                  <span className="size-3 rounded-full bg-blue-500"></span>
                  {repo.language}
                </span>
              )}
              {repo.stars !== undefined && (
                <span className="flex items-center gap-1">
                  <Star className="size-3" />
                  {repo.stars}
                </span>
              )}
              {repo.forks !== undefined && (
                <span className="flex items-center gap-1">
                  <GitFork className="size-3" />
                  {repo.forks}
                </span>
              )}
            </div>
            {repo.updatedAt && (
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-3">
                <Calendar className="size-3" />
                Updated {new Date(repo.updatedAt).toLocaleDateString()}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

function EmptyState({ searchQuery, onClear }) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="size-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
          <GitBranch className="size-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          {searchQuery ? "No repositories found" : "No repositories yet"}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {searchQuery
            ? "Try adjusting your search or filters"
            : "Connect your GitHub account to get started"}
        </p>
        {searchQuery ? (
          <Button onClick={onClear} variant="outline">
            Clear Filters
          </Button>
        ) : (
          <Button>Connect GitHub</Button>
        )}
      </CardContent>
    </Card>
  );
}

// Mock data generator
function generateMockRepos() {
  return [
    {
      id: 1,
      name: "react-dashboard",
      description: "Modern dashboard built with React and Tailwind CSS",
      language: "JavaScript",
      stars: 245,
      forks: 42,
      updatedAt: new Date().toISOString(),
      hasAnalysis: true,
      score: 85
    },
    {
      id: 2,
      name: "node-api",
      description: "RESTful API built with Node.js and Express",
      language: "TypeScript",
      stars: 189,
      forks: 28,
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      hasAnalysis: true,
      score: 92
    },
    {
      id: 3,
      name: "python-ml",
      description: "Machine learning project with Python and TensorFlow",
      language: "Python",
      stars: 567,
      forks: 89,
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
      hasAnalysis: false,
      score: 0
    },
    {
      id: 4,
      name: "mobile-app",
      description: "Cross-platform mobile app built with React Native",
      language: "JavaScript",
      stars: 123,
      forks: 15,
      updatedAt: new Date(Date.now() - 259200000).toISOString(),
      hasAnalysis: true,
      score: 78
    },
    {
      id: 5,
      name: "go-microservice",
      description: "Microservice architecture with Go and Docker",
      language: "Go",
      stars: 89,
      forks: 12,
      updatedAt: new Date(Date.now() - 345600000).toISOString(),
      hasAnalysis: false,
      score: 0
    },
    {
      id: 6,
      name: "rust-cli",
      description: "Command-line tool built with Rust",
      language: "Rust",
      stars: 456,
      forks: 67,
      updatedAt: new Date(Date.now() - 432000000).toISOString(),
      hasAnalysis: true,
      score: 95
    }
  ];
}