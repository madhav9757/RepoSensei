import { buildRepoContext } from "./repo.context.js";
import { generateReadme } from "../ai/ai.readme.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load .env from the backend folder
dotenv.config({ path: path.join(process.cwd(), '.env') });

async function main() {
  // Using a public repo to test the logic
  const owner = "facebook"; 
  const repo = "react";

  console.log(`--- Starting RepoSensei Analysis for ${owner}/${repo} ---`);
  
  try {
    console.log("Step 1: Building repository context...");
    // Fetches repo metadata and file list
    const context = await buildRepoContext(owner, repo);
    
    console.log("Step 2: Sending context to LLM...");
    // Sends context to OpenRouter/OpenAI
    const markdown = await generateReadme(context);

    const outputPath = path.join(process.cwd(), "README.md");
    fs.writeFileSync(outputPath, markdown);
    
    console.log(`\nSUCCESS! README.md generated at: ${outputPath}`);
  } catch (error) {
    console.error("\n[Error Details]:", error.message);
    if (error.status === 404) {
      console.error("Check: Is your GITHUB_TOKEN valid? Does the repo exist?");
    }
  }
}

main();