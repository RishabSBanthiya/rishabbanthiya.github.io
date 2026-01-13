import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BlogPost as BlogPostType } from '../types/blog.types'
import { markdownToHtml } from '../utils/markdownParser'

interface BlogPostProps {
  post: BlogPostType
  onClose: () => void
}

interface Position {
  x: number
  y: number
}

const BlogPost: React.FC<BlogPostProps> = ({ post, onClose }) => {
  const navigate = useNavigate()
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 })
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  
  const headerRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  
  const htmlContent = markdownToHtml(post.content)

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (headerRef.current && headerRef.current.contains(e.target as Node)) {
      setIsDragging(true)
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDragging, dragOffset, onClose])

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleMaximize = () => {
    setIsMaximized(!isMaximized)
  }

  const handleClose = () => {
    onClose()
    navigate('/')
  }

  if (isMinimized) {
    return (
      <div 
        className="blog-terminal-minimized"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: '8px',
          padding: '10px 15px',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-md)',
          transition: 'all 0.3s ease'
        }}
        onClick={() => setIsMinimized(false)}
      >
        <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
          {post.title}
        </span>
      </div>
    )
  }

  return (
    <div 
      className={`blog-terminal-wrapper ${isDragging ? 'dragging' : ''}`}
      style={{
        position: 'fixed',
        left: isMaximized ? '0' : `${position.x}px`,
        top: isMaximized ? '0' : `${position.y}px`,
        width: isMaximized ? '100vw' : '80vw',
        height: isMaximized ? '100vh' : '80vh',
        maxWidth: isMaximized ? 'none' : '1200px',
        maxHeight: isMaximized ? 'none' : '800px',
        zIndex: 1000,
        borderRadius: isMaximized ? '0' : '12px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-primary)',
        transition: isMaximized ? 'none' : 'all 0.3s ease',
        willChange: 'transform'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Terminal Header */}
      <div 
        className="blog-terminal-header"
        ref={headerRef}
        style={{
          background: 'var(--bg-secondary)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid var(--border-primary)',
          cursor: 'move',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <span 
            className="blog-terminal-button close"
            onClick={handleClose}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#ff5f57',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              color: 'white'
            }}
          >
            ×
          </span>
          <span 
            className="blog-terminal-button minimize"
            onClick={handleMinimize}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#ffbd2e',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              color: 'white'
            }}
          >
            −
          </span>
          <span 
            className="blog-terminal-button maximize"
            onClick={handleMaximize}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#28ca42',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              color: 'white'
            }}
          >
            {isMaximized ? '⧉' : '⧈'}
          </span>
        </div>
        <div style={{ 
          color: 'var(--text-primary)', 
          fontSize: '0.9rem',
          fontWeight: '500',
          flex: 1,
          textAlign: 'center'
        }}>
          {post.title}
        </div>
      </div>

      {/* Terminal Body */}
      <div 
        className="blog-terminal-body"
        ref={terminalRef}
        style={{
          background: 'var(--bg-primary)',
          height: 'calc(100% - 60px)',
          overflow: 'auto',
          padding: '20px',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono, "Courier New", monospace)',
          fontSize: '0.9rem',
          lineHeight: '1.6'
        }}
      >
        <div className="blog-post">
          <div className="blog-header">
            <h1 className="blog-title">{post.title}</h1>
            <div className="blog-meta">
              <span className="blog-date">{new Date(post.date).toLocaleDateString()}</span>
              <span className="blog-read-time">{post.readTime} min read</span>
            </div>
            <div className="blog-tags">
              {post.tags.map((tag, index) => (
                <span key={index} className="blog-tag">#{tag}</span>
              ))}
            </div>
            <p className="blog-description">{post.description}</p>
          </div>
          
          <div className="blog-content">
            <div 
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              className="markdown-content"
            />
          </div>
          
          <div className="blog-footer">
            <p className="output-line">────────────────────────────────────────</p>
            <p className="output-line">Press ESC or click × to close this window</p>
            <p className="output-line">Type 'blog' in main terminal for more posts</p>
            <p className="output-line"></p>
            <p className="output-line"><strong>Share this post:</strong></p>
            <p className="output-line">
              <a 
                href={`/blog/${post.slug}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{color: 'var(--accent-primary)', textDecoration: 'underline'}}
              >
                {window.location.origin}/blog/{post.slug}
              </a>
            </p>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/blog/${post.slug}`)
                // You could add a toast notification here
              }}
              style={{
                background: 'var(--accent-primary)',
                color: 'var(--bg-primary)',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '10px',
                fontSize: '0.9rem'
              }}
            >
              📋 Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPost
