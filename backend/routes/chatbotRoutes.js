const express = require("express");
const router = express.Router();
require("dotenv").config();

// POST /api/chatbot/ask
router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string") {
      return res
        .status(400)
        .json({ error: "Question is required and must be a string" });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error:
          "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.",
      });
    }

    // Make request to OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant for NEET Academy, a coaching institute for NEET (National Eligibility cum Entrance Test) preparation. 
            You help students with NEET-related questions, study tips, exam strategies, and general guidance about medical entrance exams.
            Keep your responses helpful, encouraging, and focused on NEET preparation.
            If asked about topics unrelated to NEET or medical entrance exams, politely redirect the conversation back to NEET preparation.`,
          },
          {
            role: "user",
            content: question,
          },
        ],
        max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 500,
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return res.status(response.status).json({
        error: data.error?.message || "Failed to get response from AI",
      });
    }

    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      return res.status(500).json({ error: "No response from AI" });
    }

    res.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
});

// GET /api/chatbot/health
router.get("/health", (req, res) => {
  const isConfigured = !!process.env.OPENAI_API_KEY;
  res.json({
    status: "ok",
    openai_configured: isConfigured,
    model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
  });
});

module.exports = router;
