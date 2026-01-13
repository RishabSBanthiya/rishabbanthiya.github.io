import React, { useState, useEffect } from 'react'

export const WeatherDisplay: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [weatherData, setWeatherData] = useState<string>('')

  useEffect(() => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    fetch('https://wttr.in/?format=j1', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(res => {
        clearTimeout(timeoutId)
        if (res.status === 200) {
          return res.json()
        } else {
          throw new Error('Non-200 response')
        }
      })
      .then(data => {
        const current = data.current_condition[0]
        const location = data.nearest_area[0]
        const weatherText = `Weather for ${location.areaName[0].value}, ${location.region[0].value}
========================
Condition: ${current.weatherDesc[0].value}
Temperature: ${current.temp_F}F (${current.temp_C}C)
Feels like: ${current.FeelsLikeF}F
Humidity: ${current.humidity}%
Wind: ${current.windspeedMiles} mph ${current.winddir16Point}
Visibility: ${current.visibility} mi

Data from wttr.in`
        setWeatherData(weatherText)
        setLoading(false)
      })
      .catch(() => {
        clearTimeout(timeoutId)
        setLoading(false)
        setError(true)
      })
  }, [])

  if (loading) {
    return (
      <div className="command-output">
        <p className="output-line">Fetching weather data from wttr.in...</p>
        <div className="loading-skeleton" style={{ height: '120px', background: 'var(--bg-secondary)', borderRadius: '4px', marginTop: '8px' }} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="command-output">
        <p className="output-line error">Unable to fetch weather data</p>
        <p className="output-line">Unable to fetch weather data at this time.</p>
      </div>
    )
  }

  return (
    <div className="command-output">
      <pre>{weatherData}</pre>
    </div>
  )
}

export default WeatherDisplay
