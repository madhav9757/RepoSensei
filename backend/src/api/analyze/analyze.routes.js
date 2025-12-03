import express from "express";
import { analyzeRepoByUrl, analyzeRepoByOwner } from "./analyze.controller.js";

const router = express.Router();

router.post("/", analyzeRepoByUrl);
router.get("/:owner/:repo", analyzeRepoByOwner);

export default router;
