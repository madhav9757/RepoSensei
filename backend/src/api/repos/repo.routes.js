import express from "express";
import { getUserRepos } from "./repo.controller.js";

const router = express.Router();

// Get all repos of a user
router.get("/", getUserRepos);

export default router;
