import express from "express";
import { analyzeFile } from "./analyze.controller.js";

const router = express.Router();

router.post("/", analyzeFile);

export default router;
