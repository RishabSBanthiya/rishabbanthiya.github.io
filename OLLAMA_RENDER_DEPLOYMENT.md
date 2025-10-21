# Ollama + Render Deployment Guide

This guide explains how to deploy your portfolio with Ollama AI integration to Render using Docker.

## 🎯 What This Achieves

Your portfolio will have **full AI capabilities** in production:
- ✅ **Real Ollama LLM** running on Render
- ✅ **Custom-trained model** (rishab-bot) with your portfolio data
- ✅ **Streaming responses** with real-time typing effect
- ✅ **No API costs** - completely free
- ✅ **Privacy-first** - all data stays on your server

## 🏗️ Architecture

```
Render Container
├── Frontend (React + Vite)
├── Nginx (Web Server + Proxy)
├── Ollama Server
└── Custom rishab-bot Model
```

**How it works:**
1. Nginx serves your React frontend
2. Nginx proxies `/api/*` requests to Ollama
3. Ollama runs your custom `rishab-bot` model
4. Users get AI responses powered by your portfolio data

## 📋 Prerequisites

1. **Render Account** - Sign up at [render.com](https://render.com)
2. **GitHub Repository** - Your code must be in a GitHub repo
3. **Starter Plan** - Ollama requires more resources than the free plan

## 🚀 Deployment Steps

### Step 1: Prepare Your Repository

Make sure these files are in your repository root:
```
rishabbanthiya.github.io/
├── Dockerfile              ← New
├── nginx.conf              ← New  
├── start.sh                ← New
├── render.yaml             ← Updated
├── ollama-models/
│   └── rishab-bot.Modelfile
└── src/services/
    └── ollamaService.ts    ← Updated
```

### Step 2: Deploy to Render

#### Option A: Using render.yaml (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add Ollama Docker deployment"
   git push origin main
   ```

2. **Connect to Render:**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click **"New +"** → **"Blueprint"**
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml`

3. **Deploy:**
   - Click **"Apply"** to deploy both services
   - Wait for deployment to complete (5-10 minutes)

#### Option B: Manual Setup

1. **Create Web Service:**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository

2. **Configure Service:**
   - **Name:** `rishab-portfolio-ai`
   - **Runtime:** `Docker`
   - **Dockerfile Path:** `./Dockerfile`
   - **Plan:** `Starter` (required for Ollama)
   - **Region:** `Oregon (US West)`

3. **Deploy:**
   - Click **"Create Web Service"**
   - Wait for deployment to complete

### Step 3: Verify Deployment

1. **Check Health:**
   - Visit `https://your-app.onrender.com/health`
   - Should return "healthy"

2. **Test AI:**
   - Visit your portfolio URL
   - Open terminal and type: `ai What are Rishab's skills?`
   - Should get AI response powered by Ollama

3. **Check Logs:**
   - In Render dashboard, go to **"Logs"**
   - Look for: "✅ rishab-bot model created successfully!"

## 🔧 Configuration Details

### Dockerfile Breakdown

```dockerfile
# Multi-stage build
FROM node:18-alpine AS frontend-builder
# Build React app

FROM ollama/ollama:latest
# Install nginx
# Copy frontend
# Copy model files
# Start both Ollama and nginx
```

### Nginx Configuration

- **Port 80:** Serves React frontend
- **Port 11434:** Ollama API (internal)
- **Proxy:** `/api/*` → Ollama
- **Rate Limiting:** 10 requests/minute for AI
- **Caching:** Static assets cached for 1 year

### Startup Script

The `start.sh` script:
1. Starts Ollama server
2. Waits for Ollama to be ready
3. Creates the custom model if needed
4. Starts nginx web server

## 💰 Cost Considerations

### Render Pricing

- **Starter Plan:** $7/month
- **Includes:** 512MB RAM, 1GB disk
- **Sufficient for:** Ollama + small model (llama3.2:3b)

### Resource Usage

- **RAM:** ~400MB for Ollama + model
- **Disk:** ~3GB for model + frontend
- **CPU:** Moderate usage during AI responses

### Optimization Tips

1. **Use smaller models:**
   ```bash
   # In buildOllamaModel.ts, change:
   FROM llama3.2:3b  # 3GB - recommended
   # FROM llama3.2:latest  # 8GB - too large for starter plan
   ```

2. **Monitor usage:**
   - Check Render metrics
   - Upgrade plan if needed

## 🐛 Troubleshooting

### Common Issues

#### 1. "Model not found" Error

**Symptoms:** AI shows "rishab-bot model not found"
**Solution:** Check logs for model creation errors

```bash
# In Render logs, look for:
✅ rishab-bot model created successfully!
```

#### 2. "Ollama isn't running" Error

**Symptoms:** AI shows connection error
**Solution:** Check if Ollama started properly

```bash
# In Render logs, look for:
✅ Ollama is ready!
```

#### 3. Slow AI Responses

**Symptoms:** AI takes 10+ seconds to respond
**Causes:**
- First request loads model into memory
- Render starter plan has limited CPU
- Large model size

**Solutions:**
- Use smaller model (llama3.2:3b)
- Upgrade to higher plan
- Wait for model to load

#### 4. "Rate limit exceeded" Error

**Symptoms:** 429 errors in browser console
**Solution:** Nginx rate limiting is working
- Wait 1 minute between requests
- Or increase rate limit in nginx.conf

#### 5. Deployment Fails

**Symptoms:** Build fails or service won't start
**Common causes:**
- Dockerfile syntax error
- Missing files
- Insufficient resources

**Solutions:**
- Check build logs in Render
- Verify all files are committed
- Try upgrading to higher plan

### Debug Commands

Check if everything is working:

```bash
# Test health endpoint
curl https://your-app.onrender.com/health

# Test Ollama API
curl https://your-app.onrender.com/api/tags

# Test AI generation
curl -X POST https://your-app.onrender.com/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"rishab-bot","prompt":"What are Rishab'\''s skills?","stream":false}'
```

## 🔄 Updating Your AI

### Update Knowledge Base

1. **Edit knowledge:**
   ```typescript
   // In src/components/Terminal.tsx
   const aiKnowledgeBase = {
     // Update your information here
   }
   ```

2. **Rebuild model:**
   ```bash
   npm run build:ollama
   ```

3. **Commit and push:**
   ```bash
   git add .
   git commit -m "Update AI knowledge base"
   git push
   ```

4. **Redeploy:**
   - Render will automatically rebuild
   - New model will be created with updated data

### Update Model Parameters

Edit `scripts/buildOllamaModel.ts`:

```typescript
// Adjust these parameters
PARAMETER temperature 0.7    // 0.0-1.0 (creativity)
PARAMETER top_p 0.9         // 0.0-1.0 (diversity)
PARAMETER num_predict 500   // Max response length
```

## 📊 Monitoring

### Render Dashboard

- **Metrics:** CPU, Memory, Disk usage
- **Logs:** Real-time application logs
- **Health:** Service health status

### Key Metrics to Watch

- **Memory Usage:** Should stay under 512MB
- **Response Time:** AI responses should be <5 seconds
- **Error Rate:** Should be minimal

### Alerts

Set up alerts for:
- High memory usage (>80%)
- High error rate (>5%)
- Service downtime

## 🔒 Security

### What's Protected

- **Rate Limiting:** Prevents abuse
- **CORS:** Configured for your domain
- **Headers:** Security headers added
- **Model Data:** Only your portfolio data

### Best Practices

1. **Keep model updated** with current information
2. **Monitor usage** for unusual patterns
3. **Regular updates** to dependencies
4. **Backup model** files in repository

## 🚀 Advanced Configuration

### Custom Domain

1. **Add domain in Render:**
   - Go to service settings
   - Add custom domain
   - Update DNS records

2. **Update nginx config:**
   ```nginx
   server_name your-domain.com;
   ```

### Environment Variables

Add to Render dashboard:

```bash
# Optional: Force specific model
OLLAMA_MODEL=rishab-bot

# Optional: Custom model parameters
OLLAMA_TEMPERATURE=0.7
OLLAMA_TOP_P=0.9
```

### Scaling

For high traffic:

1. **Upgrade Plan:**
   - Starter → Standard → Pro
   - More RAM and CPU

2. **Load Balancing:**
   - Multiple instances
   - Shared model storage

3. **Caching:**
   - Redis for model responses
   - CDN for static assets

## 📚 File Reference

### Key Files Created

- **`Dockerfile`** - Multi-stage build with Ollama
- **`nginx.conf`** - Web server + API proxy
- **`start.sh`** - Startup script
- **`render.yaml`** - Render configuration

### Key Files Modified

- **`src/services/ollamaService.ts`** - Production URL support
- **`render.yaml`** - Added Docker service

## 🎉 Success Checklist

After deployment, verify:

- [ ] Portfolio loads at your Render URL
- [ ] Health check returns "healthy"
- [ ] AI responds to questions
- [ ] AI only knows your portfolio data
- [ ] Responses stream in real-time
- [ ] No console errors
- [ ] Mobile responsive

## 🆘 Support

### Common Questions

**Q: Why does it cost $7/month?**
A: Ollama requires more resources than the free plan. The starter plan provides enough RAM and CPU.

**Q: Can I use the free plan?**
A: No, Ollama needs at least 512MB RAM. The free plan only provides 256MB.

**Q: Will it work on other platforms?**
A: Yes! The Docker setup works on any platform that supports Docker (Railway, Fly.io, etc.).

**Q: Can I use a different model?**
A: Yes! Edit the `FROM` line in `buildOllamaModel.ts` and rebuild.

**Q: How do I update the AI?**
A: Edit the knowledge base in `Terminal.tsx` and push to GitHub. Render auto-deploys.

### Getting Help

1. **Check Render logs** first
2. **Test locally** with Docker
3. **Check this guide** for common issues
4. **Render Support** for platform issues

## 🎯 Next Steps

1. ✅ Deploy to Render
2. ✅ Test AI functionality
3. ✅ Share your portfolio!
4. ✅ Monitor usage and performance
5. ✅ Update AI knowledge as you grow

Your portfolio now has **professional AI capabilities** running in production! 🚀

---

**Need help?** Check the logs in Render dashboard or refer to the troubleshooting section above.
