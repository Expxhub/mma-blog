import { useState, useEffect } from 'react'
import type { Category } from '@/drizzle/schema'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => setCategories(data.categories ?? []))
      .catch(() => setError('Erro ao carregar categorias'))
      .finally(() => setLoading(false))
  }, [])

  return { categories, loading, error }
}
