import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useRepoStore from "../store/useRepoStore";

export default function RepoStructure() {
  const { owner, repo } = useParams();
  const { repoStructure, fetchRepoStructure, loading, error } = useRepoStore();

  useEffect(() => {
    fetchRepoStructure(owner, repo);
  }, [owner, repo]);

  if (loading) return <p>Loading structure...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!repoStructure) return <p>No structure found</p>;

  return (
    <div>
      <h3>Directories ({repoStructure.directories.length})</h3>
      <ul>
        {repoStructure.directories.map((dir) => (
          <li key={dir.path}>{dir.path}</li>
        ))}
      </ul>

      <h3>Files ({repoStructure.files.length})</h3>
      <ul>
        {repoStructure.files.map((file) => (
          <li key={file.path}>{file.path}</li>
        ))}
      </ul>
    </div>
  );
}
