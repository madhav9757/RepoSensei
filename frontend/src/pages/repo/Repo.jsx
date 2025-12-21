import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import RepoTree from "@/components/repo/RepoTree";
import { Button } from "@/components/ui/button";
import useRepoStore from "@/store/useRepoStore";

export default function Repo() {
  const { id } = useParams();
  const {
    repoTree,
    suggestions,
    loading,
    error,
    fetchRepoTree,
    fetchSuggestions,
    clearRepoData,
  } = useRepoStore();

  useEffect(() => {
    fetchRepoTree(id);
    fetchSuggestions(id);

    return () => clearRepoData();
  }, [id]);

  if (loading) return <p className="p-6 text-lg">Loading repository...</p>;
  if (error) return <p className="p-6 text-lg text-red-600">{error}</p>;

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
