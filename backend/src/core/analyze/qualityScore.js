export const calculateQualityScore = (repoData) => {
  let score = 100;
  
  if (!repoData.hasReadme) score -= 20;
  if (!repoData.hasTests) score -= 15;
  if (!repoData.hasLicense) score -= 10;
  if (!repoData.hasGitignore) score -= 10;
  if (!repoData.hasCI) score -= 10;
  
  return Math.max(0, score);
};