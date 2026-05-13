# SQLite → Supabase Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o banco SQLite local por Supabase (PostgreSQL) mantendo Drizzle ORM como camada de acesso a dados.

**Architecture:** Troca do driver `better-sqlite3` pelo `postgres` (postgres.js), adaptação do schema Drizzle de sqlite-core para pg-core, e ajustes pontuais nas rotas que usam SQL dialect-específico (LIKE → ILIKE, detecção de erro UNIQUE).

**Tech Stack:** Next.js 14, Drizzle ORM 0.45, postgres.js, Supabase (PostgreSQL 15), drizzle-kit 0.31

---

### Task 1: Atualizar dependências npm

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Remover better-sqlite3 e instalar postgres**

```bash
cd "c:\Users\User\Documents\Projetos\mma-blog"
npm uninstall better-sqlite3 @types/better-sqlite3
npm install postgres
```

Expected: `package.json` sem `better-sqlite3`/`@types/better-sqlite3`, com `"postgres"` nas dependencies.

- [ ] **Step 2: Verificar instalação**

```bash
npm list postgres
```

Expected: `postgres@X.X.X` listado sem erros.

---

### Task 2: Configurar DATABASE_URL no .env

**Files:**
- Modify: `.env`
- Modify: `.env.example`

- [ ] **Step 1: Atualizar .env com a connection string do Supabase**

Substituir a linha `DATABASE_URL=./blog.db` por:
```
DATABASE_URL=postgresql://postgres:Gtiaeinovacao@db.slgcidynzxlallmvgzid.supabase.co:5432/postgres
```

- [ ] **Step 2: Atualizar .env.example**

Substituir o bloco de banco de dados por:
```
# ─── BANCO DE DADOS ────────────────────────────────────────────────────────
# Supabase (PostgreSQL)
DATABASE_URL=postgresql://postgres:[SENHA]@db.[PROJETO].supabase.co:5432/postgres
```

---

### Task 3: Reescrever drizzle/schema.ts para PostgreSQL

**Files:**
- Modify: `drizzle/schema.ts`

Trocar todas as importações e tipos de sqlite-core para pg-core:

- `sqliteTable` → `pgTable`
- `integer('id').primaryKey({ autoIncrement: true })` → `serial('id').primaryKey()`
- `integer('x', { mode: 'timestamp' })` → `timestamp('x')`
- `sql\`(unixepoch())\`` → `sql\`now()\``
- `integer` continua necessário para colunas de chave estrangeira (FKs não usam `serial`)

- [ ] **Step 1: Reescrever o arquivo inteiro**

```typescript
import {
  pgTable,
  text,
  serial,
  integer,
  timestamp,
  primaryKey,
  index,
} from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  password_hash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default('admin'),
  created_at: timestamp('created_at').notNull().default(sql`now()`),
})

export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').unique().notNull(),
    content: text('content').notNull().default(''),
    excerpt: text('excerpt').notNull().default(''),
    cover_image: text('cover_image'),
    status: text('status', { enum: ['draft', 'published'] })
      .notNull()
      .default('draft'),
    published_at: timestamp('published_at'),
    created_at: timestamp('created_at').notNull().default(sql`now()`),
    updated_at: timestamp('updated_at').notNull().default(sql`now()`),
  },
  (t) => ({
    statusIdx: index('posts_status_idx').on(t.status),
    publishedAtIdx: index('posts_published_at_idx').on(t.published_at),
  })
)

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').unique().notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  created_at: timestamp('created_at').notNull().default(sql`now()`),
})

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: text('name').unique().notNull(),
  slug: text('slug').unique().notNull(),
  created_at: timestamp('created_at').notNull().default(sql`now()`),
})

export const postCategories = pgTable(
  'post_categories',
  {
    post_id: integer('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    category_id: integer('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
  },
  (t) => ({ pk: primaryKey({ columns: [t.post_id, t.category_id] }) })
)

export const postTags = pgTable(
  'post_tags',
  {
    post_id: integer('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    tag_id: integer('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => ({ pk: primaryKey({ columns: [t.post_id, t.tag_id] }) })
)

export const postsRelations = relations(posts, ({ many }) => ({
  postCategories: many(postCategories),
  postTags: many(postTags),
}))

export const categoriesRelations = relations(categories, ({ many }) => ({
  postCategories: many(postCategories),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags),
}))

export const postCategoriesRelations = relations(postCategories, ({ one }) => ({
  post: one(posts, { fields: [postCategories.post_id], references: [posts.id] }),
  category: one(categories, {
    fields: [postCategories.category_id],
    references: [categories.id],
  }),
}))

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, { fields: [postTags.post_id], references: [posts.id] }),
  tag: one(tags, { fields: [postTags.tag_id], references: [tags.id] }),
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
export type Tag = typeof tags.$inferSelect
export type NewTag = typeof tags.$inferInsert
```

---

### Task 4: Reescrever drizzle/db.ts para postgres.js

**Files:**
- Modify: `drizzle/db.ts`

- [ ] **Step 1: Reescrever o arquivo**

```typescript
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'

const client = postgres(process.env.DATABASE_URL!)

export const db = drizzle(client, { schema })
```

---

### Task 5: Atualizar drizzle.config.ts

**Files:**
- Modify: `drizzle.config.ts`

- [ ] **Step 1: Atualizar dialect e credenciais**

```typescript
import type { Config } from 'drizzle-kit'

export default {
  dialect: 'postgresql',
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config
```

---

### Task 6: Atualizar busca em app/api/posts/route.ts

**Files:**
- Modify: `app/api/posts/route.ts`

PostgreSQL diferencia maiúsculas em `LIKE`. Usar `ILIKE` para comportamento case-insensitive idêntico ao SQLite.

- [ ] **Step 1: Substituir LIKE por ILIKE no bloco de busca**

Localizar o bloco:
```typescript
    if (search) {
      conditions.push(
        sql`(${posts.title} LIKE ${'%' + search + '%'} OR ${posts.content} LIKE ${'%' + search + '%'})`
      )
    }
```

Substituir por:
```typescript
    if (search) {
      conditions.push(
        sql`(${posts.title} ILIKE ${'%' + search + '%'} OR ${posts.content} ILIKE ${'%' + search + '%'})`
      )
    }
```

---

### Task 7: Atualizar detecção de erro UNIQUE nas rotas admin

**Files:**
- Modify: `app/api/admin/categories/route.ts`
- Modify: `app/api/admin/tags/route.ts`

PostgreSQL lança erro com `code: '23505'` para violação de unique constraint, não com mensagem contendo "UNIQUE".

- [ ] **Step 1: Atualizar categories/route.ts**

Localizar o bloco catch no POST:
```typescript
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg.includes('UNIQUE')) {
      return NextResponse.json({ error: 'Categoria já existe.' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
```

Substituir por:
```typescript
  } catch (err: unknown) {
    if ((err as { code?: string }).code === '23505') {
      return NextResponse.json({ error: 'Categoria já existe.' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
```

- [ ] **Step 2: Atualizar tags/route.ts**

Localizar o bloco catch no POST:
```typescript
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg.includes('UNIQUE')) {
      return NextResponse.json({ error: 'Tag já existe.' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
```

Substituir por:
```typescript
  } catch (err: unknown) {
    if ((err as { code?: string }).code === '23505') {
      return NextResponse.json({ error: 'Tag já existe.' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
```

---

### Task 8: Criar tabelas no Supabase e popular dados

- [ ] **Step 1: Carregar variáveis de ambiente e fazer push do schema**

```bash
npx dotenv -e .env -- drizzle-kit push
```

Se `dotenv` CLI não estiver disponível, usar diretamente com a env var:
```bash
$env:DATABASE_URL="postgresql://postgres:Gtiaeinovacao@db.slgcidynzxlallmvgzid.supabase.co:5432/postgres"; npx drizzle-kit push
```

Expected: tabelas criadas sem erros — `users`, `posts`, `categories`, `tags`, `post_categories`, `post_tags`.

- [ ] **Step 2: Rodar seed**

```bash
npm run db:seed
```

Expected:
```
🌱 Iniciando seed do banco de dados...
✅ Usuário admin criado: admin@blog.com / admin123
✅ Categorias criadas: Tecnologia, Novidades
✅ Tags criadas: Next.js, React, Web
✅ Post de exemplo criado
🎉 Seed concluído com sucesso!
```

- [ ] **Step 3: Verificar TypeScript**

```bash
npx tsc --noEmit
```

Expected: sem erros de tipo.
