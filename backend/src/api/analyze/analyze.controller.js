import { analyzeRepoStructure } from "../../core/analyze/structureAnalyzer.js";

export const analyzeRepo = async (req, res) => {
  try {
    const { repoUrl } = req.body;
    if (!repoUrl) return res.status(400).json({ error: "repoUrl is required" });

    const report = await analyzeRepoStructure(repoUrl);
    res.json({ report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze repo" });
  }
};
