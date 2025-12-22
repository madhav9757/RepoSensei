import openai from "./llm.client.js";
import { CODE_SUGGESTIONS_PROMPT } from "./prompts.js";

export const getAICodeSuggestions = async (repoContext) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "user", content: CODE_SUGGESTIONS_PROMPT(repoContext) }
    ],
    temperature: 0.2,
  });

  const output = response.choices[0].message.content;

  try {
    return JSON.parse(output);
  } catch (err) {
    throw new Error("Invalid JSON returned from LLM");
  }
};
