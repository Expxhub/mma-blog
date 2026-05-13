---
title: Migração SQLite → Supabase (PostgreSQL)
date: 2026-05-13
status: approved
---

## Objetivo

Substituir o banco SQLite local (better-sqlite3) pelo Supabase (PostgreSQL) usando Drizzle ORM como camada de acesso a dados. Auth JWT própria permanece inalterada.

## Escopo

### Arquivos alterados

| Arquivo | Mudança |
|---|---|
| `drizzle/schema.ts` | `sqliteTable` → `pgTable`; `integer timestamp` → `timestamp`; IDs com `serial` |
| `drizzle/db.ts` | Driver `better-sqlite3` → `postgres` (postgres.js) |
| `drizzle.config.ts` | Dialect `sqlite` → `postgresql` |
| `package.json` | Remove `better-sqlite3` + `@types/better-sqlite3`; adiciona `postgres` |
| `app/api/posts/route.ts` | `LIKE` → `ILIKE` para busca case-insensitive |
| `app/api/admin/categories/route.ts` | Detecção de erro UNIQUE via código `23505` do Postgres |
| `app/api/admin/tags/route.ts` | Idem acima |
| `.env` | `DATABASE_URL` com string de conexão Supabase |
| `.env.example` | Atualizar comentários e exemplo |

### Sem alterações

- Lógica de negócio em todas as rotas (queries Drizzle permanecem iguais)
- Auth JWT (`lib/auth.ts`, `middleware.ts`)
- Todas as páginas e componentes frontend
- Scripts de seed (funcionam sem mudança após migração do schema)

## Decisões de design

### Driver: postgres.js

`postgres` (postgres.js) é o driver recomendado pelo Drizzle para PostgreSQL — mais leve e com melhor suporte a tipagem que `pg`. Conexão direta via porta 5432.

### Tipos PostgreSQL

| SQLite | PostgreSQL |
|---|---|
| `integer().primaryKey({ autoIncrement: true })` | `serial('id').primaryKey()` |
| `integer('x', { mode: 'timestamp' })` | `timestamp('x')` |
| `sql\`(unixepoch())\`` | `sql\`now()\`` |

### Erro UNIQUE

PostgreSQL retorna código de erro `23505` para violação de unique constraint. As rotas admin checam `err.code === '23505'` em vez de `err.message.includes('UNIQUE')`.

## Passos de execução

1. Instalar `postgres`, remover `better-sqlite3` e tipos
2. Reescrever `drizzle/schema.ts`
3. Reescrever `drizzle/db.ts`
4. Atualizar `drizzle.config.ts`
5. Atualizar `.env` e `.env.example`
6. Atualizar `app/api/posts/route.ts` (ILIKE)
7. Atualizar error handling nas rotas admin
8. Rodar `drizzle-kit push` para criar tabelas no Supabase
9. Rodar `npm run db:seed` para popular dados iniciais
