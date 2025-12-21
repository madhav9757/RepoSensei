// src/pages/Repo/Repo.jsx
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useRepoStore from "@/store/useRepoStore";
import useAuthStore from "@/store/authStore";
import RepoTree from "@/components/repo/RepoTree";
import { Button } from "@/components/ui/button";

export default function Repo() {
  const { id } = useParams();
  const user = useAuthStore((s) => s.user);
  const fetchMe = useAuthStore((s) => s.fetchMe);

  const {
    repoTree,
    suggestions,
    fetchRepoTree,
    fetchSuggestions,
    loading,
    error,
  } = useRepoStore();

  // Ensure user is loaded
  useEffect(() => {
    if (!user) fetchMe();
  }, [user]);

  // Fetch repo data once user is available
  useEffect(() => {
    if (!user) return;

    fetchRepoTree(id);
    fetchSuggestions(id);
  }, [user, id]);

  if (!user) return <p className="p-6">Loading user info...</p>;
  if (loading) return <p className="p-6">Loading repository...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-4">Repository #{id}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <RepoTree tree={repoTree} />

          <Link to={`/analysis/${id}`}>
            <Button className="mt-4">Run Analysis</Button>
          </Link>
        </div>

        <SuggestionsPanel suggestions={suggestions} />
      </div>
    </div>
  );
}
