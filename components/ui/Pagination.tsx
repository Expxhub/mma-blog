'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  function pageHref(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    return `?${params.toString()}`
  }

  const pages: (number | '...')[] = []

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('...')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="Paginação">
      <Link
        href={pageHref(currentPage - 1)}
        aria-disabled={currentPage === 1}
        className={`px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 ${currentPage === 1 ? 'pointer-events-none opacity-40' : ''}`}
        aria-label="Página anterior"
      >
        ← Anterior
      </Link>

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400">…</span>
        ) : (
          <Link
            key={page}
            href={pageHref(page)}
            className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
              currentPage === page
                ? 'bg-brand-primary text-white border-brand-primary'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </Link>
        )
      )}

      <Link
        href={pageHref(currentPage + 1)}
        aria-disabled={currentPage === totalPages}
        className={`px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 ${currentPage === totalPages ? 'pointer-events-none opacity-40' : ''}`}
        aria-label="Próxima página"
      >
        Próxima →
      </Link>
    </nav>
  )
}
