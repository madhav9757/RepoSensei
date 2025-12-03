import express from "express";
import { analyzeRepo } from "./analyze.controller.js";

const router = express.Router();

router.post("/", analyzeRepo);

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const report = {
      repoId: id,
      score: 85,
      codeQuality: "Good code structure with minor improvements needed",
      security: "No critical vulnerabilities found",
      documentation: "README exists but could be more detailed",
      testing: "Limited test coverage - consider adding more tests",
      dependencies: "All dependencies are up to date"
    };
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch analysis" });
  }
});

export default router;
