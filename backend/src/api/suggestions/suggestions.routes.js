import express from "express";
import { generateSuggestions } from "./suggestions.controller.js";

const router = express.Router();

router.post("/", generateSuggestions);

export default router;
