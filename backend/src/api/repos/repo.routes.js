import express from "express";
import { getUserRepos, getRepoInfo, getRepoStructure } from "./repo.controller.js";
import { requireAuth } from "../auth/githubAuth.controller.js"; // <-- JWT middleware

const router = express.Router();

// Get all repos for the logged-in user
router.get("/", requireAuth, getUserRepos);

// Get detailed info for a specific repo
router.get("/:owner/:repo", requireAuth, getRepoInfo);

// Get repo file structure
router.get("/:owner/:repo/structure", requireAuth, getRepoStructure);

export default router;
