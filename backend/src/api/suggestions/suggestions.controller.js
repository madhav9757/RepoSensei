import { buildRepoContext } from "../../core/analyze/repo.context.js";
import { getAICodeSuggestions } from "../../core/ai/ai.suggestions.js";

/**
 * POST /api/suggestions
 * Body: { "owner": "...", "repo": "...", "goal": "..." }
 */
export const generateSuggestions = async (req, res) => {
  try {
    const { owner, repo, goal } = req.body;
    const { accessToken } = req.user;

    // Validation
    if (!owner || !repo) {
      return res.status(400).json({
        success: false,
        message: "owner and repo are required",
      });
    }

    // 1️⃣ Build repo context
    // FIX: Pass (owner, repo, accessToken)
    const repoContext = await buildRepoContext(owner, repo, accessToken);

    if (!repoContext || !repoContext.files || repoContext.files.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Repository is empty or could not be analyzed",
      });
    }

    // 2️⃣ Call LLM for suggestions
    // Pass the context and goal to the service
    const suggestions = await getAICodeSuggestions(
      repoContext,
      goal || "General technical audit and code quality improvement"
    );

    // 3️⃣ Send response
    return res.status(200).json({
      success: true,
      repo: `${owner}/${repo}`,
      suggestions, // This will be the JSON array from the LLM
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