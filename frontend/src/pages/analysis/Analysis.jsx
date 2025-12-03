import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AnalysisReport from "@/components/repo/AnalysisReport";
import api from "@/utils/api";

export default function Analysis() {
  const { id } = useParams();
  const [report, setReport] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const res = await api.get(`/analysis/${id}`); // GET /api/analysis/:id
        setReport(res.data || {});
      } catch (err) {
        console.error("Failed to fetch analysis report:", err);
        setError("Failed to load analysis. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, [id]);

  if (loading) return <p className="p-6 text-lg">Loading analysis...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Analysis for Repo #{id}</h1>

      <AnalysisReport report={report} />
    </div>
  );
}
