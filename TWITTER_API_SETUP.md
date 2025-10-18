# Twitter API Setup Guide

This guide explains how to configure the Twitter API integration for the `journalctl` command in your portfolio terminal.

## Overview

The `journalctl` command fetches and displays your recent tweets from @ri_shrub. The backend server supports two modes:

1. **Twitter API v2** (Recommended) - Official API with reliable access
2. **RSS Fallback** - Uses RSS2JSON service (may have limitations)

## Quick Setup

### Option 1: Twitter API v2 (Recommended)

#### 1. Get Twitter API Access

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Sign in with your Twitter account (@ri_shrub)
3. Create a new Project and App (or use an existing one)
4. Navigate to your App's "Keys and tokens" section
5. Generate a **Bearer Token** (under Authentication Tokens)
6. Copy the Bearer Token (you'll only see it once!)

#### 2. Configure Environment Variable

Create a `.env` file in the `server/` directory:

```bash
cd server
touch .env
```

Add your Bearer Token to `.env`:

```env
# Server Configuration
PORT=3001

# Twitter API Configuration
TWITTER_BEARER_TOKEN=your_actual_bearer_token_here
```

**Important**: Never commit `.env` to version control! It's already in `.gitignore`.

#### 3. Start the Server

```bash
cd server
npm install
npm run dev
```

You should see:
```
╔═══════════════════════════════════════╗
║   🃏  POKER SERVER ONLINE  🃏          ║
╠═══════════════════════════════════════╣
║  Port: 3001                           ║
║  Games: Texas Hold'em & BS Poker      ║
║  Twitter: ✓ Twitter API configured    ║
║  Status: Ready to deal cards          ║
╚═══════════════════════════════════════╝
```

#### 4. Test the Integration

In your portfolio terminal, run:
```bash
journalctl
```

You should see your latest 10 tweets!

### Option 2: RSS Fallback (No Setup Required)

If you don't configure `TWITTER_BEARER_TOKEN`, the server automatically falls back to using the RSS2JSON service via Nitter.

**Limitations:**
- May have rate limits
- Less reliable (depends on third-party services)
- May not always be available

**To use:**
Simply don't set `TWITTER_BEARER_TOKEN` in `.env`. The server will handle it automatically.

## Troubleshooting

### "Unable to fetch tweets from backend server"

**Problem:** Frontend can't connect to the backend.

**Solutions:**
1. Make sure the server is running: `cd server && npm run dev`
2. Check the server is on port 3001: `http://localhost:3001/health`
3. Verify CORS is configured correctly in `server/src/server.ts`

### "Failed to get user ID" or "Failed to fetch tweets"

**Problem:** Twitter API authentication failed.

**Solutions:**
1. Verify your Bearer Token is correct in `.env`
2. Check the token hasn't expired
3. Ensure your Twitter Developer App has read permissions
4. Check Twitter API status: https://api.twitterstat.us/

### "No tweets found"

**Problem:** API call succeeded but no tweets returned.

**Solutions:**
1. Verify the Twitter username is correct (`ri_shrub`)
2. Check if the account has public tweets
3. Ensure the account isn't suspended or protected

### RSS Fallback Not Working

**Problem:** No Bearer Token set and RSS fallback fails.

**Solutions:**
1. Nitter instance might be down - try setting up Twitter API instead
2. RSS2JSON service might have rate limits - wait and try again
3. Use the fallback link shown to view tweets directly

## API Endpoints

### GET `/api/tweets/:username`

Fetches recent tweets for a given username.

**Query Parameters:**
- `count` (optional): Number of tweets to fetch (default: 10, max: 100)

**Response:**
```json
{
  "success": true,
  "tweets": [
    {
      "text": "Tweet content...",
      "created_at": "2025-10-18T12:34:56.000Z",
      "url": "https://twitter.com/ri_shrub/status/..."
    }
  ],
  "source": "twitter-api" // or "rss-fallback"
}
```

**Example:**
```bash
curl http://localhost:3001/api/tweets/ri_shrub?count=5
```

## Security Best Practices

1. **Never commit `.env` files** - Always in `.gitignore`
2. **Use environment variables** - Never hardcode tokens in code
3. **Rotate tokens regularly** - Generate new tokens periodically
4. **Limit token permissions** - Only give read access to tweets
5. **Monitor usage** - Check Twitter Developer Dashboard for unusual activity

## Production Deployment

For production deployments (e.g., Heroku, Render, Vercel):

1. Set `TWITTER_BEARER_TOKEN` as an environment variable in your hosting platform
2. Update the Terminal component to use your production API URL instead of `localhost:3001`
3. Configure CORS to only allow your production domain
4. Consider implementing rate limiting to prevent abuse

## Twitter API Pricing

As of 2025, Twitter API v2 has different tiers:

- **Free Tier**: 1,500 tweets/month
- **Basic**: $100/month - 10,000 tweets/month
- **Pro**: $5,000/month - 1,000,000 tweets/month

For a personal portfolio showing recent tweets, the Free Tier should be sufficient!

## Alternative: Client-Side Integration

If you prefer not to run a backend server:

1. Use Twitter's embed widgets: https://developer.twitter.com/en/docs/twitter-for-websites/timelines/overview
2. Embed a timeline directly in your portfolio
3. No API key required, but less customization

## Support

For Twitter API support:
- Twitter Developer Community: https://twittercommunity.com/
- Twitter API Documentation: https://developer.twitter.com/en/docs

For issues with this implementation:
- Check the server logs: `cd server && npm run dev`
- Verify `.env` configuration
- Test the endpoint directly: `curl http://localhost:3001/api/tweets/ri_shrub`

---

*Last Updated: October 18, 2025*

