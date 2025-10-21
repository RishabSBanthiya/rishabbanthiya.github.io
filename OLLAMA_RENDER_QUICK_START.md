# Ollama + Render Quick Start

Get your AI-powered portfolio running on Render in 5 minutes! 🚀

## ⚡ Quick Deploy

### 1. Push to GitHub
```bash
git add .
git commit -m "Add Ollama Docker deployment"
git push origin main
```

### 2. Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repo
4. Click **"Apply"** to deploy

### 3. Wait & Test
- Wait 5-10 minutes for deployment
- Visit your Render URL
- Test: `ai What are Rishab's skills?`

## 🎯 What You Get

- ✅ **Real AI** powered by Ollama
- ✅ **Custom model** trained on your data
- ✅ **Streaming responses** with typing effect
- ✅ **100% Free** (except $7/month Render plan)
- ✅ **Privacy-first** - no external APIs

## 💰 Cost

- **Render Starter Plan:** $7/month
- **Ollama:** Free
- **Total:** $7/month for full AI capabilities

## 🔧 Requirements

- GitHub repository
- Render account
- Starter plan (required for Ollama)

## 🐛 Quick Fixes

### AI Not Working?
1. Check Render logs for errors
2. Look for "✅ rishab-bot model created successfully!"
3. Wait 2-3 minutes after deployment

### Slow Responses?
- First response loads model (10-30 seconds)
- Subsequent responses are faster (<5 seconds)
- Normal behavior!

### "Model not found" Error?
- Check if model creation succeeded in logs
- May need to restart service

## 📊 Monitor

- **Health:** `https://your-app.onrender.com/health`
- **Logs:** Render Dashboard → Your Service → Logs
- **Metrics:** CPU, Memory, Response Time

## 🔄 Update AI

1. Edit `src/components/Terminal.tsx` (knowledge base)
2. `git add . && git commit -m "Update AI" && git push`
3. Render auto-deploys!

## 🎉 Done!

Your portfolio now has professional AI capabilities running in production!

**Need help?** Check `OLLAMA_RENDER_DEPLOYMENT.md` for detailed troubleshooting.
