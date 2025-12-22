import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useRepoStore from "@/store/useRepoStore";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Folder, File, ChevronDown, ChevronRight, ArrowLeft } from "lucide-react";

export default function RepoStructure() {
  const { owner, repo } = useParams();
  const { repoTree, fetchRepoStructure, loading, error } = useRepoStore();

  const [openFolders, setOpenFolders] = useState({}); // Track expanded folders

  useEffect(() => {
    fetchRepoStructure(owner, repo);
  }, [owner, repo]);

  const toggleFolder = (path) => {
    setOpenFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  if (loading) return <p className="p-6 text-muted-foreground animate-pulse">Loading structure...</p>;
  if (error) return <p className="p-6 text-red-600 font-medium">{error}</p>;
  if (!repoTree || (!repoTree.directories && !repoTree.files))
    return <p className="p-6 text-muted-foreground">No repository structure found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Folder className="w-6 h-6 text-blue-500" />
          Structure of {owner}/{repo}
        </h2>
        <Link to={`/repo/${owner}/${repo}`}>
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Repo Info
          </Button>
        </Link>
      </div>

      {/* Tree Card */}
      <Card className="shadow-lg border border-border rounded-2xl bg-background/80 backdrop-blur hover:shadow-xl transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-green-500" /> Repository Tree
          </CardTitle>
          <Badge variant="secondary">{(repoTree.directories?.length || 0) + (repoTree.files?.length || 0)}</Badge>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {repoTree.directories?.map((dir) => (
              <TreeFolder key={dir.path} dir={dir} openFolders={openFolders} toggleFolder={toggleFolder} />
            ))}
            {repoTree.files?.map((file) => (
              <TreeFile key={file.path} file={file} />
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- Tree Folder Component ---------- */
function TreeFolder({ dir, openFolders, toggleFolder }) {
  const isOpen = openFolders[dir.path] || false;

  return (
    <li className="space-y-1">
      <div
        className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded hover:bg-muted/10 transition"
        onClick={() => toggleFolder(dir.path)}
      >
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
        <Folder className="w-5 h-5 text-green-500" />
        <span>{dir.path}</span>
        {dir.files?.length || dir.directories?.length ? (
          <Badge variant="secondary" className="ml-auto">
            {(dir.files?.length || 0) + (dir.directories?.length || 0)}
          </Badge>
        ) : null}
      </div>

      {/* Nested content */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-6 border-l border-border pl-2 space-y-1"
          >
            {dir.directories?.map((subDir) => (
              <TreeFolder key={subDir.path} dir={subDir} openFolders={openFolders} toggleFolder={toggleFolder} />
            ))}
            {dir.files?.map((file) => (
              <TreeFile key={file.path} file={file} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}

/* ---------- Tree File Component ---------- */
function TreeFile({ file }) {
  return (
    <li className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted/10 transition cursor-default">
      <File className="w-4 h-4 text-blue-400" />
      {file.path}
    </li>
  );
}
