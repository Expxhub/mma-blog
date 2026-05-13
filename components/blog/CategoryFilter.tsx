'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { Category } from '@/drizzle/schema'

interface CategoryFilterProps {
  categories: Category[]
  selected?: string
}

export function CategoryFilter({ categories, selected }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleSelect(slug: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get('category') === slug) {
      params.delete('category')
    } else {
      params.set('category', slug)
      params.delete('page')
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleSelect(cat.slug)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selected === cat.slug
              ? 'bg-brand-primary text-white'
              : 'bg-brand-primary-light text-brand-primary hover:bg-brand-primary hover:text-white'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
