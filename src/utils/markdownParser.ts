import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'

// Configure marked with syntax highlighting
marked.use(markedHighlight({
  highlight(code: string, lang: string) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  }
}))

export interface Frontmatter {
  title: string
  date: string
  description: string
  tags: string[]
}

export function parseMarkdownFile(content: string): { frontmatter: Frontmatter; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    throw new Error('Invalid markdown file: missing frontmatter')
  }
  
  const frontmatterYaml = match[1]
  const markdownContent = match[2]
  
  // Parse YAML frontmatter (simple parser for our use case)
  const frontmatter: Partial<Frontmatter> = {}
  const lines = frontmatterYaml.split('\n')
  
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    
    const colonIndex = trimmed.indexOf(':')
    if (colonIndex === -1) continue
    
    const key = trimmed.substring(0, colonIndex).trim()
    let value = trimmed.substring(colonIndex + 1).trim()
    
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    
    // Handle arrays (tags)
    if (key === 'tags') {
      if (value.startsWith('[') && value.endsWith(']')) {
        const arrayContent = value.slice(1, -1)
        frontmatter.tags = arrayContent
          .split(',')
          .map(tag => tag.trim().replace(/['"]/g, ''))
          .filter(tag => tag.length > 0)
      } else {
        frontmatter.tags = [value]
      }
    } else if (key === 'title' || key === 'date' || key === 'description') {
      frontmatter[key] = value
    }
  }
  
  // Validate required fields
  if (!frontmatter.title || !frontmatter.date || !frontmatter.description || !frontmatter.tags) {
    throw new Error('Invalid frontmatter: missing required fields')
  }
  
  return {
    frontmatter: frontmatter as Frontmatter,
    content: markdownContent
  }
}

export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export function markdownToHtml(markdown: string): string {
  return marked(markdown) as string
}

export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
