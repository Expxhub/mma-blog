function buildUrl(base: string, params?: Record<string, string | number | undefined>): string {
  if (!params) return base
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  )
  const qs = query.toString()
  return qs ? `${base}?${qs}` : base
}

export const api = {
  posts: {
    list: (params?: { page?: number; limit?: number; category?: string; tag?: string; search?: string }) =>
      fetch(buildUrl('/api/posts', params)).then(r => r.json()),
    get: (slug: string) => fetch(`/api/posts/${slug}`).then(r => r.json()),
  },
  categories: {
    list: () => fetch('/api/categories').then(r => r.json()),
  },
  tags: {
    list: () => fetch('/api/tags').then(r => r.json()),
  },
  admin: {
    posts: {
      list: (params?: { page?: number; limit?: number; status?: string }) =>
        fetch(buildUrl('/api/admin/posts', params)).then(r => r.json()),
      get: (id: number) => fetch(`/api/admin/posts/${id}`).then(r => r.json()),
      create: (data: unknown) =>
        fetch('/api/admin/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
      update: (id: number, data: unknown) =>
        fetch(`/api/admin/posts/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
      delete: (id: number) =>
        fetch(`/api/admin/posts/${id}`, { method: 'DELETE' }).then(r => r.json()),
    },
    categories: {
      list: () => fetch('/api/admin/categories').then(r => r.json()),
      create: (data: unknown) =>
        fetch('/api/admin/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
      update: (id: number, data: unknown) =>
        fetch(`/api/admin/categories/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
      delete: (id: number) =>
        fetch(`/api/admin/categories/${id}`, { method: 'DELETE' }).then(r => r.json()),
    },
    tags: {
      list: () => fetch('/api/admin/tags').then(r => r.json()),
      create: (data: unknown) =>
        fetch('/api/admin/tags', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
      delete: (id: number) => fetch(`/api/admin/tags/${id}`, { method: 'DELETE' }).then(r => r.json()),
    },
    auth: {
      login: (email: string, password: string) =>
        fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }).then(r => r.json()),
      logout: () => fetch('/api/auth/logout', { method: 'POST' }).then(r => r.json()),
    },
  },
}
