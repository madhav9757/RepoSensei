import { getRepoTree, getFileContent, getRepoDetails } from "../github/github.client.js";
import { shouldIncludeFile } from "./file.filter.js";

export const buildRepoContext = async (owner, repo, token) => {
  console.log(`🏗️ Building context for ${owner}/${repo}...`);

  const repoData = await getRepoDetails(owner, repo, token);
  const { tree, defaultBranch } = await getRepoTree(owner, repo, token);

  // Filter and prioritize important files
  const filteredFiles = tree
    .filter(item => item.type === "blob")
    .filter(item => shouldIncludeFile(item.path));

  // Prioritize src, app, lib etc.
  const prioritized = filteredFiles.sort((a, b) => {
    const getScore = (path) => {
      if (path.startsWith('src/') || path.startsWith('app/') || path.startsWith('lib/')) return 100;
      if (path.includes('controller') || path.includes('service') || path.includes('component')) return 80;
      if (path.endsWith('.js') || path.endsWith('.jsx') || path.endsWith('.ts') || path.endsWith('.tsx')) return 50;
      return 0;
    };
    return getScore(b.path) - getScore(a.path);
  });

  // Pick top 10 files to avoid context window explosion
  const topFiles = prioritized.slice(0, 10);

  const filesWithContent = await Promise.all(
    topFiles.map(async (file) => {
      try {
        const content = await getFileContent(owner, repo, file.path, defaultBranch, token);
        return {
          path: file.path,
          content: content ? content.slice(0, 5000) : '// Binary or empty file'
        };
      } catch (err) {
        return { path: file.path, content: '// Failed to load' };
      }
    })
  );

  return {
    name: repoData.name,
    description: repoData.description,
    owner,
    language: repoData.language,
    defaultBranch: repoData.default_branch,
    files: filesWithContent,
  };
};
