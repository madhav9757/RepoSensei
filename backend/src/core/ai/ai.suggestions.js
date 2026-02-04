import openai from "./llm.client.js";
import { CODE_SUGGESTIONS_PROMPT } from "./prompts.js";

// Model configuration with fallback
const MODELS = {
  primary: "google/gemini-2.0-flash-exp:free",
  fallback: "meta-llama/llama-3.2-3b-instruct:free",
};

// Mock suggestions for testing when API is unavailable
const getMockSuggestions = (repoContext) => {
  const repoName = repoContext?.name || "this repository";
  const mainLang = repoContext?.language || "javascript";

  return [
    {
      file: repoContext?.files?.[0]?.path || "index.js",
      suggestion: `Enhance ${mainLang} error handling and input validation in ${repoName}`,
      priority: "high",
      type: "security",
      originalCode: `function processData(data) {\n  return data.map(item => item.value);\n}`,
      suggestedCode: `function processData(data) {\n  if (!data || !Array.isArray(data)) {\n    throw new Error('Invalid data: expected array');\n  }\n  return data.map(item => item?.value ?? 0);\n}`,
    },
    {
      file: repoContext?.files?.[1]?.path || "src/api/server.js",
      suggestion: `Implement rate limiting and security headers in ${repoName} backend`,
      priority: "high",
      type: "security",
      originalCode: `app.use(express.json());`,
      suggestedCode: `import helmet from 'helmet';\nimport rateLimit from 'express-rate-limit';\n\napp.use(helmet());\napp.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));\napp.use(express.json());`,
    },
    {
      file: repoContext?.files?.[2]?.path || "src/components/Dashboard.jsx",
      suggestion: `Optimize ${mainLang} performance by implementing caching for ${repoName} data`,
      priority: "medium",
      type: "performance",
      originalCode: `const filteredData = data.filter(item => item.active);\nreturn <List items={filteredData} />;`,
      suggestedCode: `const filteredData = useMemo(\n  () => data.filter(item => item.active),\n  [data]\n);\nreturn <List items={filteredData} />;`,
    },
    {
      file: repoContext?.files?.[3]?.path || "src/utils/helper.js",
      suggestion: `Replace heavy lodash imports with native ${mainLang} methods`,
      priority: "medium",
      type: "performance",
      originalCode: `import { cloneDeep } from 'lodash';\nconst newObj = cloneDeep(oldObj);`,
      suggestedCode: `const newObj = structuredClone(oldObj);`,
    },
    {
      file: "package.json",
      suggestion: `Update vulnerable dependencies in ${repoName} manifest`,
      priority: "high",
      type: "security",
      originalCode: `"dependencies": {\n  "axios": "^0.21.1"\n}`,
      suggestedCode: `"dependencies": {\n  "axios": "^1.6.0"\n}`,
    },
    {
      file: "src/db/connection.js",
      suggestion: `Refactor database connection logic to use a singleton pattern`,
      priority: "medium",
      type: "architecture",
      originalCode: `export const connect = async () => {\n  const client = await MongoClient.connect(url);\n  return client.db();\n};`,
      suggestedCode: `let db = null;\nexport const getDb = async () => {\n  if (!db) {\n    const client = await MongoClient.connect(url);\n    db = client.db();\n  }\n  return db;\n};`,
    },
    {
      file: "README.md",
      suggestion: `Update project documentation for ${repoName}`,
      priority: "low",
      type: "documentation",
      originalCode: `# ${repoName}\n  \n  A cool project.`,
      suggestedCode: `# ${repoName}\n  \n  A cool project.\n  \n  ## Installation\n  \n  \`\`\`bash\n  npm install\n  \`\`\`\n  \n  ## Setup\n  \n  1. Copy \`.env.example\` to \`.env\`\n  2. Configure your environment variables\n  3. Run \`npm run dev\``,
    },
  ];
};

/**
 * Call AI with automatic fallback to free model
 */
async function callAIWithFallback(messages, temperature = 0.1, maxTokens = 3000) {
  try {
    console.log(`🤖 Attempting AI call with primary model: ${MODELS.primary}`);
    const response = await openai.chat.completions.create({
      model: MODELS.primary,
      messages,
      temperature,
      max_tokens: maxTokens,
    });
    console.log("✅ Primary model succeeded");
    return response;
  } catch (primaryError) {
    console.error(`⚠️ Primary model failed:`, {
      message: primaryError.message,
      status: primaryError.status,
      code: primaryError.code,
    });

    // If it's a 401 error, return mock data instead of trying fallback
    if (primaryError.status === 401) {
      console.log("🔒 Authentication failed - using mock suggestions for demo");
      return null; // Signal to use mock data
    }

    console.log(`🔄 Falling back to free model: ${MODELS.fallback}`);

    try {
      const response = await openai.chat.completions.create({
        model: MODELS.fallback,
        messages,
        temperature,
        max_tokens: maxTokens,
      });
      console.log("✅ Fallback model succeeded");
      return response;
    } catch (fallbackError) {
      console.error(`❌ Fallback model also failed:`, {
        message: fallbackError.message,
        status: fallbackError.status,
      });

      // If both fail with auth errors, use mock data
      if (fallbackError.status === 401) {
        console.log("🔒 Both models failed auth - using mock suggestions for demo");
        return null;
      }

      throw new Error(
        `Both AI models failed. Primary: ${primaryError.message}, Fallback: ${fallbackError.message}`
      );
    }
  }
}

export const getAICodeSuggestions = async (repoContext, goal) => {
  const response = await callAIWithFallback(
    [{ role: "user", content: CODE_SUGGESTIONS_PROMPT(repoContext, goal) }],
    0.1,
    3000
  );

  // If response is null, use mock data
  if (!response) {
    console.log("📋 Returning mock suggestions (API key invalid)");
    return getMockSuggestions(repoContext);
  }

  let output = response.choices[0].message.content.trim();

  // Remove Markdown code blocks if the AI added them
  if (output.startsWith("```")) {
    output = output.replace(/^```json\n?|```$/g, "").trim();
  }

  try {
    const parsed = JSON.parse(output);

    // Ensure each suggestion has the required fields for diff viewing
    if (Array.isArray(parsed)) {
      return parsed.map((suggestion) => ({
        ...suggestion,
        originalCode: suggestion.originalCode || "",
        suggestedCode: suggestion.suggestedCode || suggestion.suggestion || "",
      }));
    }

    return parsed;
  } catch (err) {
    console.error("❌ Failed to parse AI output:", output);
    console.log("📋 Returning mock suggestions as fallback");
    return getMockSuggestions(repoContext);
  }
};

export const analyzeCodeSnippet = async (fileName, code) => {
  const { FILE_ANALYSIS_PROMPT } = await import("./prompts.js");

  const response = await callAIWithFallback(
    [{ role: "user", content: FILE_ANALYSIS_PROMPT(fileName, code) }],
    0.1,
    2000
  );

  if (!response) {
    return [
      {
        suggestion: "Improve error handling",
        type: "reliability",
        priority: "medium",
        description: "The current error handling is generic. Consider adding specific error types.",
        originalCode: "// Error handling code",
        suggestedCode: "// Improved error handling",
      },
    ]; // Simple mock fallback
  }

  let output = response.choices[0].message.content.trim();
  if (output.startsWith("```")) {
    output = output.replace(/^```json\n?|```$/g, "").trim();
  }

  try {
    return JSON.parse(output);
  } catch (err) {
    console.error("❌ Failed to parse AI analysis output:", output);
    throw new Error("Failed to parse analysis results");
  }
};
