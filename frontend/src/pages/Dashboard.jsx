import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import useRepoStore from "@/store/useRepoStore";
import RepoCard from "@/components/repo/RepoCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const { repos, fetchUserRepos, loading, error } = useRepoStore();

  useEffect(() => {
    fetchUserRepos(); // fetch all repos for logged-in user
  }, []);

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-2xl font-bold">
        Welcome, {user.username} 👋
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Your Repositories</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading your repositories...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && repos.length === 0 && (
            <p>No repositories found.</p>
          )}

          {!loading && !error && repos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {repos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
