# Environment Variables Setup

## Frontend Environment Variables

Create a `.env.local` file in the root directory with:

```bash
# Poker Server URL (deployed backend)
# For local development, leave empty to use http://localhost:3001
# For production, set to your Render service URL
VITE_POKER_SERVER_URL=https://your-poker-server.onrender.com
```

### Local Development
- Leave `VITE_POKER_SERVER_URL` empty or omit it
- The app will default to `http://localhost:3001`

### Production Deployment
- Set `VITE_POKER_SERVER_URL` to your deployed Render service URL
- Example: `https://poker-server-abc123.onrender.com`

---

## Server Environment Variables

Create a `.env` file in the `server/` directory with:

```bash
# Node environment
NODE_ENV=development

# Server port (Render will override this in production)
PORT=3001

# CORS origin (comma-separated list for multiple origins)
# In production, specify your frontend domain
CORS_ORIGIN=*

# Twitter API (Optional - for journalctl command)
# Get your Bearer Token from https://developer.twitter.com/en/portal/dashboard
# Required for fetching real tweets, otherwise fallback data is used
TWITTER_BEARER_TOKEN=your_bearer_token_here
```

### Required Variables
- `NODE_ENV`: Set to `production` on Render
- `PORT`: Automatically set by Render, defaults to 3001 locally

### Optional Variables
- `CORS_ORIGIN`: Restrict which domains can connect (use `*` for development)
- `TWITTER_BEARER_TOKEN`: Required for the `journalctl` command to fetch real tweets

### Getting Twitter Bearer Token
1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new app (if you haven't already)
3. Generate a Bearer Token with read permissions
4. Copy the token and set it in your `.env` file

### Render Environment Variables
When deploying to Render, add these in the dashboard:
- `NODE_ENV` = `production`
- `TWITTER_BEARER_TOKEN` = (your token) [Optional]
- `PORT` will be set automatically by Render

---

## Verification

### Frontend
After setting environment variables, restart your dev server:
```bash
npm run dev
```

Check the browser console for the socket connection URL being used.

### Server
After setting environment variables, restart your server:
```bash
cd server
npm run dev
```

Check the startup message to see if Twitter API is configured.

---

## Security Notes

⚠️ **Never commit `.env` or `.env.local` files to git!**

These files are already in `.gitignore`, but always double-check before pushing.

For production deployments:
- Use Render's built-in environment variable manager
- Never hardcode secrets in your code
- Rotate tokens regularly if compromised

