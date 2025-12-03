export const fetchUserRepos = async (username) => {
  // For MVP, return dummy repo data
  return [
    { id: 1, name: "demo-repo", description: "Demo repository", private: false },
    { id: 2, name: "another-repo", description: "Another repo", private: true },
  ];
};
