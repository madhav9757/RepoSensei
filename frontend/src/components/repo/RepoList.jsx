import { useEffect } from "react";
import useRepoStore from "../store/useRepoStore";
import RepoCard from "./RepoCard";

export default function RepoList() {
  const { repos, fetchUserRepos, loading, error } = useRepoStore();

  useEffect(() => {
    fetchUserRepos();
  }, []);

  if (loading) return <p>Loading your repositories...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!repos.length) return <p>No repositories found.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
}
