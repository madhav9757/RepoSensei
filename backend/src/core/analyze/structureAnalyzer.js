import { structureRules } from "./structureRules.js";

export const analyzeRepoStructure = async (repoUrl) => {
  // Dummy analysis
  return {
    repoUrl,
    score: 85,
    missingFiles: [],
    folderIssues: [],
    message: "Repository structure looks good!",
    rulesChecked: structureRules,
  };
};
