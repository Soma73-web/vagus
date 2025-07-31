const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
require("dotenv").config();

// Enhanced fallback response function for when AI APIs are not available
const getFallbackResponse = (question) => {
  const lowerQuestion = question.toLowerCase();
  
  // NEET exam related responses
  if (lowerQuestion.includes("neet") || lowerQuestion.includes("exam") || lowerQuestion.includes("test")) {
    return "NEET (National Eligibility cum Entrance Test) is a medical entrance exam in India. It's conducted by NTA and is required for admission to MBBS, BDS, and other medical courses. The exam consists of Physics, Chemistry, and Biology sections. Would you like to know more about specific subjects or exam preparation strategies?";
  }
  
  // Study tips
  if (lowerQuestion.includes("study") || lowerQuestion.includes("prepare") || lowerQuestion.includes("tips")) {
    return "For NEET preparation, focus on NCERT books first, practice previous year questions, take regular mock tests, and maintain a study schedule. Biology carries the most weight (50%), followed by Chemistry (25%) and Physics (25%). Regular revision and solving practice questions is key to success!";
  }
  
  // Biology related
  if (lowerQuestion.includes("biology") || lowerQuestion.includes("bio")) {
    return "Biology is the most important subject for NEET with 50% weightage. Focus on NCERT Biology books, especially Class 11 and 12. Important topics include Human Physiology, Genetics, Ecology, and Plant Physiology. Practice diagrams and understand concepts rather than memorizing.";
  }
  
  // Chemistry related
  if (lowerQuestion.includes("chemistry") || lowerQuestion.includes("chem")) {
    return "Chemistry has 25% weightage in NEET. Focus on Physical Chemistry calculations, Organic Chemistry mechanisms, and Inorganic Chemistry facts. NCERT books are essential. Practice numerical problems regularly and understand reaction mechanisms.";
  }
  
  // Physics related
  if (lowerQuestion.includes("physics")) {
    return "Physics also has 25% weightage in NEET. Focus on Mechanics, Electromagnetism, and Optics. Practice numerical problems and understand concepts. NCERT books are important, but you may need additional reference books for better understanding.";
  }
  
  // General greeting
  if (lowerQuestion.includes("hello") || lowerQuestion.includes("hi") || lowerQuestion.includes("hey")) {
    return "Hello! I'm your NEET Academy AI assistant. I can help you with NEET preparation questions, study tips, and exam strategies. How can I assist you today?";
  }
  
  // Default response
  return "I'm here to help you with NEET preparation! You can ask me about exam strategies, study tips, specific subjects (Biology, Chemistry, Physics), or any other NEET-related questions. What would you like to know?";
};

// Try Hugging Face API (Free tier available)
const tryHuggingFace = async (question) => {
  const huggingFaceApiKey = process.env.HUGGINGFACE_API_KEY;
  
  if (!huggingFaceApiKey) {
    return null;
  }

  try {
    console.log("Trying Hugging Face API");
    
    // Try different free models
    const models = [
      "microsoft/DialoGPT-medium",
      "facebook/blenderbot-400M-distill",
      "microsoft/DialoGPT-small"
    ];
    
    for (const model of models) {
      try {
        const response = await fetch(
          `https://api-inference.huggingface.co/models/${model}`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${huggingFaceApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputs: `You are a NEET Academy AI assistant. Help with NEET preparation. User: ${question}`,
              parameters: {
                max_length: 200,
                temperature: 0.7,
                do_sample: true
              }
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data && data[0] && data[0].generated_text) {
            console.log(`Hugging Face response successful with model ${model}`);
            return {
              response: data[0].generated_text,
              model: model
            };
          }
        }
      } catch (error) {
        console.error(`Error with Hugging Face model ${model}:`, error);
        continue;
      }
    }
  } catch (error) {
    console.error("Hugging Face API error:", error);
  }
  
  return null;
};

// Try Cohere API (Free tier available)
const tryCohere = async (question) => {
  const cohereApiKey = process.env.COHERE_API_KEY;
  
  if (!cohereApiKey) {
    return null;
  }

  try {
    console.log("Trying Cohere API");
    
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${cohereApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command-light",
        prompt: `You are an AI assistant for NEET Academy, a coaching institute for NEET (National Eligibility cum Entrance Test) preparation. Help students with NEET-related questions, study tips, and exam strategies. Keep responses focused on NEET preparation.\n\nUser: ${question}\nAssistant:`,
        max_tokens: 200,
        temperature: 0.7,
        k: 0,
        stop_sequences: [],
        return_likelihoods: "NONE"
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.generations && data.generations[0] && data.generations[0].text) {
        console.log("Cohere response successful");
        return {
          response: data.generations[0].text.trim(),
          model: "cohere-command-light"
        };
      }
    }
  } catch (error) {
    console.error("Cohere API error:", error);
  }
  
  return null;
};

// Try Local Ollama (Completely Free - No Limits)
const tryLocalOllama = async (question) => {
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  const ollamaModel = process.env.OLLAMA_MODEL || "llama2";
  
  try {
    console.log("Trying Local Ollama API");
    
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: ollamaModel,
        prompt: `You are an AI assistant for NEET Academy, a coaching institute for NEET (National Eligibility cum Entrance Test) preparation. Help students with NEET-related questions, study tips, and exam strategies. Keep responses focused on NEET preparation.

User: ${question}
Assistant:`,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 300
        }
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.response) {
        console.log("Local Ollama response successful");
        return {
          response: data.response.trim(),
          model: ollamaModel
        };
      }
    }
  } catch (error) {
    console.error("Local Ollama API error:", error);
  }
  
  return null;
};

// POST /api/chatbot/ask
router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    console.log("Chatbot request received:", question);

    if (!question || typeof question !== "string") {
      return res
        .status(400)
        .json({ error: "Question is required and must be a string" });
    }

    // Check available API keys
    const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const huggingFaceApiKey = process.env.HUGGINGFACE_API_KEY;
    const cohereApiKey = process.env.COHERE_API_KEY;

    console.log("API Keys check:", {
      perplexityConfigured: !!perplexityApiKey,
      openaiConfigured: !!openaiApiKey,
      huggingFaceConfigured: !!huggingFaceApiKey,
      cohereConfigured: !!cohereApiKey
    });

    // Try free APIs first
    let result = null;

    // 1. Try Hugging Face (most generous free tier)
    if (huggingFaceApiKey) {
      result = await tryHuggingFace(question);
      if (result) {
        return res.json({
          response: result.response,
          timestamp: new Date().toISOString(),
          model: result.model,
          provider: "huggingface"
        });
      }
    }

    // 2. Try Cohere (free tier available)
    if (cohereApiKey) {
      result = await tryCohere(question);
      if (result) {
        return res.json({
          response: result.response,
          timestamp: new Date().toISOString(),
          model: result.model,
          provider: "cohere"
        });
      }
    }

    // 3. Try Local Ollama (Completely Free - No Limits)
    if (process.env.OLLAMA_URL && process.env.OLLAMA_MODEL) {
      result = await tryLocalOllama(question);
      if (result) {
        return res.json({
          response: result.response,
          timestamp: new Date().toISOString(),
          model: result.model,
          provider: "ollama"
        });
      }
    }

    // 4. Try Perplexity (if configured)
    if (perplexityApiKey) {
      console.log("Using Perplexity API");
      
      // Try different models in order of preference - using more reliable models
      const models = ["llama-3.1-8b-online", "mixtral-8x7b-instruct", "codellama-70b-instruct"];
      let lastError = null;
      
      for (const model of models) {
        try {
          console.log(`Trying Perplexity model: ${model}`);
          // Perplexity API call
          const response = await fetch("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${perplexityApiKey}`,
            },
            body: JSON.stringify({
              model: model,
              messages: [
                {
                  role: "system",
                  content: `You are an AI assistant for NEET Academy, a coaching institute for NEET (National Eligibility cum Entrance Test) preparation. You help students with NEET-related questions, study tips, exam strategies, and general guidance about medical entrance exams. Keep your responses helpful, encouraging, and focused on NEET preparation. If asked about topics unrelated to NEET or medical entrance exams, politely redirect the conversation back to NEET preparation.`,
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
          console.log(`Perplexity API response status for ${model}:`, response.status);

          if (!response.ok) {
            console.error(`Perplexity API error for ${model}:`, data);
            lastError = data.error?.message || `Failed to get response from Perplexity AI with model ${model}`;
            continue; // Try next model
          }

          const aiResponse = data.choices?.[0]?.message?.content;

          if (!aiResponse) {
            console.log(`No response content from Perplexity for ${model}`);
            lastError = `No response from Perplexity AI with model ${model}`;
            continue; // Try next model
          }

          console.log(`Perplexity response successful with model ${model}`);
          return res.json({
            response: aiResponse,
            timestamp: new Date().toISOString(),
            model: model,
            provider: "perplexity"
          });
        } catch (error) {
          console.error(`Error with Perplexity model ${model}:`, error);
          lastError = error.message;
          continue; // Try next model
        }
      }
      
      // If all models failed, return the last error
      return res.status(500).json({
        error: lastError || "All Perplexity models failed",
      });
    }

    // 5. Fallback to OpenAI if configured
    if (openaiApiKey) {
      console.log("Using OpenAI API");
      
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
      console.log("OpenAI API response status:", response.status);

      if (!response.ok) {
        console.error("OpenAI API error:", data);
        return res.status(response.status).json({
          error: data.error?.message || "Failed to get response from AI",
        });
      }

      const aiResponse = data.choices?.[0]?.message?.content;

      if (!aiResponse) {
        console.log("No response content from OpenAI");
        return res.status(500).json({ error: "No response from AI" });
      }

      console.log("OpenAI response successful");
      return res.json({
        response: aiResponse,
        timestamp: new Date().toISOString(),
        model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
        provider: "openai"
      });
    }

    // 6. If no API keys work, provide a basic fallback response
    console.log("No API keys available, using fallback responses");
    const fallbackResponse = getFallbackResponse(question);
    return res.json({
      response: fallbackResponse,
      timestamp: new Date().toISOString(),
      model: "fallback",
      provider: "fallback"
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
  const perplexityConfigured = !!process.env.PERPLEXITY_API_KEY;
  const openaiConfigured = !!process.env.OPENAI_API_KEY;
  const huggingFaceConfigured = !!process.env.HUGGINGFACE_API_KEY;
  const cohereConfigured = !!process.env.COHERE_API_KEY;
  const ollamaConfigured = !!process.env.OLLAMA_URL && !!process.env.OLLAMA_MODEL;
  const isConfigured = perplexityConfigured || openaiConfigured || huggingFaceConfigured || cohereConfigured || ollamaConfigured;
  
  res.json({
    status: "ok",
    openai_configured: openaiConfigured,
    perplexity_configured: perplexityConfigured,
    huggingface_configured: huggingFaceConfigured,
    cohere_configured: cohereConfigured,
    ollama_configured: ollamaConfigured,
    is_configured: isConfigured,
    available_providers: {
      huggingface: huggingFaceConfigured ? "Free tier (30k requests/month)" : null,
      cohere: cohereConfigured ? "Free tier (5 req/min, 100 req/day)" : null,
      perplexity: perplexityConfigured ? "Free tier available" : null,
      openai: openaiConfigured ? "Paid service" : null,
      ollama: ollamaConfigured ? "Completely free, unlimited" : null
    }
  });
});

module.exports = router;
