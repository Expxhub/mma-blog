import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export async function POST(request: NextRequest) {
  const token = cookies().get('auth_token')?.value
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Formato não suportado. Use JPG, PNG, WebP ou GIF.' }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Imagem deve ter menos de 5MB' }, { status: 400 })
  }

  const ext = path.extname(file.name).toLowerCase() || '.jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')

  await mkdir(uploadDir, { recursive: true })
  const bytes = await file.arrayBuffer()
  await writeFile(path.join(uploadDir, filename), Buffer.from(bytes))

  return NextResponse.json({ url: `/uploads/${filename}` })
}
