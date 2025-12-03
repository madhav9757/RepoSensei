import express from "express";
import { getUserRepos } from "./repo.controller.js";
import { fetchRepoTree } from "../../core/github/github.tree.js";

const router = express.Router();

router.get("/", getUserRepos);

router.get("/:id/tree", async (req, res) => {
  try {
    const { id } = req.params;
    const tree = await fetchRepoTree("owner", `repo-${id}`);
    res.json({ tree: tree.files.map(f => f.path) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch repo tree" });
  }
});

export default router;
