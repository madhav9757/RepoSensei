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

// Step 1: Redirect user to GitHub
router.get("/github/login", githubLogin);

// Step 2: Callback from GitHub after login
router.get("/github/callback", githubCallback);

// Step 3: Check if user is logged in (Frontend calls this)
router.get("/me", getMe);

// Step 4: Logout
router.post("/logout", logout);

export default router;
