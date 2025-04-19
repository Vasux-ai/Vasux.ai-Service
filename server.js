import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import CHAT_PROMPT from "./prompt.js"


const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is required");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            
            const result = await model.generateContent({ 
                systemInstruction: CHAT_PROMPT,
                contents: [{ parts: [{ text: message }] }] });

        res.json({ reply: result.response.candidates[0].content.parts[0].text || "No response" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(process.env.PORT || 5000, () => console.log("Server running..."));
