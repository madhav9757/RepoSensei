import { getAICodeSuggestions } from "../../core/ai/ai.refactor.js";

export const getSuggestions = async (req, res) => {
  try {
    const { repoStructure } = req.body;
    if (!repoStructure) return res.status(400).json({ error: "repoStructure required" });

    const suggestions = await getAICodeSuggestions(repoStructure);
    res.json({ suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate suggestions" });
  }
};
