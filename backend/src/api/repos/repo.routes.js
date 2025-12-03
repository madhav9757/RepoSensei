import express from "express";
import { getUserRepos } from "./repo.controller.js";

const router = express.Router();

router.get("/", getUserRepos);

export default router;

