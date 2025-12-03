export const fetchRepoPRs = async (owner, repo) => {
  return [
    { id: 101, title: "Fix bug in auth", state: "open" },
    { id: 102, title: "Update README", state: "closed" },
  ];
};
