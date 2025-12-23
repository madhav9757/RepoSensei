import openai from "./llm.client.js";
import { CODE_SUGGESTIONS_PROMPT } from "./prompts.js";

export const getAICodeSuggestions = async (repoContext) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini", // Use a standard model name
    messages: [
      { role: "user", content: CODE_SUGGESTIONS_PROMPT(repoContext) }
    ],
    temperature: 0.1, // Lower temperature for more consistent JSON
    max_tokens: 2000, // Increase output space to prevent cut-offs
  });

  let output = response.choices[0].message.content.trim();

  // FIX: Remove Markdown code blocks if the AI added them
  if (output.startsWith("```")) {
    output = output.replace(/^```json|```$/g, "").trim();
  }

  try {
    return JSON.parse(output);
  } catch (err) {
    console.error("Original LLM Output:", output);
    // Fallback: If it's still cut off, we throw a more descriptive error
    throw new Error("AI output was truncated or invalid. Try narrowing your goal.");
  }
};