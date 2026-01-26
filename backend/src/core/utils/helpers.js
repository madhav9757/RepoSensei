export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const formatDate = (date) => new Date(date).toISOString();

export const parseRepoUrl = (url) => {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace('.git', '') };
};
