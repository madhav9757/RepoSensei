import express from "express";
import { getSuggestions } from "./suggestions.controller.js";

const router = express.Router();

router.post("/", getSuggestions);

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const suggestions = [
      "Add unit tests for better code coverage",
      "Consider using TypeScript for type safety",
      "Add documentation for main functions",
      "Implement proper error handling"
    ];
    res.json({ suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate suggestions" });
  }
});

export default router;
