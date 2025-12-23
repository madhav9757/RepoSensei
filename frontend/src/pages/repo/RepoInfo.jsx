import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import useRepoStore from "@/store/useRepoStore";

import AISuggestions from "../ai/AISuggestions";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Star,
  GitBranch,
  AlertCircle,
  Code2,
  ExternalLink,
  Github,
  FolderTree,
  Activity,
  ShieldCheck,
  Globe,
  Clock,
  History,
  Terminal,
  ChevronRight
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.05 } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
};

export default function RepoInfo() {
  const { owner, repo } = useParams();
  const { selectedRepo, fetchRepoDetails, loading, error } = useRepoStore();

  useEffect(() => {
    fetchRepoDetails(owner, repo);
  }, [owner, repo]);

  if (loading) return <RepoLoadingSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="w-10 h-10 text-destructive" />
        <p className="text-sm font-medium">{error}</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (!selectedRepo) return null;

  return (
    <TooltipProvider>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto px-6 py-8 space-y-6"
      >
        {/* Compact Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div variants={itemVariants} className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Globe className="w-3 h-3" />
              <span>{owner}</span>
              <ChevronRight className="w-3 h-3 opacity-50" />
              <span className="text-foreground">{selectedRepo.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{selectedRepo.name}</h1>
              <Badge variant="outline" className="text-[10px] h-5 px-2 font-bold uppercase">
                {selectedRepo.private ? "Private" : "Public"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-xl line-clamp-2">
              {selectedRepo.description || "No description provided for this repository."}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-2">
            <Button asChild size="sm" className="h-9 gap-2">
              <Link to={`/repo/${owner}/${repo}/structure`}>
                <FolderTree className="w-4 h-4" /> Structure
              </Link>
            </Button>
            <Button variant="secondary" size="sm" className="h-9 gap-2" onClick={() => window.open(selectedRepo.html_url, "_blank")}>
              <Github className="w-4 h-4" /> GitHub
            </Button>
          </motion.div>
        </header>

        <Separator className="opacity-50" />

        <Tabs defaultValue="overview" className="w-full">
          <motion.div variants={itemVariants}>
            <TabsList className="h-9 p-1 bg-muted/50">
              <TabsTrigger value="overview" className="text-xs gap-1.5 px-4"><Terminal className="w-3.5 h-3.5" /> Overview</TabsTrigger>
              <TabsTrigger value="insights" className="text-xs gap-1.5 px-4"><Activity className="w-3.5 h-3.5" /> AI Insights</TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Smaller Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard icon={<Star className="w-4 h-4 text-orange-500" />} label="Stars" value={selectedRepo.stars} />
              <StatCard icon={<GitBranch className="w-4 h-4 text-blue-500" />} label="Forks" value={selectedRepo.forks} />
              <StatCard icon={<AlertCircle className="w-4 h-4 text-rose-500" />} label="Issues" value={selectedRepo.issues} />
              <StatCard icon={<Code2 className="w-4 h-4 text-emerald-500" />} label="Lang" value={selectedRepo.language || "N/A"} />
            </div>

            {/* Compact Metadata & Action Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="md:col-span-2 shadow-sm">
                <CardHeader className="py-4 px-5 border-b bg-muted/20">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" /> Repository Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 grid grid-cols-2 gap-4">
                  <MetaItem icon={<Clock />} label="Last Update" value="2h ago" />
                  <MetaItem icon={<History />} label="License" value="MIT" />
                  <MetaItem label="Default Branch" value="main" isMono />
                  <MetaItem label="Status" value="Active" />
                </CardContent>
              </Card>

              <Card className="bg-zinc-950 text-white border-none flex flex-col justify-between">
                <CardHeader className="p-5">
                  <CardTitle className="text-sm font-bold">Quick Export</CardTitle>
                  <CardDescription className="text-zinc-400 text-xs">
                    Generate a PDF summary of repo metrics.
                  </CardDescription>
                </CardHeader>
                <div className="p-5 pt-0">
                  <Button variant="secondary" className="w-full h-8 text-xs font-bold">Download</Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
             <AISuggestions owner={owner} repo={repo} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </TooltipProvider>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <motion.div variants={itemVariants} whileHover={{ y: -2 }}>
      <Card className="shadow-sm overflow-hidden">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-2 bg-muted rounded-md">{icon}</div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{label}</p>
            <p className="text-lg font-bold tracking-tight">{value?.toLocaleString() || 0}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MetaItem({ icon, label, value, isMono }) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
        {icon && <span className="opacity-50">{icon}</span>} {label}
      </span>
      <p className={`text-sm font-medium ${isMono ? 'font-mono text-primary bg-primary/5 px-1.5 rounded w-fit' : ''}`}>
        {value}
      </p>
    </div>
  );
}

function RepoLoadingSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2 w-1/3"><Skeleton className="h-4 w-24" /><Skeleton className="h-8 w-full" /></div>
        <div className="flex gap-2"><Skeleton className="h-9 w-24" /><Skeleton className="h-9 w-24" /></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}
      </div>
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  );
}