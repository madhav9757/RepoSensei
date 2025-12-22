import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import useRepoStore from "@/store/useRepoStore";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

import {
  Star,
  GitBranch,
  AlertCircle,
  Code,
  Box,
} from "lucide-react";

export default function RepoInfo() {
  const { owner, repo } = useParams();

  const { selectedRepo, fetchRepoDetails, loading, error } = useRepoStore();

  useEffect(() => {
    fetchRepoDetails(owner, repo);
  }, [owner, repo]);

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-muted-foreground animate-pulse">
        Loading repository info…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-destructive">
        {error}
      </div>
    );
  }

  if (!selectedRepo) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-6 py-10"
    >
      <Card className="shadow-xl border border-border rounded-2xl bg-background/80 backdrop-blur">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Box className="w-6 h-6 text-blue-500" />
                {selectedRepo.name}
              </CardTitle>
              <CardDescription className="mt-1 text-muted-foreground">
                {selectedRepo.description || "No description provided"}
              </CardDescription>
            </div>

            <Badge
              variant={selectedRepo.private ? "destructive" : "secondary"}
              className="uppercase px-3 py-1 text-sm"
            >
              {selectedRepo.private ? "Private" : "Public"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <Stat icon={<Star className="w-5 h-5 text-yellow-500 mx-auto" />} label="Stars" value={selectedRepo.stars} />
            <Stat icon={<GitBranch className="w-5 h-5 text-green-500 mx-auto" />} label="Forks" value={selectedRepo.forks} />
            <Stat icon={<AlertCircle className="w-5 h-5 text-red-500 mx-auto" />} label="Issues" value={selectedRepo.issues} />
            <Stat icon={<Code className="w-5 h-5 text-blue-500 mx-auto" />} label="Language" value={selectedRepo.language || "—"} />
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <Link to={`/repo/${owner}/${repo}/structure`}>
              <Button size="lg" className="gap-2">
                View Repo Structure
                <Box className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */
function Stat({ icon, label, value }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex flex-col items-center rounded-xl border border-border px-4 py-3 cursor-pointer hover:shadow-lg hover:bg-muted/10 transition">
          {icon}
          <p className="text-xs text-muted-foreground mt-1">{label}</p>
          <p className="text-lg font-semibold">{value}</p>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        Total <strong>{label}</strong> for this repository
      </TooltipContent>
    </Tooltip>
  );
}
