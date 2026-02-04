import express from "express";
import { analyzeFile } from "./analyze.controller.js";
import { requireAuth } from "../auth/githubAuth.controller.js";

const router = express.Router();

router.post("/", requireAuth, analyzeFile);

export default router;
