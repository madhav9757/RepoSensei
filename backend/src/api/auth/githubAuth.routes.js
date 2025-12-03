import express from "express";
import { githubOAuth } from "./githubAuth.controller.js";

const router = express.Router();

router.get("/github", githubOAuth);

export default router;
