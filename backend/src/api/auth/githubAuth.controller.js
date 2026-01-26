import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { catchAsync } from "../../core/utils/catchAsync.js";
import AppError from "../../core/utils/AppError.js";

dotenv.config();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URL = process.env.GITHUB_REDIRECT_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;
const JWT_SECRET = process.env.JWT_SECRET;

// -------------------------------------------
// STEP 1 — Redirect user to GitHub OAuth page
// -------------------------------------------
export const githubLogin = catchAsync(async (req, res, next) => {
  if (!CLIENT_ID || !REDIRECT_URL) {
    return next(new AppError("GitHub OAuth not configured", 500));
  }

  const redirectURL =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URL)}` +
    `&scope=read:user%20repo`;

  return res.redirect(redirectURL);
});

// ----------------------------------------------------
// STEP 2 — GitHub callback redirects back with ?code=
// ----------------------------------------------------
export const githubCallback = catchAsync(async (req, res, _next) => {
  const { code } = req.query;

  if (!code) {
    const errorMsg = "Missing OAuth code";
    console.log(errorMsg);
    return res.redirect(`${FRONTEND_URL}/?error=missing_code`);
  }

  // 1) Exchange code → access_token
  const tokenRes = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URL,
    },
    { headers: { Accept: "application/json" } }
  );

  const accessToken = tokenRes.data.access_token;

  if (!accessToken) {
    console.log("GitHub did not return access_token");
    return res.redirect(`${FRONTEND_URL}/?error=no_token`);
  }

  // 2) Fetch GitHub user profile
  const userRes = await axios.get("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const ghUser = userRes.data;

  // 3) Sign our own JWT to store in cookies
  const token = jwt.sign(
    {
      id: ghUser.id,
      username: ghUser.login,
      avatar: ghUser.avatar_url,
      accessToken,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  // 4) Set cookie with strict security policies
  res.cookie("rs_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // More secure than 'lax'
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  // 5) Redirect to frontend dashboard
  return res.redirect(`${FRONTEND_URL}/dashboard`);
});

// ----------------------------------------------------
// STEP 3 — /auth/me → Check login status
// ----------------------------------------------------
export const getMe = (req, res) => {
  const token = req.cookies?.rs_token;

  if (!token) {
    return res.json({ success: false, user: null });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    return res.json({
      success: true,
      user: {
        id: decoded.id,
        username: decoded.username,
        avatar: decoded.avatar,
        accessToken: decoded.accessToken,
      },
    });
  } catch (err) {
    // Token expired or invalid → logout user
    res.clearCookie("rs_token");
    return res.json({ success: false, user: null });
  }
};

// ----------------------------------------------------
// STEP 4 — Logout
// ----------------------------------------------------
export const logout = (req, res) => {
  res.clearCookie("rs_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
  return res.json({ success: true, message: "Logged out" });
};


// ----------------------------------------------------
// AUTH MIDDLEWARE
// ----------------------------------------------------
export const requireAuth = (req, res, next) => {
  const token = req.cookies?.rs_token;

  if (!token) return next(new AppError("Not authenticated", 401));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // includes accessToken!
    next();
  } catch (err) {
    res.clearCookie("rs_token");
    return next(new AppError("Invalid or expired token", 401));
  }
};

