import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useRepoStore from "@/store/useRepoStore";

export default function RepoDetails() {
  const { owner, repo } = useParams();
  const { selectedRepo, repoTree, fetchRepoDetails, fetchRepoStructure, loading, error, clearRepoData } = useRepoStore();

  useEffect(() => {
    fetchRepoDetails(owner, repo);
    fetchRepoStructure(owner, repo);
    return () => clearRepoData();
  }, [owner, repo]);

  if (loading) return <p className="p-6">Loading repository info...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!selectedRepo) return <p className="p-6">Repository not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-2">{selectedRepo.full_name}</h2>
      <p className="mb-2">{selectedRepo.description}</p>
      <p className="mb-4">Default branch: {selectedRepo.default_branch}</p>

      {/* Repo stats */}
      <div className="flex items-center gap-6 mb-4 text-gray-700 dark:text-gray-300">
        <div>⭐ {selectedRepo.stargazers_count}</div>
        <div>🍴 {selectedRepo.forks_count}</div>
        <div>⚠️ {selectedRepo.open_issues_count} open issues</div>
      </div>

      {/* Languages */}
      {selectedRepo.languages && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Languages:</h3>
          <ul className="list-disc pl-6">
            {Object.entries(selectedRepo.languages).map(([lang, val]) => (
              <li key={lang}>{lang}: {val}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Repository Structure */}
      {repoTree && (
        <div>
          <h3 className="font-semibold mb-2">Structure:</h3>
          <p>Directories: {repoTree.directories?.length || 0}</p>
          <p>Files: {repoTree.files?.length || 0}</p>
          <ul className="list-disc pl-6">
            {repoTree.directories?.map((dir) => (
              <li key={dir.path}>📁 {dir.path}</li>
            ))}
            {repoTree.files?.map((file) => (
              <li key={file.path}>📄 {file.path}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
