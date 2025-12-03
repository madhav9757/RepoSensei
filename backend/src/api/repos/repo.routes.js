import express from "express";
import { getUserRepos, getRepoInfo, getRepoStructure } from "./repo.controller.js";

const router = express.Router();

router.get("/", getUserRepos);
router.get("/:owner/:repo", getRepoInfo);
router.get("/:owner/:repo/structure", getRepoStructure);

export default router;

