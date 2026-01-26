import express from "express";
import { getUserRepos, getRepoInfo, getRepoStructure, getRepoContent } from "./repo.controller.js";
import { requireAuth } from "../auth/githubAuth.controller.js";
import { validate } from "../middleware/validation.middleware.js";
import { getRepoSchema, getUserReposSchema } from "./repo.schema.js";

const router = express.Router();

// Get all repos for the logged-in user
router.get("/", requireAuth, validate(getUserReposSchema), getUserRepos);

// Get detailed info for a specific repo
router.get("/:owner/:repo", requireAuth, validate(getRepoSchema), getRepoInfo);

// Get repo file structure
router.get("/:owner/:repo/structure", requireAuth, validate(getRepoSchema), getRepoStructure);

// Get repo file content
router.get("/:owner/:repo/content", requireAuth, validate(getRepoSchema), getRepoContent);

export default router;

