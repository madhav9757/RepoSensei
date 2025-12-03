import express from "express";
import { getSuggestions } from "./suggestions.controller.js";

const router = express.Router();

router.post("/", getSuggestions);

export default router;
