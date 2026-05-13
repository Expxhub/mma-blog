import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/drizzle/db'
import { users } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
import { comparePassword, signToken } from '@/lib/auth'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
})

const loginAttempts = new Map<string, { count: number; resetAt: number }>()

export async function POST(request: Request) {
  try {
    const ip = (request.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0].trim()
    const now = Date.now()
    const attempt = loginAttempts.get(ip)

    if (attempt && now < attempt.resetAt && attempt.count >= 5) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Tente novamente em 15 minutos.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)

    if (!user) {
      const a = loginAttempts.get(ip) ?? { count: 0, resetAt: now + 15 * 60 * 1000 }
      loginAttempts.set(ip, { count: a.count + 1, resetAt: a.resetAt })
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    const valid = await comparePassword(password, user.password_hash)
    if (!valid) {
      const a = loginAttempts.get(ip) ?? { count: 0, resetAt: now + 15 * 60 * 1000 }
      loginAttempts.set(ip, { count: a.count + 1, resetAt: a.resetAt })
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    loginAttempts.delete(ip)

    const token = await signToken({ userId: user.id, email: user.email, role: user.role })

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email },
    })

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 86400,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
