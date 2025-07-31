# Free AI Models Setup Guide for NEET Academy Chatbot

This guide shows you how to set up free AI models for your chatbot. The system now supports multiple free AI providers with automatic fallback.

## 🆓 Available Free AI Models

### 1. **Hugging Face** (Most Generous Free Tier)
- **Free Limit**: 30,000 requests/month
- **Models**: `microsoft/DialoGPT-medium`, `facebook/blenderbot-400M-distill`
- **Setup**: Get API key from [Hugging Face](https://huggingface.co/settings/tokens)

### 2. **Cohere** (Good Free Tier)
- **Free Limit**: 5 requests/minute, 100 requests/day
- **Model**: `command-light`
- **Setup**: Get API key from [Cohere](https://dashboard.cohere.ai/api-keys)

### 3. **Perplexity** (You already have this)
- **Free Limit**: Limited but available
- **Models**: `llama-3.1-8b-online`, `mixtral-8x7b-instruct`

### 4. **Local Ollama** (Completely Free - No Limits)
- **Cost**: $0 (runs on your server)
- **Models**: `llama2`, `mistral`, `neural-chat`
- **Setup**: Install Ollama on your server

## 🚀 Quick Setup

### Option 1: Hugging Face (Recommended - Most Free Requests)

1. **Get API Key**:
   - Go to [Hugging Face](https://huggingface.co/settings/tokens)
   - Create account and generate API token
   - Copy the token

2. **Add to Environment**:
   ```bash
   HUGGINGFACE_API_KEY=your_huggingface_token_here
   ```

### Option 2: Cohere (Good for Low Volume)

1. **Get API Key**:
   - Go to [Cohere Dashboard](https://dashboard.cohere.ai/api-keys)
   - Sign up and create API key
   - Copy the key

2. **Add to Environment**:
   ```bash
   COHERE_API_KEY=your_cohere_api_key_here
   ```

### Option 3: Local Ollama (Best for Privacy & No Limits)

1. **Install Ollama**:
   ```bash
   # On Ubuntu/Debian
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # On Windows (WSL)
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # On macOS
   curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. **Pull a Model**:
   ```bash
   ollama pull llama2
   ollama pull mistral
   ```

3. **Test Ollama**:
   ```bash
   ollama run llama2 "Hello, how are you?"
   ```

## 🔧 Environment Variables

Add these to your `.env` file:

```bash
# Free AI Models (Priority Order)
HUGGINGFACE_API_KEY=your_huggingface_token
COHERE_API_KEY=your_cohere_api_key

# Local Ollama (Completely Free - No Limits)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama2

# Existing Models (Fallback)
PERPLEXITY_API_KEY=your_perplexity_key
OPENAI_API_KEY=your_openai_key

# Optional: Model Configuration
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=500
OPENAI_TEMPERATURE=0.7
```

## 📊 Model Priority Order

The chatbot will try models in this order:

1. **Hugging Face** (30k free requests/month)
2. **Cohere** (5 req/min, 100 req/day)
3. **Local Ollama** (completely free, unlimited)
4. **Perplexity** (limited free tier)
5. **OpenAI** (paid service)
6. **Fallback** (pre-programmed responses)

## 🧪 Testing Your Setup

1. **Check Health Endpoint**:
   ```bash
   curl http://localhost:5000/api/chatbot/health
   ```

2. **Test Chatbot**:
   ```bash
   curl -X POST http://localhost:5000/api/chatbot/ask \
     -H "Content-Type: application/json" \
     -d '{"question": "What is NEET exam?"}'
   ```

## 💡 Tips for Free Models

### Hugging Face Tips:
- Models may take 10-30 seconds to load on first request
- Use smaller models for faster responses
- Monitor your usage in the Hugging Face dashboard

### Cohere Tips:
- Respect the rate limits (5 req/min)
- Use for simple questions to save quota
- Good for educational content

### Local Ollama Tips:
- Requires server with 4GB+ RAM
- First request loads the model (may take 1-2 minutes)
- Subsequent requests are fast
- No internet required after setup

## 🔄 Automatic Fallback

The system automatically:
- Tries free models first
- Falls back to paid models if needed
- Uses pre-programmed responses if all APIs fail
- Logs which model was used for each response

## 📈 Monitoring Usage

Check your chatbot health endpoint to see:
- Which providers are configured
- Free tier limits for each provider
- Current status of all services

```bash
GET /api/chatbot/health
```

Response:
```json
{
  "status": "ok",
  "huggingface_configured": true,
  "cohere_configured": true,
  "perplexity_configured": false,
  "openai_configured": false,
  "is_configured": true,
  "available_providers": {
    "huggingface": "Free tier (30k requests/month)",
    "cohere": "Free tier (5 req/min, 100 req/day)",
    "perplexity": null,
    "openai": null
  }
}
```

## 🆘 Troubleshooting

### Hugging Face Issues:
- Check if model is loading (first request takes time)
- Verify API token is correct
- Check usage limits in dashboard

### Cohere Issues:
- Respect rate limits
- Check API key format
- Monitor daily usage

### Local Ollama Issues:
- Ensure Ollama is running: `ollama serve`
- Check available models: `ollama list`
- Verify server has enough RAM

## 🎯 Recommended Setup for Maximum Free Usage

1. **Start with Hugging Face** (30k requests/month)
2. **Add Cohere as backup** (100 requests/day)
3. **Keep Perplexity as third option**
4. **Consider local Ollama for unlimited usage**

This setup gives you:
- **30,000+ free requests per month**
- **Multiple fallback options**
- **No cost for basic usage**
- **Complete privacy with local option** 