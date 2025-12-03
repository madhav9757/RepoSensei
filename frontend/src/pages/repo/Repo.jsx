import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import RepoTree from "@/components/repo/RepoTree";
import SuggestionsPanel from "@/components/repo/SuggestionsPanel";
import { Button } from "@/components/ui/button";
import api from "@/utils/api";

export default function Repo() {
  const { id } = useParams();
  const [tree, setTree] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRepo() {
      try {
        const treeData = await api.get(`/repo/${id}/tree`);
        const sugData = await api.get(`/suggestions/${id}`);

        setTree(treeData.tree || []);
        setSuggestions(sugData.suggestions || []);
      } catch (err) {
        console.error("Failed to fetch repo data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadRepo();
  }, [id]);

  if (loading) return <p className="p-6 text-lg">Loading repository...</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-4">Repository #{id}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <RepoTree tree={tree} />

          <Link to={`/analysis/${id}`}>
            <Button className="mt-4">Run Analysis</Button>
          </Link>
        </div>

        <SuggestionsPanel suggestions={suggestions} />
      </div>
    </div>
  );
}
