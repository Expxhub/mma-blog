import { useState, useEffect } from 'react'
import type { Post, Category, Tag } from '@/drizzle/schema'

type PostWithRelations = Post & { categories: Category[]; tags: Tag[] }

interface UsePostsParams {
  page?: number
  limit?: number
  category?: string
  tag?: string
  search?: string
}

export function usePosts(params: UsePostsParams = {}) {
  const [posts, setPosts] = useState<PostWithRelations[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', String(params.page))
    if (params.limit) searchParams.set('limit', String(params.limit))
    if (params.category) searchParams.set('category', params.category)
    if (params.tag) searchParams.set('tag', params.tag)
    if (params.search) searchParams.set('search', params.search)

    setLoading(true)
    fetch(`/api/posts?${searchParams.toString()}`)
      .then(r => r.json())
      .then(data => {
        setPosts(data.posts ?? [])
        setTotal(data.total ?? 0)
        setPages(data.pages ?? 1)
      })
      .catch(() => setError('Erro ao carregar posts'))
      .finally(() => setLoading(false))
  }, [params.page, params.limit, params.category, params.tag, params.search])

  return { posts, total, pages, loading, error }
}
