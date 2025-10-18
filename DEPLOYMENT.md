# Deployment Guide

## 🚀 Frontend Deployment (GitHub Pages)

The frontend has been built and is ready for deployment to GitHub Pages!

### What's Updated
- ✅ Production build created
- ✅ New assets with poker game included
- ✅ index.html updated with latest build files
- ✅ Ready to commit and push

### Deploy Frontend

```bash
# Stage all changes
git add .

# Commit with message
git commit -m "feat: Add Terminal Poker Room - Multiplayer WebSocket game"

# Push to GitHub
git push origin main
```

GitHub Pages will automatically deploy the new version!

## 🃏 Poker Server Deployment (Required for Poker Game)

**Important**: The poker game requires a WebSocket server running separately!

### Local Development
The poker server is already set up for local development:

```bash
cd server
npm run dev
```

Server runs on `http://localhost:3001`

### Production Deployment Options

#### Option 1: Deploy to Heroku (Recommended)

1. **Create Heroku app**
   ```bash
   cd server
   heroku create your-poker-server
   ```

2. **Configure buildpacks**
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```

3. **Deploy**
   ```bash
   git subtree push --prefix server heroku main
   ```

4. **Update frontend to use production URL**
   Edit `src/hooks/usePokerSocket.ts`:
   ```typescript
   const SOCKET_URL = process.env.VITE_POKER_SERVER_URL || 'https://your-poker-server.herokuapp.com'
   ```

#### Option 2: Deploy to Railway

1. **Push to Railway**
   ```bash
   cd server
   railway init
   railway up
   ```

2. **Get deployment URL and update frontend**

#### Option 3: Deploy to Render ⭐ (Recommended - Free Tier Available)

**Step 1: Prepare Your Repository**

The repository is now configured with:
- ✅ `render.yaml` configuration file
- ✅ `server/package.json` with Node engine specified
- ✅ Socket hooks configured for environment variables
- ✅ Health check endpoint at `/health`

**Step 2: Create Render Account & Deploy**

1. **Sign up at [render.com](https://render.com)** (free tier available)
2. **Connect GitHub** - Authorize Render to access your repositories
3. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Select your `rishabbanthiya.github.io` repository
   - Render will auto-detect `render.yaml` (or configure manually below)

**Step 3: Configure Service (if not using render.yaml)**

Manual configuration if render.yaml isn't detected:

```
Name: poker-server (or any name you prefer)
Region: Oregon (or closest to you)
Branch: main
Runtime: Node
Root Directory: server
Build Command: npm install && npm run build
Start Command: npm start
Plan: Free
```

**Step 4: Add Environment Variables** (Optional but recommended)

In Render dashboard → Environment tab, add:

```
NODE_ENV = production
TWITTER_BEARER_TOKEN = your_token_here (optional, for journalctl command)
```

**Step 5: Deploy**

- Click "Create Web Service"
- Render will automatically:
  - Install dependencies
  - Build TypeScript
  - Start the server
  - Assign a URL like `https://poker-server-abc123.onrender.com`

**Step 6: Get Your Server URL**

After deployment completes:
- Copy your service URL from Render dashboard
- Example: `https://poker-server-abc123.onrender.com`

**Step 7: Update Frontend Configuration**

Create `.env.local` in the root directory:

```bash
VITE_POKER_SERVER_URL=https://poker-server-abc123.onrender.com
```

Replace `poker-server-abc123.onrender.com` with your actual Render URL.

**Step 8: Rebuild & Redeploy Frontend**

```bash
npm run build
git add .
git commit -m "feat: Connect to production poker server"
git push origin main
```

**Step 9: Verify Deployment**

Test your server:
```bash
curl https://poker-server-abc123.onrender.com/health
```

You should see:
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

**⚠️ Important Notes for Render Free Tier:**

1. **Cold Starts**: Free tier services spin down after 15 minutes of inactivity
   - First connection may take 30-60 seconds to wake up
   - Consider upgrading to paid tier ($7/month) for always-on service

2. **Automatic Deploys**: 
   - Enabled by default
   - Every push to `main` branch triggers a redeploy

3. **Logs & Monitoring**:
   - View real-time logs in Render dashboard
   - Monitor performance and errors
   - Check `/health` endpoint for status

**Troubleshooting Render Deployment:**

**Problem**: Build fails with TypeScript errors
- **Solution**: Ensure all dependencies are in `server/package.json`
- Check Render logs for specific error messages

**Problem**: Server starts but WebSocket connections fail
- **Solution**: Verify CORS settings in `server/src/server.ts`
- Check that Socket.io transports are configured: `['websocket', 'polling']`

**Problem**: "Cannot find module" errors
- **Solution**: Ensure `Root Directory` is set to `server`
- Verify `Build Command` includes `npm install`

**Problem**: Port binding errors
- **Solution**: Server correctly uses `process.env.PORT || 3001`
- Render automatically assigns PORT - don't override it

**Using render.yaml for Easy Deployment:**

The included `render.yaml` file automates configuration:

```yaml
services:
  - type: web
    name: poker-server
    runtime: node
    region: oregon
    plan: free
    rootDir: server
    buildCommand: npm install && npm run build
    startCommand: npm start
    healthCheckPath: /health
    autoDeploy: true
```

Benefits:
- ✅ One-click deployment
- ✅ Version-controlled configuration
- ✅ Easy to replicate across environments
- ✅ Automatic health checks

**Alternative: Deploy Without render.yaml**

If you prefer manual configuration, simply:
1. Don't use render.yaml
2. Configure all settings in Render dashboard
3. Both methods work equally well

#### Option 4: Self-hosted VPS

```bash
# On your server
cd /var/www/poker-server
npm install
npm run build
npm start

# Use PM2 for process management
pm2 start dist/server.js --name poker-server
pm2 save
```

### Environment Variables

**✅ Already Configured!** The codebase now uses environment variables by default.

**Frontend** (`.env.local` in root directory):
```env
VITE_POKER_SERVER_URL=https://your-poker-server.onrender.com
```

**Server** (`.env` in server directory):
```env
NODE_ENV=production
PORT=3001
CORS_ORIGIN=*
TWITTER_BEARER_TOKEN=your_token_here
```

📖 **See [ENV_SETUP.md](ENV_SETUP.md) for detailed configuration guide**

### Frontend is Production-Ready!

The socket hooks are **already configured** to use environment variables:

```typescript
// src/hooks/usePokerSocket.ts & useBSPokerSocket.ts
const SOCKET_URL = import.meta.env.VITE_POKER_SERVER_URL || 'http://localhost:3001'
```

**Local Development** (no .env.local needed):
- Uses `http://localhost:3001` automatically
- No configuration required

**Production Deployment**:
1. Create `.env.local` with your Render URL
2. Rebuild: `npm run build`
3. Deploy to GitHub Pages

That's it! The code automatically switches between dev and production URLs.

## 📝 Current Status

### ✅ Ready for Deployment
- Frontend build complete
- All TypeScript compiles
- No linter errors
- Poker game fully integrated

### ⚠️ Note About Poker Feature
- Poker game will show "Connecting to server..." message on GitHub Pages
- Users need to have poker server URL configured
- For now, poker works only in local development
- To make it work in production, deploy the poker server first

## 🔄 Quick Deploy Script

Save this as `deploy.sh`:

```bash
#!/bin/bash

echo "🏗️  Building frontend..."
npm run build

echo "📦 Copying build files..."
cp dist/index.html .
cp -r dist/assets/* assets/

echo "✅ Build complete!"
echo ""
echo "Next steps:"
echo "1. git add ."
echo "2. git commit -m 'Deploy: Updated build'"
echo "3. git push origin main"
```

Make it executable:
```bash
chmod +x deploy.sh
```

Run it:
```bash
./deploy.sh
```

## 🌐 Access URLs

### After Deployment
- **Portfolio**: https://rishabbanthiya.github.io
- **Poker Server** (if deployed): Your-server-URL:3001

## ✅ Deployment Checklist

- [x] Frontend built successfully
- [x] New index.html copied to root
- [x] Assets copied to assets/
- [ ] Git commit created
- [ ] Pushed to GitHub
- [ ] Poker server deployed (optional)
- [ ] Frontend updated with poker server URL (optional)

## 🎮 Testing After Deployment

1. **Visit your GitHub Pages URL**
2. **Open terminal** (should appear automatically)
3. **Type `help`** - verify all commands work
4. **Type `play pong`** - test existing game
5. **Type `play dino`** - test existing game
6. **Type `play poker`** - will show server connection message

**Note**: Poker will only work if you've deployed the poker server and updated the frontend with its URL.

## 🎉 You're All Set!

Your portfolio is ready to deploy with the new Terminal Poker Room feature!

For the full poker experience, deploy the server first, then update the frontend configuration.

