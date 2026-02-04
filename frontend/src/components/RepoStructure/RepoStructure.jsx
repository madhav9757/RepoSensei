"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import useRepoStore from "@/store/useRepoStore";
import RepoSidebar from "./RepoSidebar";
import FileViewer from "./FileViewer";
import RepoLoadingSkeleton from "./RepoLoadingSkeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RepoStructure() {
  const { owner, repo } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFile = searchParams.get("file");

  const { repoTree, fetchRepoStructure, loading, error, selectedRepo, repoContext } = useRepoStore();

  const [tree, setTree] = useState({});
  const [selectedFilePath, setSelectedFilePath] = useState(initialFile);

  useEffect(() => {
    if (owner && repo) {
      fetchRepoStructure(owner, repo);
    }
  }, [owner, repo, fetchRepoStructure]);

  useEffect(() => {
    console.log("RepoStructure: URL changed. initialFile:", initialFile);
    setSelectedFilePath(initialFile || null);
  }, [initialFile]);

  useEffect(() => {
    if (repoTree && Array.isArray(repoTree.files) && Array.isArray(repoTree.directories)) {
      const root = {};
      const allItems = [...repoTree.directories, ...repoTree.files];

      allItems.forEach(({ path, type }) => {
        const parts = path.split("/");
        let current = root;
        parts.forEach((part, index) => {
          if (!current[part]) {
            current[part] = index === parts.length - 1 && type === "blob" ? null : {};
          }
          current = current[part] || {};
        });
      });
      setTree(root);
    }
  }, [repoTree]);

  const isContextMismatch = !repoContext || repoContext.owner !== owner || repoContext.repo !== repo;

  if (loading || isContextMismatch || !repoTree?.default_branch) return <RepoLoadingSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border rounded-xl bg-destructive/5 text-center">
        <AlertCircle className="h-10 w-10 text-destructive mb-4" />
        <h2 className="text-lg font-bold text-destructive">Failed to Load Structure</h2>
        <p className="text-muted-foreground mt-1 max-w-sm">{error}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-6 gap-2"
          onClick={() => fetchRepoStructure(owner, repo)}
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col bg-background border rounded-xl overflow-hidden shadow-sm">
      <main className="flex-1 flex overflow-hidden">
        <RepoSidebar
          tree={tree}
          selectedFilePath={selectedFilePath}
          setSelectedFilePath={(path) => {
            console.log("RepoStructure: Manual selection:", path);
            setSelectedFilePath(path);
            setSearchParams((prev) => {
              const newParams = new URLSearchParams(prev);
              newParams.set("file", path);
              return newParams;
            });
          }}
        />
        <FileViewer
          owner={owner}
          repo={repo}
          branch={repoTree?.default_branch || selectedRepo?.default_branch || "main"}
          selectedFilePath={selectedFilePath}
        />
      </main>
    </div>
  );
}
