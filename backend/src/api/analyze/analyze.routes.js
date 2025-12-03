import express from "express";
import { analyzeRepo } from "./analyze.controller.js";

const router = express.Router();

router.post("/", analyzeRepo);

export default router; // ✅ add default export
