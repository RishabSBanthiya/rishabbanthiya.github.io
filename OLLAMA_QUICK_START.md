# Ollama AI - Quick Start Guide

Get your AI chatbot running in 5 minutes! 🚀

## Step 1: Install Ollama

**macOS:**
```bash
brew install ollama
```

**Or download from:** https://ollama.ai

## Step 2: Start Ollama

Open a terminal and keep this running:
```bash
ollama serve
```

## Step 3: Download Base Model

In a **new terminal**:
```bash
ollama pull llama3.2:3b
```

⏱️ This will take a few minutes (~3GB download)

## Step 4: Build Your Custom Model

In your project directory:
```bash
cd /Users/rishabbanthiya/Desktop/rishabbanthiya.github.io
npm install
npm run build:ollama
```

✅ You should see: "Successfully created 'rishab-bot' model!"

## Step 5: Test It!

```bash
# Test the model directly
ollama run rishab-bot "What are Rishab's skills?"

# Or start your dev server
npm run dev
```

Open your browser, go to the terminal, and try:
```
ai What technologies does Rishab use?
ai Tell me about his experience
ai How can I contact him?
```

## That's It! 🎉

Your AI is now trained exclusively on your portfolio data.

## Updating Your AI

When you update your info in `Terminal.tsx`:

```bash
npm run build:ollama
```

Then reload your browser.

## Troubleshooting

**Error: "Ollama isn't running"**
→ Run: `ollama serve`

**Error: "Model not found"**
→ Run: `npm run build:ollama`

**Slow responses?**
→ Try a smaller model: `ollama pull llama3.2:3b`

## Need More Help?

See `OLLAMA_SETUP.md` for detailed documentation.


