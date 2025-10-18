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

#### Option 3: Deploy to Render

1. **Create new Web Service on Render**
2. **Connect your GitHub repo**
3. **Configure:**
   - Root Directory: `server`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. **Update frontend with URL**

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

For production, create `.env` file in server directory:

```env
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://rishabbanthiya.github.io
```

### Update Frontend for Production

In `src/hooks/usePokerSocket.ts`, change:

```typescript
// Development
const SOCKET_URL = 'http://localhost:3001'

// Production
const SOCKET_URL = process.env.VITE_POKER_SERVER_URL || 'https://your-production-server.com'
```

Then rebuild:
```bash
npm run build
```

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

