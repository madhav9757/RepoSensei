import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";

// Import route files (default exports)
import githubAuthRoutes from "./api/auth/githubAuth.routes.js";
import repoRoutes from "./api/repos/repo.routes.js";
import analyzeRoutes from "./api/analyze/analyze.routes.js";
import suggestionsRoutes from "./api/suggestions/suggestions.routes.js";
import prRoutes from "./api/pr/pr.routes.js";

dotenv.config();

const app = express();

// ---------------------
// Middleware
// ---------------------
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(morgan("dev"));

// ---------------------
// Root Route
// ---------------------
app.get("/", (req, res) => {
  res.send("🚀 RepoSensei Backend is running!");
});

// ---------------------
// API Routes
// ---------------------
app.use("/api/auth", githubAuthRoutes);
app.use("/api/repos", repoRoutes);
app.use("/api/repo", repoRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/analysis", analyzeRoutes);
app.use("/api/suggestions", suggestionsRoutes);
app.use("/api/pr", prRoutes);

// ---------------------
// Health check
// ---------------------
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "RepoSensei backend running!" });
});

export default app;
