import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import * as Sentry from "@sentry/node";
import { doubleCsrf } from "csrf-csrf";

// Import route files
import githubAuthRoutes from "./api/auth/githubAuth.routes.js";
import repoRoutes from "./api/repos/repo.routes.js";
import suggestionsRoutes from "./api/suggestions/suggestions.routes.js";
import analyzeRoutes from "./api/analyze/analyze.routes.js";
import prRoutes from "./api/pr/pr.routes.js";
import { globalErrorHandler } from "./api/middleware/error.middleware.js";
import AppError from "./core/utils/AppError.js";

dotenv.config();

const app = express();

// Initialize Sentry
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Sentry.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
  });

  // RequestHandler creates a separate execution context, so that all
  // transactions/spans/breadcrumbs are isolated across requests
  app.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());
}

// CSRF Protection configuration
const csrf = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || "very-secret-string",
  cookieName: "ps_csrf",
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
  size: 64,
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  getSessionIdentifier: (req) => {
    // Use session ID if available, otherwise use a combination of IP and user agent
    return req.session?.id || `${req.ip}-${req.get('user-agent')}`;
  },
});

const {
  invalidCsrfTokenError,
  generateCsrfToken,
  doubleCsrfProtection,
} = csrf;

// Rate limiter - User-based if authenticated, otherwise IP-based
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user?.id || req.ip; // User-based rate limiting
  },
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
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// CSRF Token endpoint (must be BEFORE rate limiter and CSRF protection)
app.get("/api/csrf-token", (req, res) => {
  try {
    console.log("Generating CSRF token...");
    const token = generateCsrfToken(req, res);
    console.log("CSRF token generated successfully:", token ? "✓" : "✗");
    res.json({ token });
  } catch (error) {
    console.error("CSRF Token Generation Error:", error);
    res.status(500).json({
      error: "Failed to generate CSRF token",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
});

// Apply rate limiter to API routes (after CSRF token endpoint)
app.use("/api/", limiter);

// Routes that need CSRF protection
app.use("/api/repos", doubleCsrfProtection);
app.use("/api/repo", doubleCsrfProtection);
app.use("/api/suggestions", doubleCsrfProtection);
app.use("/api/analyze", doubleCsrfProtection);
app.use("/api/pr", doubleCsrfProtection);

// Root Route
app.get("/", (req, res) => {
  res.json({
    message: "🚀 RepoSensei Backend API",
    version: "1.0.1",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      repos: "/api/repos",
      suggestions: "/api/suggestions",
      pr: "/api/pr",
      csrf: "/api/csrf-token"
    },
  });
});

// API Routes
app.use("/api/auth", githubAuthRoutes);
app.use("/api/repos", repoRoutes);
app.use("/api/repo", repoRoutes);
app.use("/api/suggestions", suggestionsRoutes);
app.use("/api/analyze", analyzeRoutes);
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

// Sentry Error Handler (must be before any other error middleware)
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

// 404 handler
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Global error handler
app.use(globalErrorHandler);

export default app;

