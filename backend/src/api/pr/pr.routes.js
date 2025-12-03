import express from "express";
import { getRepoPRs } from "./pr.controller.js";

const router = express.Router();

// Get pull requests of a repo
router.get("/", getRepoPRs);

export default router;
