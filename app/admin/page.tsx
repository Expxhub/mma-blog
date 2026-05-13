import Link from 'next/link'
import { cookies } from 'next/headers'

async function getStats() {
  const base = process.env.NEXT_PUBLIC_APP_URL
  const cookieStore = cookies()
  const token = cookieStore.get('auth_token')?.value
  const headers: HeadersInit = token ? { Cookie: `auth_token=${token}` } : {}

  try {
    const [postsAll, postsPublished, categoriesRes, tagsRes] = await Promise.all([
      fetch(`${base}/api/admin/posts?limit=1`, { cache: 'no-store', headers }),
      fetch(`${base}/api/admin/posts?limit=1&status=published`, { cache: 'no-store', headers }),
      fetch(`${base}/api/admin/categories`, { cache: 'no-store', headers }),
      fetch(`${base}/api/admin/tags`, { cache: 'no-store', headers }),
    ])

    const allData = postsAll.ok ? await postsAll.json() : { total: 0 }
    const pubData = postsPublished.ok ? await postsPublished.json() : { total: 0 }
    const catData = categoriesRes.ok ? await categoriesRes.json() : { categories: [] }
    const tagData = tagsRes.ok ? await tagsRes.json() : { tags: [] }

    return {
      total: allData.total ?? 0,
      published: pubData.total ?? 0,
      drafts: (allData.total ?? 0) - (pubData.total ?? 0),
      categories: catData.categories?.length ?? 0,
      tags: tagData.tags?.length ?? 0,
    }
  } catch {
    return { total: 0, published: 0, drafts: 0, categories: 0, tags: 0 }
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    { label: 'Publicados', value: stats.published, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Rascunhos', value: stats.drafts, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Categorias', value: stats.categories, color: 'text-brand-primary', bg: 'bg-brand-primary-light' },
    { label: 'Tags', value: stats.tags, color: 'text-brand-secondary', bg: 'bg-brand-secondary-light' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <Link
          href="/admin/artigos/novo"
          className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-primary-dark transition-colors"
        >
          + Novo Artigo
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className={`rounded-xl p-5 ${card.bg}`}>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-sm text-gray-600 mt-1">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
