import openai from "./llm.client.js"; // Changed from { llm } to openai
import { README_PROMPT } from "./prompts.js";

export const generateReadme = async (repoContext) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // Note: gpt-4.1-mini doesn't exist, changed to 4o-mini
    messages: [
      { role: "user", content: README_PROMPT(repoContext) }
    ],
    temperature: 0.3,
  });

  return response.choices[0].message.content;
};