import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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

export default function RepoInfo() {
  const { owner, repo } = useParams();

  const {
    selectedRepo,
    fetchRepoDetails,
    loading,
    error,
  } = useRepoStore();

  useEffect(() => {
    fetchRepoDetails(owner, repo);
  }, [owner, repo]);

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-muted-foreground">
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
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Card className="shadow-lg border-muted">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">
                {selectedRepo.name}
              </CardTitle>
              <CardDescription className="mt-1">
                {selectedRepo.description || "No description provided"}
              </CardDescription>
            </div>

            <Badge variant="secondary">
              {selectedRepo.private ? "Private" : "Public"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <Stat label="Stars" value={selectedRepo.stars} />
            <Stat label="Forks" value={selectedRepo.forks} />
            <Stat label="Issues" value={selectedRepo.issues} />
            <Stat label="Language" value={selectedRepo.language || "—"} />
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <Link to={`/repo/${owner}/${repo}/structure`}>
              <Button size="lg">
                View Repository Structure →
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
