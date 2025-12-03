import { githubClient } from "../../core/github/github.client.js";

export const getUserRepos = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) return res.status(400).json({ error: "Username required" });

    const response = await githubClient.get(`/users/${username}/repos`);
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch repos" });
  }
};
