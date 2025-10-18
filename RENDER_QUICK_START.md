# Render Deployment Quick Start Guide

## 🎯 Deploy Your Poker Server to Render in 5 Minutes

### Prerequisites
- ✅ GitHub account
- ✅ Render account (sign up at [render.com](https://render.com) - free!)
- ✅ This repository pushed to GitHub

---

## 🚀 Step-by-Step Deployment

### 1️⃣ Go to Render Dashboard
- Visit [render.com](https://render.com)
- Sign in or create account (can use GitHub login)

### 2️⃣ Create New Web Service
- Click **"New +"** button
- Select **"Web Service"**

### 3️⃣ Connect Repository
- Connect your GitHub account if not already connected
- Find and select `rishabbanthiya.github.io` repository

### 4️⃣ Configure Service

**If render.yaml is detected (automatic):**
- ✅ Render will use the configuration automatically
- Just click "Apply" and skip to step 5

**If manual configuration is needed:**
```
Name:           poker-server
Region:         Oregon (or your preferred region)
Branch:         main
Runtime:        Node
Root Directory: server
Build Command:  npm install && npm run build
Start Command:  npm start
Instance Type:  Free
```

### 5️⃣ Add Environment Variables (Optional)
Click **"Advanced"** → **"Add Environment Variable"**

```
Key: NODE_ENV
Value: production
```

```
Key: TWITTER_BEARER_TOKEN
Value: your_twitter_token (optional - leave blank if not using Twitter features)
```

### 6️⃣ Deploy!
- Click **"Create Web Service"**
- Wait 2-3 minutes for build to complete
- ✅ You'll see "Live" status when ready

### 7️⃣ Get Your Server URL
- Copy the URL from Render dashboard
- Format: `https://poker-server-abc123.onrender.com`
- Test it: `curl https://poker-server-abc123.onrender.com/health`

---

## 🔗 Connect Frontend to Server

### Option A: For Production (GitHub Pages)

1. **Create `.env.local` in root directory:**
```bash
VITE_POKER_SERVER_URL=https://poker-server-abc123.onrender.com
```
(Replace with your actual Render URL)

2. **Rebuild and deploy:**
```bash
npm run build
git add .
git commit -m "Connect to production poker server"
git push origin main
```

3. **Done!** GitHub Pages will automatically deploy with the new URL.

### Option B: For Local Testing with Production Server

1. **Create `.env.local`:**
```bash
VITE_POKER_SERVER_URL=https://poker-server-abc123.onrender.com
```

2. **Restart dev server:**
```bash
npm run dev
```

3. **Test locally with production backend!**

---

## 🧪 Verify Everything Works

### Test Backend Health
```bash
curl https://your-poker-server.onrender.com/health
```

Expected response:
```json
{
  "status": "online",
  "pokerRooms": 0,
  "pokerPlayers": 0,
  "bsPokerRooms": 0,
  "bsPokerPlayers": 0,
  "uptime": 123.45
}
```

### Test Frontend Connection
1. Open your portfolio: `https://rishabbanthiya.github.io`
2. Open terminal in the portfolio
3. Type: `play poker`
4. You should connect successfully and see the poker lobby!

---

## 📊 Monitor Your Deployment

### View Logs
- Go to Render dashboard
- Select your service
- Click **"Logs"** tab
- See real-time server activity

### Check Metrics
- Dashboard shows:
  - CPU usage
  - Memory usage
  - Request count
  - Response times

---

## 🐛 Troubleshooting

### ❌ Build Failed
**Problem:** TypeScript compilation errors

**Solution:**
1. Check Render logs for specific errors
2. Verify `server/package.json` has all dependencies
3. Ensure Node version is compatible (>=16)

### ❌ Service Running but Can't Connect
**Problem:** WebSocket connection fails

**Solutions:**
- ✅ Check CORS settings allow your domain
- ✅ Verify you're using `wss://` (not `ws://`) for secure WebSocket
- ✅ Confirm frontend has correct `VITE_POKER_SERVER_URL`

### ⏱️ Slow First Connection
**Problem:** Takes 30-60 seconds to connect

**This is normal for free tier!**
- Free services "spin down" after 15 minutes inactive
- First request "wakes up" the service
- Subsequent requests are instant
- **Solution:** Upgrade to paid tier ($7/month) for always-on service

### 🔄 Changes Not Deploying
**Problem:** Pushed code but nothing changed

**Solutions:**
- Check if auto-deploy is enabled (should be by default)
- Manually trigger deploy from Render dashboard
- Verify you pushed to correct branch (`main`)

---

## 💰 Cost Breakdown

### Free Tier
- ✅ **$0/month**
- ✅ 750 hours/month
- ✅ Perfect for personal projects
- ⚠️ Spins down after 15 min inactive
- ⚠️ 30-60 second cold start

### Starter Tier ($7/month)
- ✅ Always-on (no spin down)
- ✅ Instant connections
- ✅ Better performance
- ✅ Recommended for production

---

## 🔄 Automatic Deploys

Every time you push to GitHub:
1. Render detects the push
2. Automatically builds and deploys
3. Zero downtime during deploy
4. Old version serves traffic until new version is ready

**No manual work needed after initial setup!**

---

## 📚 Additional Resources

- **Full Deployment Guide:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Environment Variables:** [ENV_SETUP.md](ENV_SETUP.md)
- **Render Documentation:** [render.com/docs](https://render.com/docs)
- **Poker Game Guide:** [POKER_GUIDE.md](POKER_GUIDE.md)

---

## ✅ Deployment Checklist

- [ ] Render account created
- [ ] GitHub repo connected
- [ ] Web service created with correct settings
- [ ] Service deployed successfully (shows "Live")
- [ ] Health check endpoint working
- [ ] Frontend `.env.local` created with server URL
- [ ] Frontend rebuilt and deployed
- [ ] Tested poker connection from portfolio
- [ ] Everything works! 🎉

---

## 🎉 Success!

Your poker server is now deployed and accessible worldwide!

**Server URL:** `https://your-poker-server.onrender.com`  
**Portfolio:** `https://rishabbanthiya.github.io`

Now anyone can play multiplayer poker through your terminal interface! 🃏

---

## 🆘 Need Help?

Common issues and solutions:
- Check Render logs first
- Verify all settings match this guide
- Test health endpoint
- Check browser console for errors
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for detailed troubleshooting

Still stuck? Check:
- Render community forums
- Render documentation
- Socket.io documentation

