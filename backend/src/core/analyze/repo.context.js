import { octokit } from "../github/github.client.js";
import { shouldIncludeFile } from "./file.filter.js";

export const buildRepoContext = async (owner, repo) => {
  const { data: repoData } = await octokit.repos.get({ owner, repo });

  const { data: treeData } = await octokit.git.getTree({
    owner,
    repo,
    tree_sha: repoData.default_branch,
    recursive: true,
  });

  const files = treeData.tree
    .filter(item => item.type === "blob")
    .map(item => item.path)
    .filter(shouldIncludeFile)
    .slice(0, 200); // token safety

  return {
    name: repoData.name,
    description: repoData.description,
    owner,
    language: repoData.language,
    defaultBranch: repoData.default_branch,
    files,
  };
};
