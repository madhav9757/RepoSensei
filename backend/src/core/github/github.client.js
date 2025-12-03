import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const githubClient = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
    // Optional: use personal token if available
    Authorization: process.env.GITHUB_PERSONAL_ACCESS_TOKEN
      ? `token ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`
      : undefined,
  },
});
