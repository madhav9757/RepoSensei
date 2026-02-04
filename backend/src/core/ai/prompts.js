export const CODE_SUGGESTIONS_PROMPT = (repoContext, goal) => `
You are a Staff Level Software Engineer and world-class Code Architect.
Your task is to perform an exhaustive technical audit of the provided repository context and provide high-impact, genuine improvement suggestions.

${goal ? `User Focus/Goal: ${goal}` : ""}

Repository Context (including actual file contents):
${JSON.stringify(repoContext, null, 2)}

Instructions:
1. Deep Analysis: Analyze the provided file contents for architectural flaws, performance bottlenecks, security vulnerabilities, or modern best practice violations.
2. Be Specific: Avoid generic advice like "Add comments" or "Improve names". I want deep technical improvements.
3. Genuine suggestions only: Every suggestion must be directly applicable to the code shown.
4. Impactful: Focus on changes that would significantly improve the codebase's quality or maintainability.

Return ONLY a valid JSON array with objects containing:
- file: string (the exact file path)
- suggestion: string (highly specific description of the improvement)
- priority: "high" | "medium" | "low"
- type: "architecture" | "performance" | "security" | "documentation" | "tooling"
- originalCode: string (the exact original code snippet - DO NOT MOCK THIS)
- suggestedCode: string (the refactored/improved production-ready code)

IMPORTANT:
- If you don't find a genuine improvement for a file, ignore it.
- Return 8-12 most critical suggestions covering various files and categories.
- Ensure the JSON is perfectly formatted.
- Code snippets MUST use proper indentation and Newlines (\\n).

EXAMPLE OF QUALITY EXPECTED:
[
  {
    "file": "src/api/handler.js",
    "suggestion": "Implement a centralized error handling middleware instead of try/catch blocks in every route",
    "priority": "high",
    "type": "architecture",
    "originalCode": "try {\\n  const user = await User.find(id);\\n  res.json(user);\\n} catch (err) {\\n  res.status(500).json({ error: err.message });\\n}",
    "suggestedCode": "const user = await User.find(id);\\nif (!user) throw new AppError('User not found', 404);\\nres.json(user);"
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
