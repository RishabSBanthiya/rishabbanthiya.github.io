import React, { useState, useEffect } from 'react'

interface Tweet {
  text: string
  created_at: string
  url?: string
}

interface ErrorData {
  error?: string
  message?: string
  resetTime?: number
  resetDate?: string
  rateLimitInfo?: {
    resetTime?: number
  }
}

export const JournalCtlDisplay: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [error, setError] = useState(false)
  const [source, setSource] = useState<string>('')
  const [errorData, setErrorData] = useState<ErrorData | null>(null)

  useEffect(() => {
    const fetchTweets = async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      try {
        const username = 'ri_shrub'
        const apiUrl = `http://localhost:3001/api/tweets/${username}?count=10`

        const response = await fetch(apiUrl, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json'
          }
        })

        clearTimeout(timeoutId)
        const data = await response.json()

        if (response.ok && data.success) {
          if (data.tweets && data.tweets.length > 0) {
            setTweets(data.tweets)
            setSource(data.source || 'backend')
            if (data.source === 'fallback-rate-limit' && data.rateLimitInfo) {
              setErrorData(data.rateLimitInfo)
            }
          } else {
            setTweets([])
            setSource(data.source || 'backend')
          }
          setLoading(false)
        } else {
          setErrorData(data)
          setError(true)
          setLoading(false)
        }
      } catch (err: unknown) {
        clearTimeout(timeoutId)
        if (err && typeof err === 'object' && 'message' in err) {
          setErrorData({ error: (err as Error).message })
        }
        setError(true)
        setLoading(false)
      }
    }

    fetchTweets()
  }, [])

  if (loading) {
    return (
      <div className="command-output">
        <p className="output-line">Fetching tweets from @ri_shrub...</p>
        <div className="loading-skeleton" style={{ height: '200px', background: 'var(--bg-secondary)', borderRadius: '4px', marginTop: '8px' }} />
      </div>
    )
  }

  const isRateLimited = errorData?.error === 'Rate Limit'

  if (error || tweets.length === 0) {
    const isServerDown = !errorData
    const isApiNotConfigured = errorData?.error === 'Twitter API not configured'
    const isInvalidToken = errorData?.error === 'Invalid Twitter Bearer Token'

    return (
      <div className="command-output">
        <p className="output-line"><strong>-- Logs from @ri_shrub --</strong></p>
        <p className="output-line"></p>

        {isServerDown && (
          <>
            <p className="output-line">Unable to connect to Twitter API.</p>
            <p className="output-line"></p>
            <p className="output-line">Check your internet connection and try again.</p>
            <p className="output-line"></p>
          </>
        )}

        {isApiNotConfigured && (
          <>
            <p className="output-line">Twitter API not configured</p>
            <p className="output-line"></p>
            <p className="output-line"><strong>Setup Instructions:</strong></p>
            <p className="output-line">1. Get a Bearer Token from Twitter Developer Portal</p>
            <p className="output-line">   <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer" style={{color: '#1da1f2'}}>developer.twitter.com</a></p>
            <p className="output-line"></p>
            <p className="output-line">2. Create <code>server/.env</code> file</p>
            <p className="output-line"></p>
            <p className="output-line">3. Add your token:</p>
            <p className="output-line">   <code>TWITTER_BEARER_TOKEN=your_token_here</code></p>
            <p className="output-line"></p>
            <p className="output-line">4. Restart the server</p>
            <p className="output-line"></p>
          </>
        )}

        {isInvalidToken && (
          <>
            <p className="output-line">Invalid Twitter Bearer Token</p>
            <p className="output-line"></p>
            <p className="output-line"><strong>Fix Instructions:</strong></p>
            <p className="output-line">1. Go to <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer" style={{color: '#1da1f2'}}>Twitter Developer Portal</a></p>
            <p className="output-line"></p>
            <p className="output-line">2. Sign in with your @ri_shrub account</p>
            <p className="output-line"></p>
            <p className="output-line">3. Create a new app or regenerate Bearer Token</p>
            <p className="output-line"></p>
            <p className="output-line">4. Ensure the token has "Read" permissions</p>
            <p className="output-line"></p>
            <p className="output-line">5. Update <code>server/.env</code> with the new token</p>
            <p className="output-line"></p>
            <p className="output-line">6. Restart the server</p>
            <p className="output-line"></p>
            <p className="output-line">Current token appears to be invalid or expired</p>
            <p className="output-line"></p>
          </>
        )}

        {isRateLimited && (
          <>
            <p className="output-line">{errorData?.message || "Twitter rate limit reached, try again later"}</p>
            {errorData?.resetTime ? (
              <p className="output-line">
                Try again after: {new Date(errorData.resetTime).toLocaleString()}
              </p>
            ) : errorData?.resetDate ? (
              <p className="output-line">
                Try again after: {new Date(errorData.resetDate).toLocaleString()}
              </p>
            ) : null}
            <p className="output-line"></p>
          </>
        )}

        {!isServerDown && !isApiNotConfigured && !isInvalidToken && !isRateLimited && errorData && (
          <>
            <p className="output-line">{errorData.message || 'Failed to fetch tweets'}</p>
            <p className="output-line"></p>
          </>
        )}

        <p className="output-line">View latest tweets directly:</p>
        <p className="output-line">   <a href="https://x.com/ri_shrub" target="_blank" rel="noopener noreferrer" style={{color: '#1da1f2', textDecoration: 'underline'}}>https://x.com/ri_shrub</a></p>
      </div>
    )
  }

  return (
    <div className="command-output">
      <p className="output-line"><strong>-- Logs from @ri_shrub (Latest {tweets.length} tweets) --</strong></p>
      <p className="output-line"><span style={{color: '#666', fontSize: '0.9em'}}>Source: {source}</span></p>
      {isRateLimited && errorData?.resetTime && (
        <p className="output-line"><span style={{color: '#666', fontSize: '0.9em'}}>Last updated: {new Date(errorData.resetTime - 86400000).toLocaleString()}</span></p>
      )}
      <p className="output-line"></p>

      {tweets.map((tweet, index) => {
        const date = tweet.created_at ? new Date(tweet.created_at).toLocaleString() : 'Unknown date'
        return (
          <React.Fragment key={index}>
            <p className="output-line"><span style={{color: '#555'}}>[{date}]</span></p>
            <p className="output-line">- {tweet.text}</p>
            {tweet.url && (
              <p className="output-line" style={{fontSize: '0.85em', color: '#666'}}>
                <a href={tweet.url} target="_blank" rel="noopener noreferrer" style={{color: '#1da1f2'}}>View tweet</a>
              </p>
            )}
            <p className="output-line"></p>
          </React.Fragment>
        )
      })}
      <p className="output-line">----------------------------------------</p>
      <p className="output-line">View more at: <a href="https://x.com/ri_shrub" target="_blank" rel="noopener noreferrer" style={{color: '#1da1f2'}}>@ri_shrub</a></p>
    </div>
  )
}

export default JournalCtlDisplay
