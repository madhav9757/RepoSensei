import { githubClient } from "../../core/github/github.client.js";

export const getRepoPRs = async (req, res) => {
  try {
    const { owner, repo } = req.query;
    if (!owner || !repo) return res.status(400).json({ error: "owner and repo required" });

    const response = await githubClient.get(`/repos/${owner}/${repo}/pulls`);
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch PRs" });
  }
};
