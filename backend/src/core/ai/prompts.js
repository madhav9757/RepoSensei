export const CODE_SUGGESTIONS_PROMPT = (repoContext) => `
You are a senior software engineer and code reviewer.

Analyze the following repository context and provide improvement suggestions.

Repository Context:
${JSON.stringify(repoContext, null, 2)}

Return ONLY a JSON array with objects:
- file
- suggestion
- priority (high | medium | low)
- type (architecture | performance | security | documentation | tooling)
`;

export const README_PROMPT = (repoContext) => `
You are a senior software engineer.

Generate a professional README.md in Markdown format.

Repository Context:
${JSON.stringify(repoContext, null, 2)}

Include:
- Project Overview
- Features
- Folder Structure
- Installation
- Usage
- Environment Variables
- Future Improvements

Return ONLY Markdown.
`;
