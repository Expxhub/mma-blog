import Link from 'next/link'
import { PostCardNews } from '@/components/blog/PostCardNews'
import { db } from '@/drizzle/db'
import { posts, postCategories, categories, tags } from '@/drizzle/schema'
import { eq, desc } from 'drizzle-orm'

async function getRecentPosts() {
  try {
    const recent = await db
      .select()
      .from(posts)
      .where(eq(posts.status, 'published'))
      .orderBy(desc(posts.published_at))
      .limit(5)

    return Promise.all(
      recent.map(async (p) => {
        const catRows = await db
          .select({ category: categories })
          .from(postCategories)
          .innerJoin(categories, eq(categories.id, postCategories.category_id))
          .where(eq(postCategories.post_id, p.id))
          .limit(1)
        return {
          ...p,
          published_at: p.published_at?.toISOString() ?? null,
          categories: catRows.map((r) => r.category),
        }
      })
    )
  } catch {
    return []
  }
}

async function getAllTags() {
  try {
    return db.select().from(tags).limit(20)
  } catch {
    return []
  }
}

export async function NewsSidebar() {
  const [recentPosts, allTags] = await Promise.all([getRecentPosts(), getAllTags()])

  return (
    <aside className="space-y-8">
      {recentPosts.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-1 h-5 rounded-full"
              style={{ backgroundColor: 'var(--color-secondary)' }}
            />
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">
              Destaques
            </h2>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 px-3 py-1">
            {recentPosts.map((post, i) => (
              <PostCardNews key={post.id} post={post} variant="mini" rank={i + 1} />
            ))}
          </div>
        </div>
      )}

      {allTags.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-1 h-5 rounded-full"
              style={{ backgroundColor: 'var(--color-secondary)' }}
            />
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">Tags</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.slug}`}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
