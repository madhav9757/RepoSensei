import { useState, useEffect } from "react";
import api from "../utils/api";

export default function useAnalysis(repoId) {
  const [report, setReport] = useState(null);

  useEffect(() => {
    api.get(`/analysis/${repoId}`).then((res) => setReport(res.data));
  }, [repoId]);

  return report;
}
