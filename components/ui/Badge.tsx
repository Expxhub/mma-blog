import { ReactNode } from 'react'

interface BadgeProps {
  variant?: 'category' | 'tag' | 'draft' | 'published'
  children: ReactNode
  className?: string
}

const variants = {
  category: 'bg-brand-primary-light text-brand-primary',
  tag: 'bg-gray-100 text-gray-600',
  draft: 'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-800',
}

export function Badge({ variant = 'tag', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
