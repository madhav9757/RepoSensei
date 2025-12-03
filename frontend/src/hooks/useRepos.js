import { useEffect, useState } from "react";
import api from "../utils/api";

export default function useRepos() {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    api.get("/repos").then((res) => setRepos(res.data));
  }, []);

  return repos;
}
