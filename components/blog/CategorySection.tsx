import Link from 'next/link'
import { PostCardNews } from '@/components/blog/PostCardNews'

interface Post {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  cover_image: string | null
  published_at: string | null
  categories: { id: number; name: string; slug: string }[]
}

interface Category {
  id: number
  name: string
  slug: string
}

interface Props {
  category: Category
  posts: Post[]
}

export function CategorySection({ category, posts }: Props) {
  if (posts.length === 0) return null

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-1 h-5 rounded-full"
            style={{ backgroundColor: 'var(--color-primary)' }}
          />
          <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">
            {category.name}
          </h2>
        </div>
        <Link
          href={`/categoria/${category.slug}`}
          className="text-xs font-semibold uppercase tracking-wide transition-opacity hover:opacity-60"
          style={{ color: 'var(--color-primary)' }}
        >
          Ver mais →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {posts.map((post) => (
          <PostCardNews key={post.id} post={post} variant="card" />
        ))}
      </div>
    </section>
  )
}
