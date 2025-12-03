import express from "express";
import { getRepoPRs, getPRDetails } from "./pr.controller.js";

const router = express.Router();

router.get("/:owner/:repo", getRepoPRs);
router.get("/:owner/:repo/:pull_number", getPRDetails);

export default router;
