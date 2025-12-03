export const getAICodeSuggestions = async (repoStructure) => {
  // Return dummy suggestions
  return [
    { file: "src/index.js", suggestion: "Rename function 'foo' to 'initializeApp'" },
    { file: "README.md", suggestion: "Add installation instructions" },
  ];
};
