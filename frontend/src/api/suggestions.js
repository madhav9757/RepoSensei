import api from "./api";

export const getSuggestions = async ({ owner, repo, goal }) => {
  const { data } = await api.post("/suggestions", {
    owner,
    repo,
    goal,
  });

  return data;
};
