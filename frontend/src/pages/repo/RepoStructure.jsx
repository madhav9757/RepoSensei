import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useRepoStore from "@/store/useRepoStore";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RepoStructure() {
  const { owner, repo } = useParams();

  const {
    repoTree,
    fetchRepoStructure,
    loading,
    error,
  } = useRepoStore();

  useEffect(() => {
    fetchRepoStructure(owner, repo);
  }, [owner, repo]);

  if (loading) return <p className="p-6">Loading structure...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  if (!repoTree || (!repoTree.directories && !repoTree.files)) {
    return <p className="p-6">No repository structure found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Structure of {owner}/{repo}
        </h2>

        <Link to={`/repo/${owner}/${repo}`}>
          <Button variant="outline">← Back to Repo Info</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Directories ({repoTree.directories?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-1">
            {repoTree.directories?.map((dir) => (
              <li key={dir.path}>{dir.path}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Files ({repoTree.files?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-1">
            {repoTree.files?.map((file) => (
              <li key={file.path}>{file.path}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
