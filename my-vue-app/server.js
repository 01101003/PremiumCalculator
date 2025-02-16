import express from "express";
import cors from "cors";
import { OpenAI } from "openai";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: "0e2908f8978944f283f0257816d24ebd",
  baseURL: "https://api.aimlapi.com/v1",
});

app.post("/chat", async (req, res) => {
  try {
    const { userMessage } = req.body;

    if (!userMessage || userMessage.trim() === "") {
      return res.status(400).json({ error: "User message cannot be empty." });
    }

    const response = await openai.chat.completions.create({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        { role: "system", content: "You are a helpful AI assistant which helps users solve math problems." },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 256,
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: error.message || "Something went wrong!" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
