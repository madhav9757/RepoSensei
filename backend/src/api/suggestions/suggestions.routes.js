import express from "express";
import { generateSuggestions } from "./suggestions.controller.js";
import { requireAuth } from "../auth/githubAuth.controller.js";

const router = express.Router();

router.post("/", requireAuth, generateSuggestions);

export default router;
