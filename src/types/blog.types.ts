export interface BlogPost {
  title: string
  slug: string
  date: string
  description: string
  tags: string[]
  content: string
  readTime: number
}

export interface BlogMetadata {
  title: string
  slug: string
  date: string
  description: string
  tags: string[]
  readTime: number
}

export interface BlogSearchResult {
  post: BlogMetadata
  matchType: 'title' | 'tags' | 'content'
  matchText: string
}
