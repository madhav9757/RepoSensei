import express from "express";
import {
  githubLogin,
  githubCallback,
  getMe,
  logout,
} from "./githubAuth.controller.js";

const router = express.Router();

// -----------------------------------------------------
// AUTH ROUTES
// -----------------------------------------------------
router.get("/github/login", githubLogin);

router.get("/github/callback", githubCallback);

router.get("/me", getMe);

router.post("/logout", logout);

export default router;
