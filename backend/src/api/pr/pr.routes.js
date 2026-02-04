import express from "express";
import { getRepoPRs, getPRDetails } from "./pr.controller.js";
import { requireAuth } from "../auth/githubAuth.controller.js";

const router = express.Router();

router.get("/:owner/:repo", requireAuth, getRepoPRs);
router.get("/:owner/:repo/:pull_number", requireAuth, getPRDetails);

export default router;
