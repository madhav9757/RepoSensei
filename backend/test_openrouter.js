import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "RepoSensei",
    },
});

async function testModels() {
    const models = [
        "google/gemini-2.0-flash-exp:free",
        "meta-llama/llama-3.2-3b-instruct:free",
    ];

    console.log("🔑 API Key:", process.env.OPENROUTER_API_KEY?.substring(0, 20) + "...");
    console.log("\n");

    for (const model of models) {
        try {
            console.log(`\n🧪 Testing model: ${model}`);
            const response = await openai.chat.completions.create({
                model: model,
                messages: [{ role: "user", content: "Say hello in JSON format: {\"message\": \"hello\"}" }],
                max_tokens: 50,
            });

            console.log(`✅ SUCCESS for ${model}`);
            console.log("Response:", response.choices[0].message.content);
        } catch (error) {
            console.error(`❌ FAILED for ${model}`);
            console.error("Error details:", {
                message: error.message,
                status: error.status,
                code: error.code,
                type: error.type,
                response: error.response?.data,
            });
        }
    }
}

testModels().catch(console.error);
