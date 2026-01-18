"use client";
import { useEffect, useState } from "react";
// import RepoHeader from "./RepoHeader";
import RepoSidebar from "./RepoSidebar";
import FileViewer from "./FileViewer";
import RepoLoadingSkeleton from "./RepoLoadingSkeleton";

export default function RepoStructure({ owner = "madhav9757", repo = "portfolio" }) {
  const [files, setFiles] = useState([]);
  const [tree, setTree] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedFilePath, setSelectedFilePath] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`);
        const data = await res.json();
        if (data.tree) setFiles(data.tree.filter(f => f.type === "blob" || f.type === "tree"));
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchFiles();
  }, [owner, repo]);

  useEffect(() => {
    const root = {};
    files.forEach(({ path, type }) => {
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
  }, [files]);

  if (loading) return <RepoLoadingSkeleton />;

  return (
    <div className="max-h-[74vh] flex flex-col bg-background overflow-hidden">
      {/* <RepoHeader owner={owner} repo={repo} /> */}
      <main className="flex-1 flex overflow-hidden">
        <RepoSidebar tree={tree} files={files} selectedFilePath={selectedFilePath} setSelectedFilePath={setSelectedFilePath} />
        <FileViewer owner={owner} repo={repo} selectedFilePath={selectedFilePath} />
      </main>
    </div>
  );
}
