import { buildRepoContext } from "../../core/analyze/repo.context.js";
import { getAICodeSuggestions } from "../../core/ai/ai.suggestions.js";

/**
 * POST /api/suggestions
 * Body:
 * {
 *   "owner": "facebook",
 *   "repo": "react",
 *   "goal": "Improve performance and folder structure"
 * }
 */
export const generateSuggestions = async (req, res) => {
  try {
    const { owner, repo, goal } = req.body;

    if (!owner || !repo) {
      return res.status(400).json({
        success: false,
        message: "owner and repo are required",
      });
    }

    // 1️⃣ Build repo context (files, structure, tech stack)
    const repoContext = await buildRepoContext({ owner, repo });

    if (!repoContext || repoContext.files.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Repository is empty or could not be analyzed",
      });
    }

    // 2️⃣ Call LLM for suggestions
    const suggestions = await getAICodeSuggestions({
      repoContext,
      goal: goal || "General code improvement",
    });

    // 3️⃣ Send response
    return res.status(200).json({
      success: true,
      repo: `${owner}/${repo}`,
      suggestions,
    });

  } catch (error) {
    console.error("Suggestion Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate suggestions",
      error: error.message,
    });
  }
};
