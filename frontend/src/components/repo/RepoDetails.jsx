import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useRepoStore from "@/store/useRepoStore";

export default function RepoDetails() {
  const { owner, repo } = useParams();
  const { selectedRepo, fetchRepoDetails, loading, error, clearSelectedRepo } = useRepoStore();

  useEffect(() => {
    fetchRepoDetails(owner, repo);
    return () => clearSelectedRepo();
  }, [owner, repo]);

  if (loading) return <p>Loading repo details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!selectedRepo) return <p>Repo not found</p>;

  return (
    <div>
      <h2>{selectedRepo.full_name}</h2>
      <p>{selectedRepo.description}</p>
      <p>Default branch: {selectedRepo.default_branch}</p>

      <h3>Languages:</h3>
      <ul>
        {selectedRepo.languages &&
          Object.entries(selectedRepo.languages).map(([lang, val]) => (
            <li key={lang}>{lang}: {val}</li>
          ))}
      </ul>
    </div>
  );
}
