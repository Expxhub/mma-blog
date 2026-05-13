'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import type { Post } from '@/drizzle/schema'

export default function ArtigosPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)

  async function fetchPosts() {
    setLoading(true)
    try {
      const q = status !== 'all' ? `&status=${status}` : ''
      const res = await fetch(`/api/admin/posts?limit=20${q}`)
      const data = await res.json()
      setPosts(data.posts ?? [])
      setTotal(data.total ?? 0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPosts() }, [status])

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir este artigo?')) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
      await fetchPosts()
    } finally {
      setDeleting(null)
    }
  }

  function formatDate(d: Date | null) {
    if (!d) return '—'
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(d))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Artigos ({total})</h1>
        <Link href="/admin/artigos/novo" className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-primary-dark transition-colors">
          + Novo Artigo
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {(['all', 'published', 'draft'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              status === s ? 'bg-brand-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {{ all: 'Todos', published: 'Publicados', draft: 'Rascunhos' }[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Carregando...</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Título</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Data</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-neutral-900 max-w-xs truncate">{post.title}</td>
                  <td className="px-4 py-3">
                    <Badge variant={post.status as 'draft' | 'published'}>
                      {{ draft: 'Rascunho', published: 'Publicado' }[post.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(post.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/admin/artigos/${post.id}/editar`} className="text-brand-primary hover:underline text-sm">Editar</Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deleting === post.id}
                        className="text-red-600 hover:underline text-sm disabled:opacity-50"
                      >
                        {deleting === post.id ? '...' : 'Excluir'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400">Nenhum artigo encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
