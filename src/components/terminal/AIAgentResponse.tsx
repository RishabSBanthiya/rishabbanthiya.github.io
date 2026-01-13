import React, { useState, useEffect } from 'react'
import { queryOllamaStream, checkOllamaStatus, checkCustomModel } from '../../services/ollamaService'
import { processFallbackAIQuery } from '../../services/fallbackAI'

// AI Agent Knowledge Base
const aiKnowledgeBase = {
  personal: {
    name: "Rishab Banthiya",
    role: "Programming Analyst at Societe Generale",
    location: "Chicago, IL",
    email: "banthiya.rishab1511@gmail.com",
    linkedin: "linkedin.com/in/rishrub",
    github: "github.com/rishabSBanthiya",
    interests: ["Data Engineering", "Quantitative Finance", "Backend Systems", "Trading Systems"],
    personality: ["Analytical", "Detail-oriented", "Collaborative"]
  },
  skills: {
    languages: ["Python", "Java", "SQL", "JavaScript"],
    frameworks: ["Apache Spark", "Pandas", "Airflow", "NumPy", "Spring Boot"],
    tools: ["Docker", "Jenkins", "Git"],
    cloud: ["Microsoft Azure", "HDInsight"],
    databases: ["PostgreSQL"]
  },
  experience: {
    current: "Programming Analyst at Societe Generale (Jul 2024 - Present)",
    previous: [
      "Technology Analyst Intern at Societe Generale (2023)",
      "Quantitative Analyst Intern at Banach Technologies (2022-2023)",
      "Software Engineering Intern at Pfizer (2022)",
      "Course Assistant at University of Illinois (2022-2023)"
    ],
    highlights: [
      "Built report delivery engine on Spark/Azure reducing query times from 45 min to under 5 min",
      "Built Python/Pandas data comparison platform for 100K+ row datasets",
      "Won 1st place AMER in company hackathon building RAG-based search tool",
      "Developed deep Q-learning trading agent for crypto markets"
    ]
  },
  education: {
    school: "University of Illinois at Urbana-Champaign",
    degree: "B.S. Computer Science + Economics",
    years: "Aug 2020 - May 2024",
    gpa: "3.8/4.0"
  },
  projects: {
    polymarket: "Live multi-agent trading system for prediction markets with four concurrent strategies",
    sports: "Sports Betting Portfolio Optimizer using Markowitz optimization and Kelly criterion"
  }
}

interface AIAgentResponseProps {
  query: string
}

export const AIAgentResponse: React.FC<AIAgentResponseProps> = ({ query }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [usedFallback, setUsedFallback] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        setIsLoading(true)
        setUsedFallback(false)

        const isRunning = await checkOllamaStatus()

        if (isRunning) {
          const hasCustomModel = await checkCustomModel()

          if (hasCustomModel) {
            try {
              for await (const chunk of queryOllamaStream(query)) {
                setDisplayedText(prev => prev + chunk)
              }
              setIsLoading(false)
              return
            } catch (ollamaError) {
              // Fall through to fallback
            }
          }
        }

        setUsedFallback(true)
        const fallbackResponse = processFallbackAIQuery(query, aiKnowledgeBase)
        setDisplayedText(fallbackResponse)
        setIsLoading(false)
      } catch {
        setUsedFallback(true)
        const fallbackResponse = processFallbackAIQuery(query, aiKnowledgeBase)
        setDisplayedText(fallbackResponse)
        setIsLoading(false)
      }
    }

    fetchResponse()
  }, [query])

  // Typing effect for fallback mode
  useEffect(() => {
    if (usedFallback && !isLoading && currentIndex < displayedText.length) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1)
      }, 15)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, displayedText, isLoading, usedFallback])

  const displayText = usedFallback ? displayedText.substring(0, currentIndex) : displayedText
  const showCursor = isLoading || (usedFallback && currentIndex < displayedText.length)

  return (
    <div className="command-output">
      <div className="ai-agent-response">
        <div className="ai-prompt">
          <span className="ai-name">
            shrub&apos;s bot{usedFallback ? ' (smart mode)' : ' (powered by Ollama)'}:
          </span>
        </div>
        <div className="ai-content">
          <pre style={{ whiteSpace: 'pre-wrap' }}>{displayText}</pre>
          {showCursor && <span className="typing-cursor">|</span>}
        </div>
      </div>
    </div>
  )
}

export default AIAgentResponse
