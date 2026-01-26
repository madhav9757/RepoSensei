export const CODE_SUGGESTIONS_PROMPT = (repoContext) => `
You are a senior software engineer and code reviewer.

Analyze the following repository context and provide improvement suggestions.

Repository Context:
${JSON.stringify(repoContext, null, 2)}

Return ONLY a valid JSON array with objects containing:
- file: string (file path)
- suggestion: string (brief description of the improvement)
- priority: "high" | "medium" | "low"
- type: "architecture" | "performance" | "security" | "documentation" | "tooling"
- originalCode: string (the current code snippet that needs improvement - extract relevant lines)
- suggestedCode: string (the improved version of the code)

IMPORTANT:
1. Include actual code snippets in originalCode and suggestedCode
2. Keep code snippets focused (5-20 lines max)
3. Ensure suggestedCode is a complete, working replacement
4. Return valid JSON only, no markdown formatting
5. Limit to 3-5 most impactful suggestions

Example format:
[
  {
    "file": "src/utils/helper.js",
    "suggestion": "Add input validation to prevent null pointer exceptions",
    "priority": "high",
    "type": "security",
    "originalCode": "function processData(data) {\\n  return data.map(item => item.value);\\n}",
    "suggestedCode": "function processData(data) {\\n  if (!data || !Array.isArray(data)) {\\n    throw new Error('Invalid data');\\n  }\\n  return data.map(item => item?.value ?? 0);\\n}"
  }
]
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
export const FILE_ANALYSIS_PROMPT = (fileName, code) => `
You are a senior software engineer and code reviewer.

Analyze the following code file and provide specific improvement suggestions.

File: ${fileName}

Code:
${code}

Return ONLY a valid JSON array with objects containing:
- suggestion: string (brief description)
- type: "bug" | "optimization" | "security" | "style" | "refactoring"
- priority: "high" | "medium" | "low"
- description: string (detailed explanation of why this change is needed)
- originalCode: string (the specific block of code to change)
- suggestedCode: string (the improved version of the code)

IMPORTANT:
1. Focus on the provided code only.
2. Return 1-3 high-quality suggestions.
3. Be specific and actionable.
4. Return valid JSON only.
`;
