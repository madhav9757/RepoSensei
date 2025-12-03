import express from "express";
import { githubOAuth } from "./githubAuth.controller.js";

const router = express.Router();

// GitHub OAuth callback
router.get("/github", githubOAuth);

export default router;
