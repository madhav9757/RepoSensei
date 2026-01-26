import openai from "./llm.client.js";
import { CODE_SUGGESTIONS_PROMPT } from "./prompts.js";

// Model configuration with fallback
const MODELS = {
  primary: "google/gemini-2.0-flash-exp:free",
  fallback: "meta-llama/llama-3.2-3b-instruct:free",
};

// Mock suggestions for testing when API is unavailable
const MOCK_SUGGESTIONS = [
  {
    file: "src/utils/helper.js",
    suggestion: "Add input validation to prevent null pointer exceptions",
    priority: "high",
    type: "security",
    originalCode: `function processData(data) {
  return data.map(item => item.value);
}`,
    suggestedCode: `function processData(data) {
  if (!data || !Array.isArray(data)) {
    throw new Error('Invalid data: expected array');
  }
  return data.map(item => item?.value ?? 0);
}`,
  },
  {
    file: "src/components/Dashboard.jsx",
    suggestion: "Optimize React component with useMemo to prevent unnecessary re-renders",
    priority: "medium",
    type: "performance",
    originalCode: `const filteredData = data.filter(item => item.active);
return <List items={filteredData} />;`,
    suggestedCode: `const filteredData = useMemo(
  () => data.filter(item => item.active),
  [data]
);
return <List items={filteredData} />;`,
  },
  {
    file: "README.md",
    suggestion: "Add installation and setup instructions",
    priority: "low",
    type: "documentation",
    originalCode: `# My Project

A cool project.`,
    suggestedCode: `# My Project

A cool project.

## Installation

\`\`\`bash
npm install
\`\`\`

## Setup

1. Copy \`.env.example\` to \`.env\`
2. Configure your environment variables
3. Run \`npm run dev\``,
  },
];

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

      throw new Error(`Both AI models failed. Primary: ${primaryError.message}, Fallback: ${fallbackError.message}`);
    }
  }
}

export const getAICodeSuggestions = async (repoContext) => {
  const response = await callAIWithFallback([
    { role: "user", content: CODE_SUGGESTIONS_PROMPT(repoContext) }
  ], 0.1, 3000);

  // If response is null, use mock data
  if (!response) {
    console.log("📋 Returning mock suggestions (API key invalid)");
    return MOCK_SUGGESTIONS;
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
      return parsed.map(suggestion => ({
        ...suggestion,
        originalCode: suggestion.originalCode || "",
        suggestedCode: suggestion.suggestedCode || suggestion.suggestion || "",
      }));
    }

    return parsed;
  } catch (err) {
    console.error("❌ Failed to parse AI output:", output);
    console.log("📋 Returning mock suggestions as fallback");
    return MOCK_SUGGESTIONS;
  }
};

export const analyzeCodeSnippet = async (fileName, code) => {
  const { FILE_ANALYSIS_PROMPT } = await import("./prompts.js");

  const response = await callAIWithFallback([
    { role: "user", content: FILE_ANALYSIS_PROMPT(fileName, code) }
  ], 0.1, 2000);

  if (!response) {
    return [
      {
        suggestion: "Improve error handling",
        type: "reliability",
        priority: "medium",
        description: "The current error handling is generic. Consider adding specific error types.",
        originalCode: "// Error handling code",
        suggestedCode: "// Improved error handling"
      }
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