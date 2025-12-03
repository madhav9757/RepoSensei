import { useEffect, useState } from "react";
import RepoCard from "@/components/repo/RepoCard";
import api from "@/utils/api";

export default function Dashboard() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRepos() {
      try {
        const data = await api.get("/repos?username=demo-user");
        setRepos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch repos:", err);
        setError("Failed to load repositories. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, []);

  if (loading) return <p className="p-6 text-lg">Loading repositories...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Repositories</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {repos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
}
