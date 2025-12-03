import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const githubOAuth = async (req, res) => {
  const { code } = req.query;

  if (!code) return res.status(400).json({ error: "Code is required" });

  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenResponse.data.access_token;

    const token = jwt.sign({ accessToken }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "GitHub OAuth failed" });
  }
};