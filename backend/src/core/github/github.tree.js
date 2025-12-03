export const fetchRepoTree = async (owner, repo) => {
  // Return dummy repo file tree
  return {
    name: repo,
    files: [
      { path: "README.md", type: "file" },
      { path: "src/index.js", type: "file" },
      { path: "src/utils.js", type: "file" },
      { path: "package.json", type: "file" },
    ],
  };
};
