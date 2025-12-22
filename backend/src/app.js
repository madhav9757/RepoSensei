import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

// Import route files
import githubAuthRoutes from "./api/auth/githubAuth.routes.js";
import repoRoutes from "./api/repos/repo.routes.js";
import suggestionsRoutes from "./api/suggestions/suggestions.routes.js";
import prRoutes from "./api/pr/pr.routes.js";

dotenv.config();

const app = express();

// Rate limiter
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // ⬅️ IMPORTANT FOR AUTH
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Apply rate limiter to API routes
app.use("/api/", limiter);

// Root Route
app.get("/", (req, res) => {
  res.json({
    message: "🚀 RepoSensei Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      repos: "/api/repos",
      analyze: "/api/analyze",
      suggestions: "/api/suggestions",
      pullRequests: "/api/pr",
    },
  });
});

// API Routes
app.use("/api/auth", githubAuthRoutes);
app.use("/api/repos", repoRoutes);
app.use("/api/repo", repoRoutes);
app.use("/api/suggestions", suggestionsRoutes);
app.use("/api/pr", prRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "RepoSensei backend running!",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;
