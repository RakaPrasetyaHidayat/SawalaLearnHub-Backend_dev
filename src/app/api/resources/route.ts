import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const dataDir = path.join(process.cwd(), 'src', 'data')
const dataFile = path.join(dataDir, 'resources.json')
const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

export type Resource = {
  id: string
  title: string
  author: string
  role: string
  description: string
  date: string
  likes: number
  type: 'file' | 'text'
  fileName: string | null
  fileUrl: string | null
  createdAt: number
}

async function ensureDirs() {
  await fs.mkdir(dataDir, { recursive: true }).catch(() => {})
  await fs.mkdir(uploadsDir, { recursive: true }).catch(() => {})
}

async function readResources(): Promise<Resource[]> {
  try {
    const raw = await fs.readFile(dataFile, 'utf8')
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as Resource[]
    return []
  } catch (e: unknown) {
    const code = (e as { code?: unknown })?.code
    if (typeof code === 'string' && code === 'ENOENT') return []
    throw e
  }
}

async function writeResources(list: Resource[]) {
  await ensureDirs()
  await fs.writeFile(dataFile, JSON.stringify(list, null, 2), 'utf8')
}

function formatDate(date = new Date()) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const d = String(date.getDate()).padStart(2, '0')
  const m = months[date.getMonth()]
  const y = date.getFullYear()
  return `${d} ${m} ${y}`
}

export async function GET() {
  try {
    const list = await readResources()
    // return newest first
    const sorted = [...list].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    return NextResponse.json(sorted)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to load resources'
    return NextResponse.json({ message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await ensureDirs()
    const form = await request.formData()

    const title = String(form.get('title') || '').trim()
    const description = String(form.get('description') || '').trim()

    const fileEntry = form.get('file')
    const file = fileEntry instanceof File ? fileEntry : null

    if (!title) return NextResponse.json({ message: 'Title is required' }, { status: 400 })
    if (!description) return NextResponse.json({ message: 'Description is required' }, { status: 400 })

    let fileName: string | null = null
    let fileUrl: string | null = null

    if (file) {
      const ab = await file.arrayBuffer()
      const buffer = Buffer.from(ab)
      const originalName = file.name || 'file'
      const ext = originalName.includes('.') ? originalName.split('.').pop() : undefined
      const safeBase = originalName.replace(/[^a-zA-Z0-9-_\.]/g, '_').replace(/\.+/g, '.')
      const unique = `${Date.now()}_${Math.random().toString(16).slice(2)}`
      fileName = ext ? `${unique}_${safeBase}` : `${unique}_${safeBase}`
      const targetPath = path.join(uploadsDir, fileName)
      await fs.writeFile(targetPath, buffer)
      fileUrl = `/uploads/${fileName}`
    }

    const now = Date.now()
    const resource: Resource = {
      id: crypto.randomUUID(),
      title,
      author: 'Anonymous',
      role: '',
      description,
      date: formatDate(new Date(now)),
      likes: 0,
      type: fileUrl ? 'file' : 'text',
      fileName,
      fileUrl,
      createdAt: now,
    }

    const list = await readResources()
    list.push(resource)
    await writeResources(list)

    return NextResponse.json(resource, { status: 201 })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to save resource'
    return NextResponse.json({ message }, { status: 500 })
  }
}
