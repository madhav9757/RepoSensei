import { llm } from "./llm.client.js";
import { README_PROMPT } from "./prompts.js";

export const generateReadme = async (repoContext) => {
  const response = await llm.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "user", content: README_PROMPT(repoContext) }
    ],
    temperature: 0.3,
  });

  return response.choices[0].message.content;
};
