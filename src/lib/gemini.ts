import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function generateWithGemini(prompt: string) {
    try {
        if (!process.env.GOOGLE_API_KEY) {
            console.warn("GOOGLE_API_KEY not found, skipping Gemini (Banana) step.");
            return null;
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini (Banana) failed:", error);
        return null;
    }
}
