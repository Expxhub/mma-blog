'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/lib/hooks/useDebounce'

export function SearchBar({ initialValue = '', variant = 'dark' }: { initialValue?: string; variant?: 'dark' | 'light' }) {
  const [value, setValue] = useState(initialValue)
  const debouncedValue = useDebounce(value, 400)
  const router = useRouter()

  useEffect(() => {
    if (debouncedValue.trim()) {
      router.push(`/busca?q=${encodeURIComponent(debouncedValue.trim())}`)
    }
  }, [debouncedValue, router])

  const inputClass = variant === 'light'
    ? 'w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 placeholder-gray-400 border border-gray-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary'
    : 'w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:bg-white/20 focus:ring-1 focus:ring-white/40'

  const iconClass = variant === 'light'
    ? 'absolute left-2.5 top-2.5 h-4 w-4 text-gray-400'
    : 'absolute left-2.5 top-2.5 h-4 w-4 text-white/50'

  return (
    <div className="relative">
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar artigos..."
        className={inputClass}
        aria-label="Buscar artigos"
      />
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  )
}
