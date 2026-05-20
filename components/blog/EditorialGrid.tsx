import { PostCardPortal } from './PostCardPortal'
import type { Post, Category } from '@/drizzle/schema'

interface EditorialGridProps {
  posts: (Post & { categories: Category[] })[]
}

export function EditorialGrid({ posts }: EditorialGridProps) {
  if (posts.length === 0) return null

  const [featured, ...rest] = posts
  const secondary = rest.slice(0, 3)
  const remaining = rest.slice(3)

  return (
    <div>
      {/* Featured row: 1 large + up to 3 small */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {featured && (
          <div className="md:col-span-2">
            <PostCardPortal post={featured} size="large" />
          </div>
        )}
        {secondary.length > 0 && (
          <div className="flex flex-col gap-4">
            {secondary.map((post) => (
              <PostCardPortal key={post.id} post={post} size="small" />
            ))}
          </div>
        )}
      </div>

      {/* Remaining posts: 3-column grid */}
      {remaining.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {remaining.map((post) => (
            <PostCardPortal key={post.id} post={post} size="small" />
          ))}
        </div>
      )}
    </div>
  )
}
