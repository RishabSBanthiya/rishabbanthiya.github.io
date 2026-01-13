import { BlogPost, BlogMetadata, BlogSearchResult } from '../../types/blog.types'
import { parseMarkdownFile, calculateReadTime } from '../../utils/markdownParser'

// Import blog post content
import tradingPost from './posts/multi-agent-trading.md?raw'
import sparkPost from './posts/scaling-spark-reports.md?raw'

// Parse blog posts
const parseBlogPost = (content: string, slug: string): BlogPost => {
  const { frontmatter, content: markdownContent } = parseMarkdownFile(content)
  const readTime = calculateReadTime(markdownContent)
  
  return {
    title: frontmatter.title,
    slug,
    date: frontmatter.date,
    description: frontmatter.description,
    tags: frontmatter.tags,
    content: markdownContent,
    readTime
  }
}

// Blog posts registry
const blogPosts: BlogPost[] = [
  parseBlogPost(tradingPost, 'multi-agent-trading'),
  parseBlogPost(sparkPost, 'scaling-spark-reports')
]

// Helper functions
export const getAllPosts = (): BlogMetadata[] => {
  return blogPosts.map(({ content, ...metadata }) => metadata)
}

export const getPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug)
}

export const getRecentPosts = (limit: number = 5): BlogMetadata[] => {
  return getAllPosts()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

export const getAllTags = (): string[] => {
  const allTags = blogPosts.flatMap(post => post.tags)
  return [...new Set(allTags)].sort()
}

export const getPostsByTag = (tag: string): BlogMetadata[] => {
  return getAllPosts().filter(post => 
    post.tags.some(postTag => 
      postTag.toLowerCase().includes(tag.toLowerCase())
    )
  )
}

export const searchPosts = (query: string): BlogSearchResult[] => {
  const results: BlogSearchResult[] = []
  const lowerQuery = query.toLowerCase()
  
  blogPosts.forEach(post => {
    // Search in title
    if (post.title.toLowerCase().includes(lowerQuery)) {
        results.push({
          post: { 
            title: post.title,
            slug: post.slug,
            date: post.date,
            description: post.description,
            tags: post.tags,
            readTime: post.readTime
          },
          matchType: 'title',
          matchText: post.title
        })
    }
    
    // Search in tags
    post.tags.forEach(tag => {
      if (tag.toLowerCase().includes(lowerQuery)) {
        results.push({
          post: { 
            title: post.title,
            slug: post.slug,
            date: post.date,
            description: post.description,
            tags: post.tags,
            readTime: post.readTime
          },
          matchType: 'tags',
          matchText: tag
        })
      }
    })
    
    // Search in content
    if (post.content.toLowerCase().includes(lowerQuery)) {
      const lines = post.content.split('\n')
      const matchingLine = lines.find(line => 
        line.toLowerCase().includes(lowerQuery)
      )
      
      if (matchingLine) {
        results.push({
          post: { 
            title: post.title,
            slug: post.slug,
            date: post.date,
            description: post.description,
            tags: post.tags,
            readTime: post.readTime
          },
          matchType: 'content',
          matchText: matchingLine.trim()
        })
      }
    }
  })
  
  // Remove duplicates and sort by relevance
  const uniqueResults = results.filter((result, index, self) => 
    index === self.findIndex(r => r.post.slug === result.post.slug)
  )
  
  return uniqueResults.sort((a, b) => {
    // Prioritize title matches, then tags, then content
    const priority = { title: 3, tags: 2, content: 1 }
    return priority[b.matchType] - priority[a.matchType]
  })
}

export const getPostCount = (): number => {
  return blogPosts.length
}

export const getTagCount = (): number => {
  return getAllTags().length
}
