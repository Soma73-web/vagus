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

    // Prefer Perplexity API key if present, otherwise use OpenAI
    const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!perplexityApiKey && !openaiApiKey) {
      return res.status(500).json({
        error:
          "No AI API key configured. Please add PERPLEXITY_API_KEY or OPENAI_API_KEY to your environment variables.",
      });
    }

    // Use Perplexity API if key is present
    if (perplexityApiKey) {
      // Example Perplexity API call (update endpoint and payload as needed)
      const response = await fetch("https://api.perplexity.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${perplexityApiKey}`,
        },
        body: JSON.stringify({
          model: "pplx-70b-chat", // or your preferred model
          messages: [
            {
              role: "system",
              content: `You are an AI assistant for NEET Academy, a coaching institute for NEET (National Eligibility cum Entrance Test) preparation. \nYou help students with NEET-related questions, study tips, exam strategies, and general guidance about medical entrance exams.\nKeep your responses helpful, encouraging, and focused on NEET preparation.\nIf asked about topics unrelated to NEET or medical entrance exams, politely redirect the conversation back to NEET preparation.`,
            },
            {
              role: "user",
              content: question,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Perplexity API error:", data);
        return res.status(response.status).json({
          error: data.error?.message || "Failed to get response from Perplexity AI",
        });
      }

      const aiResponse = data.choices?.[0]?.message?.content;

      if (!aiResponse) {
        return res.status(500).json({ error: "No response from Perplexity AI" });
      }

      return res.json({
        response: aiResponse,
        timestamp: new Date().toISOString(),
      });
    }

    // Fallback to OpenAI if Perplexity is not configured
    if (!openaiApiKey) {
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
        Authorization: `Bearer ${openaiApiKey}`,
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
