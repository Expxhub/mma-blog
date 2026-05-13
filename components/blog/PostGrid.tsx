import { PostCard } from './PostCard'
import type { Post, Category } from '@/drizzle/schema'

interface PostGridProps {
  posts: (Post & { categories: Category[] })[]
}

export function PostGrid({ posts }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-5xl mb-4">📭</p>
        <p className="text-lg">Nenhum artigo encontrado.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
