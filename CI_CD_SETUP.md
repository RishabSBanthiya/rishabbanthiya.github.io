# CI/CD Pipeline Setup Guide

This repository uses GitHub Actions for automated CI/CD with two main workflows:

## 🚀 Workflows Overview

### Frontend Pipeline (`.github/workflows/frontend.yml`)
- **Triggers**: Push to `main`, pull requests affecting frontend code
- **Features**: Lint, type-check, security audit, build, and deploy to GitHub Pages
- **Deployment**: Automatic to GitHub Pages on successful main branch pushes

### Backend Pipeline (`.github/workflows/backend.yml`)
- **Triggers**: Push to `main`, pull requests affecting `server/` directory
- **Features**: TypeScript compilation, security audit, build validation
- **Deployment**: Validates build, then Render auto-deploys via webhook

## 📋 Setup Instructions

### 1. GitHub Pages Configuration

1. Go to your repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. The frontend workflow will automatically deploy to GitHub Pages

### 2. Render Backend Deployment

1. Sign up at [render.com](https://render.com) (free tier available)
2. Connect your GitHub repository
3. Create a new **Web Service**:
   - **Repository**: Select your `rishabbanthiya.github.io` repository
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free
4. Render will auto-detect the `render.yaml` configuration

### 3. Environment Variables

#### GitHub Secrets (Repository Settings → Secrets and variables → Actions)
Add these secrets for production deployment:

```
VITE_POKER_SERVER_URL=https://your-poker-server.onrender.com
```

#### Render Environment Variables (Optional)
In Render dashboard → Environment tab:
```
NODE_ENV=production
TWITTER_BEARER_TOKEN=your_token_here
```

## 🔄 How It Works

### Frontend Deployment Flow
```
git push to main
    ↓
GitHub Actions triggers
    ↓
Run quality checks (lint, type-check, audit)
    ↓
Build production bundle
    ↓
Deploy to GitHub Pages
    ↓
Site updated at https://rishabbanthiya.github.io
```

### Backend Deployment Flow
```
git push to main (server changes)
    ↓
GitHub Actions validates server code
    ↓
Render webhook triggered
    ↓
Render builds and deploys server
    ↓
Server available at https://your-poker-server.onrender.com
```

## 🛡️ Quality Gates

All deployments are blocked unless:
- ✅ ESLint passes (no errors)
- ✅ TypeScript compiles without errors
- ✅ No high-severity npm vulnerabilities
- ✅ Production build succeeds

## 📊 Status Badges

Add these badges to your README.md:

```markdown
![Frontend CI/CD](https://github.com/rishabbanthiya/rishabbanthiya.github.io/actions/workflows/frontend.yml/badge.svg)
![Backend CI/CD](https://github.com/rishabbanthiya/rishabbanthiya.github.io/actions/workflows/backend.yml/badge.svg)
```

## 🚨 Troubleshooting

### Frontend Issues

**Problem**: GitHub Pages deployment fails
- **Solution**: Check Actions tab for error details
- **Common fixes**: Fix ESLint errors, TypeScript errors, or build failures

**Problem**: Site not updating after deployment
- **Solution**: GitHub Pages can take 5-10 minutes to update
- **Check**: Verify deployment completed in Actions tab

### Backend Issues

**Problem**: Render deployment fails
- **Solution**: Check Render dashboard logs
- **Common fixes**: Fix TypeScript errors, missing dependencies, or port configuration

**Problem**: Server starts but WebSocket connections fail
- **Solution**: Verify CORS settings and Socket.io configuration
- **Check**: Test `/health` endpoint

### General Issues

**Problem**: Workflows not triggering
- **Solution**: Check file paths in workflow triggers
- **Verify**: Changes are in the correct directories

**Problem**: Builds taking too long
- **Solution**: Dependencies are cached, but first run may be slower
- **Optimize**: Consider using `npm ci` instead of `npm install`

## 🔧 Local Development

### Frontend
```bash
npm run dev          # Start development server
npm run lint         # Check for linting errors
npm run lint:fix     # Auto-fix linting errors
npm run type-check   # Check TypeScript types
npm run build        # Build for production
```

### Backend
```bash
cd server
npm run dev          # Start development server
npm run lint         # Check TypeScript compilation
npm run build        # Build TypeScript
npm start            # Start production server
```

## 📈 Monitoring

### GitHub Actions
- View workflow runs: **Actions** tab in repository
- Check build logs for detailed error information
- Monitor deployment status and timing

### Render Dashboard
- Monitor server health and performance
- View real-time logs
- Check resource usage and uptime

## 🎯 Next Steps

1. **First Deployment**: Push to main branch to trigger initial deployment
2. **Monitor**: Check Actions tab for build status
3. **Test**: Verify both frontend and backend are working
4. **Customize**: Add additional checks or notifications as needed

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Render Documentation](https://render.com/docs)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Build Documentation](https://vitejs.dev/guide/build.html)

---

**Need Help?** Check the Actions tab for detailed logs or create an issue in the repository.
