import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import useRepoStore from "@/store/useRepoStore";

export default function RepoStructure() {
    const { owner, repo } = useParams();
    const navigate = useNavigate();
    const { repoTree, fetchRepoStructure, loading, error, clearRepoData } = useRepoStore();

    useEffect(() => {
        fetchRepoStructure(owner, repo);
        return () => clearRepoData();
    }, [owner, repo]);

    if (loading) return <p className="p-6">Loading repository structure...</p>;
    if (error) return <p className="p-6 text-red-600">{error}</p>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <button
                className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => navigate(`/repo/${owner}/${repo}`)}
            >
                ← Back to Repo Info
            </button>

            <h2 className="text-2xl font-bold mb-4">
                Structure of {owner}/{repo}
            </h2>

            <p>Directories: {repoTree.directories?.length || 0}</p>
            <p>Files: {repoTree.files?.length || 0}</p>

            <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => navigate(`/repo/${owner}/${repo}/structure`)}
            >
                View Structure
            </button>
        </div>
    );
}
