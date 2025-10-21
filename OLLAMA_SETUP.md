# Ollama AI Integration Setup

This portfolio uses Ollama to power the AI chatbot feature in the terminal, allowing visitors to ask questions about Rishab's skills, experience, and projects using a local LLM trained exclusively on your portfolio data.

## Why Ollama?

- ✅ **100% Free** - No API costs ever
- ✅ **Privacy** - All data stays on your machine
- ✅ **Fast** - Local processing with real-time streaming
- ✅ **Offline** - Works without internet connection
- ✅ **No rate limits** - Unlimited usage
- ✅ **Custom Training** - Only knows your portfolio data

## Prerequisites

1. **macOS/Linux/Windows** - Ollama works on all platforms
2. **Node.js 18+** - For running the build scripts
3. **4GB+ RAM** - For running the LLM (8GB recommended)
4. **~3-4GB disk space** - For the base model

## Installation Steps

### 1. Install Ollama

**macOS:**
```bash
brew install ollama
```

**Or download from:** https://ollama.ai

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
Download the installer from https://ollama.ai

### 2. Start Ollama Server

Open a terminal and run:
```bash
ollama serve
```

Keep this running in the background. You can also set it up to start automatically on boot.

### 3. Pull Base Model

In another terminal, download the base model:
```bash
# Recommended - Fast and efficient (3GB)
ollama pull llama3.2:3b

# Alternative options:
# ollama pull llama3.2:latest  # More capable (8GB)
# ollama pull mistral          # Good balance (4GB)
# ollama pull phi3             # Very fast (2GB)
```

### 4. Install Dependencies

Navigate to your project directory:
```bash
cd /Users/rishabbanthiya/Desktop/rishabbanthiya.github.io
npm install
```

This will install `tsx` and `@types/node` needed for the build script.

### 5. Build Your Custom Model

Run the build script to create your personalized AI model:
```bash
npm run build:ollama
```

This script:
- Reads the `aiKnowledgeBase` from `Terminal.tsx`
- Generates a custom Modelfile with your portfolio data
- Creates a new Ollama model called `rishab-bot`
- Configures it to ONLY respond based on your data

You should see output like:
```
🚀 Generating Ollama Modelfile for rishab-bot...
✅ Generated Modelfile at: ollama-models/rishab-bot.Modelfile
🔨 Building Ollama model "rishab-bot"...
✅ Successfully created "rishab-bot" model!
```

### 6. Test Your Model

Test the model directly:
```bash
ollama run rishab-bot "What are Rishab's skills?"
```

You should get a response based only on your portfolio data!

### 7. Run Your Portfolio

Start the development server:
```bash
npm run dev
```

Open your browser and test the AI feature in the terminal:
```
ai What technologies does Rishab use?
ai Tell me about his experience
ai How can I contact him?
```

## How It Works

### Architecture

```
Terminal.tsx (User Input)
    ↓
AIAgentResponse Component
    ↓
ollamaService.ts (API Client)
    ↓
Ollama Server (localhost:11434)
    ↓
rishab-bot Model (Your Custom LLM)
    ↓
Streaming Response (Real-time typing effect)
```

### Knowledge Base

The AI's knowledge comes from the `aiKnowledgeBase` object in `Terminal.tsx` (lines 287-329):

```typescript
const aiKnowledgeBase = {
  personal: { /* your info */ },
  skills: { /* your skills */ },
  experience: { /* your experience */ },
  projects: { /* your projects */ },
  goals: { /* your goals */ }
}
```

### Custom Model

When you run `npm run build:ollama`, the script:

1. Reads the `aiKnowledgeBase`
2. Creates a Modelfile with strict instructions:
   - ONLY answer based on the knowledge base
   - REFUSE questions outside your portfolio
   - Keep responses conversational and concise
3. Builds a custom Ollama model

The Modelfile is saved at `ollama-models/rishab-bot.Modelfile`.

## Updating Your AI

When you update your portfolio information:

1. **Edit the knowledge base** in `Terminal.tsx` (lines 287-329)
2. **Rebuild the model:**
   ```bash
   npm run build:ollama
   ```
3. **Reload your browser** to use the updated model

That's it! The AI will now know about your updates.

## Troubleshooting

### "Ollama isn't running" Error

**Solution:** Start Ollama server:
```bash
ollama serve
```

### "Custom model 'rishab-bot' not found" Error

**Solution:** Build the model:
```bash
npm run build:ollama
```

### "Failed to fetch" or Connection Refused

**Possible causes:**
1. Ollama isn't running → Run `ollama serve`
2. Wrong port → Ollama should be on `localhost:11434`
3. Firewall blocking → Check your firewall settings

### Model Responses Are Too Slow

**Solutions:**
1. Use a smaller model:
   ```bash
   ollama pull llama3.2:3b  # Faster
   ```
2. Update the Modelfile to use the smaller model
3. Close other heavy applications

### Model Gives Wrong Information

The model should ONLY use your knowledge base. If it's using general knowledge:

1. Check the Modelfile has strict instructions
2. Rebuild the model: `npm run build:ollama`
3. Test directly: `ollama run rishab-bot "What is Python?"` 
   - Should refuse or redirect to Rishab-related topics

## Advanced Configuration

### Using a Different Base Model

Edit `scripts/buildOllamaModel.ts` and change:
```typescript
FROM llama3.2:3b  // Change this line
```

Options:
- `llama3.2:3b` - Fast, good for quick responses (3GB)
- `llama3.2:latest` - More capable, better understanding (8GB)
- `mistral` - Great balance of speed and quality (4GB)
- `phi3` - Very fast, smaller model (2GB)

Then rebuild:
```bash
npm run build:ollama
```

### Adjusting Model Parameters

Edit the Modelfile parameters in `scripts/buildOllamaModel.ts`:

```typescript
PARAMETER temperature 0.7      // Creativity (0.0-1.0)
PARAMETER top_p 0.9           // Diversity (0.0-1.0)
PARAMETER num_predict 500     // Max response length
```

### Running Ollama on Different Port

If you need Ollama on a different port, update `src/services/ollamaService.ts`:

```typescript
const OLLAMA_API_URL = 'http://localhost:YOUR_PORT/api/generate';
```

### Auto-start Ollama on Boot

**macOS/Linux:**
Create a systemd service or launchd plist

**macOS (launchd):**
```bash
# Create service file
sudo nano /Library/LaunchDaemons/com.ollama.server.plist
```

Add:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.ollama.server</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/ollama</string>
        <string>serve</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
```

Load the service:
```bash
sudo launchctl load /Library/LaunchDaemons/com.ollama.server.plist
```

## Production Deployment

### Static Hosting (GitHub Pages, Netlify, Vercel)

The Ollama integration requires a local server, so it won't work on static hosting. However:

1. The portfolio will still work - the AI just won't be available
2. The error messages guide users to set up Ollama locally
3. Consider adding a fallback to the old NLP pattern matching

### Self-Hosted Server

If you deploy to a VPS:

1. Install Ollama on the server
2. Run `ollama serve` as a background service
3. Build your custom model on the server
4. Configure CORS if needed

### Docker Deployment

Create a `docker-compose.yml`:

```yaml
version: '3.8'
services:
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama-data:/root/.ollama
  
  portfolio:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - ollama

volumes:
  ollama-data:
```

## Commands Reference

```bash
# Build/rebuild the custom model
npm run build:ollama
npm run ollama:rebuild  # Same as above

# Start Ollama server
ollama serve

# Pull a model
ollama pull <model-name>

# List installed models
ollama list

# Run a model interactively
ollama run rishab-bot

# Delete a model
ollama rm rishab-bot

# Check Ollama version
ollama --version
```

## File Structure

```
rishabbanthiya.github.io/
├── scripts/
│   └── buildOllamaModel.ts        # Model generation script
├── src/
│   ├── services/
│   │   └── ollamaService.ts       # Ollama API client
│   └── components/
│       └── Terminal.tsx            # Knowledge base + UI
├── ollama-models/
│   └── rishab-bot.Modelfile       # Generated modelfile
├── OLLAMA_SETUP.md                # This file
└── package.json                   # Scripts: build:ollama
```

## FAQ

**Q: Can visitors use the AI without installing Ollama?**  
A: No, Ollama must be running locally. The AI gracefully shows setup instructions if Ollama isn't available.

**Q: Does this work on mobile?**  
A: Only if Ollama is running on a server that mobile devices can reach.

**Q: How much does this cost?**  
A: $0. Ollama is completely free and open source.

**Q: Can I use OpenAI/Claude instead?**  
A: Yes! You'd need to modify `ollamaService.ts` to call their APIs, but that requires API keys and costs money.

**Q: Is my data private?**  
A: Yes! Everything runs locally. No data is sent to external servers (unless you deploy Ollama to a remote server).

**Q: Can I use multiple models?**  
A: Yes! You can create different models for different purposes and switch between them.

## Support

- **Ollama Docs:** https://ollama.ai/docs
- **Ollama GitHub:** https://github.com/ollama/ollama
- **Model Library:** https://ollama.ai/library

## License

This Ollama integration is part of your portfolio and uses the same license.

