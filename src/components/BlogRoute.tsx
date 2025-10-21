import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Terminal from './Terminal'
import BlogPost from './BlogPost'
import { getPostBySlug } from '../content/blog'
import { BlogPost as BlogPostType } from '../types/blog.types'

const BlogRoute: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>()
  const navigate = useNavigate()
  const [currentBlogPost, setCurrentBlogPost] = useState<BlogPostType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      const post = getPostBySlug(slug)
      if (post) {
        setCurrentBlogPost(post)
      } else {
        // Post not found, redirect to home
        navigate('/', { replace: true })
      }
    }
    setIsLoading(false)
  }, [slug, navigate])

  if (isLoading) {
    return (
      <div className="hero-container">
        <div className="loading-container">
          <div className="loading-spinner">⏳</div>
          <p>Loading blog post...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="hero-container">
      <Terminal />
      {currentBlogPost && (
        <BlogPost 
          post={currentBlogPost} 
          onClose={() => {
            setCurrentBlogPost(null)
            navigate('/')
          }} 
        />
      )}
    </div>
  )
}

export default BlogRoute
