import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:4000", // or your deployed site
    "X-Title": "RepoSensei",                 // your app name
  },
});

export default openai;
