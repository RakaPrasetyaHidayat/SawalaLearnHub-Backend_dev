import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://learnhubbackenddev.vercel.app'
const SERVER_TOKEN = process.env.LEARNHUB_SERVER_TOKEN || process.env.SERVER_API_TOKEN || process.env.NEXT_SERVER_API_TOKEN

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE

type CountResult = Record<string, number | { error: string }>

function normalizeDivisionKey(s: any) {
  if (!s) return ''
  const str = String(s).toLowerCase()
  if (str.includes('ui') && str.includes('ux')) return 'uiux'
  if (str.includes('frontend') || str.includes('front')) return 'frontend'
  if (str.includes('backend') || str.includes('back')) return 'backend'
  if (str.includes('devops')) return 'devops'
  return ''
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const yearParam = url.searchParams.get('year') || ''
    const year = yearParam.replace(/[^0-9]/g, '') || ''

    // If Supabase service role key is present, query DB directly (most reliable)
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

      // Build year filter - check common fields
      const yearFilter = year ? `(${year})` : ''

      // Fetch users matching target year in common fields
      // Use OR on channel_year, angkatan, year, batch
      const orExpr = year
        ? `channel_year.eq.${year},angkatan.eq.${year},year.eq.${year},batch.eq.${year}`
        : ''

      let query = supabase.from('users').select('id,division,division_id,division_name,angkatan,channel_year,year', { count: 'exact' })
      if (orExpr) query = query.or(orExpr)

      const { data, error } = await query
      if (error) {
        console.error('Supabase query error:', error)
        return NextResponse.json({ ok: false, error: String(error.message) }, { status: 500 })
      }

      const counts: CountResult = { all: 0, frontend: 0, backend: 0, uiux: 0, devops: 0 }
      if (Array.isArray(data)) {
        counts.all = data.length
        for (const u of data) {
          const key = normalizeDivisionKey(u.division || u.division_name || u.division_id || '')
          if (key && typeof counts[key] === 'number') counts[key] = (counts[key] as number) + 1
        }
      }

      return NextResponse.json({ ok: true, year: yearParam || null, counts })
    }

    // Fallback: query backend endpoints (existing behavior)
    const divisions: { id: string; endpoints: string[] }[] = [
      { id: 'all', endpoints: [`${BACKEND_BASE}/api/users/all`] },
      { id: 'frontend', endpoints: [`${BACKEND_BASE}/api/users/division/frontend${yearParam ? `?year=${encodeURIComponent(yearParam)}` : ''}`] },
      { id: 'backend', endpoints: [`${BACKEND_BASE}/api/users/division/backend${yearParam ? `?year=${encodeURIComponent(yearParam)}` : ''}`] },
      { id: 'uiux', endpoints: [
        `${BACKEND_BASE}/api/users/division/UI_UX${yearParam ? `?year=${encodeURIComponent(yearParam)}` : ''}`,
        `${BACKEND_BASE}/api/users/division/ui-ux${yearParam ? `?year=${encodeURIComponent(yearParam)}` : ''}`,
        `${BACKEND_BASE}/api/users/division/uiux${yearParam ? `?year=${encodeURIComponent(yearParam)}` : ''}`,
      ] },
      { id: 'devops', endpoints: [`${BACKEND_BASE}/api/users/division/devops${yearParam ? `?year=${encodeURIComponent(yearParam)}` : ''}`] },
    ]

    const token = SERVER_TOKEN
    const result: CountResult = {}

    async function fetchAndCount(url: string, token?: string): Promise<number | { error: string }> {
      try {
        const headers: Record<string, string> = {}
        if (token) headers['Authorization'] = `Bearer ${token}`
        const res = await fetch(url, { headers })
        const text = await res.text()
        let json: any = null
        try { json = text ? JSON.parse(text) : null } catch (e) { json = text }
        if (res.status === 401) return { error: 'unauthorized' }
        if (Array.isArray(json)) return json.length
        if (Array.isArray(json?.data)) return json.data.length
        if (Array.isArray(json?.users)) return json.users.length
        // Handle shape: { data: { users: [] } }
        if (Array.isArray(json?.data?.users)) return json.data.users.length
        if (Array.isArray(json?.data?.data)) return json.data.data.length
        if (Array.isArray(json) && json.length > 0 && typeof json[0] === 'object' && 'count' in json[0]) {
          return json.reduce((s: number, r: any) => s + (Number(r.count) || 0), 0)
        }
        return 0
      } catch (err: any) {
        return { error: String(err?.message || err) }
      }
    }

    await Promise.all(divisions.map(async (d) => {
      for (const ep of d.endpoints) {
        const value = await fetchAndCount(ep, token ?? undefined)
        if (typeof value === 'number') {
          result[d.id] = value
          return
        }
        if (typeof value === 'object' && value.error === 'unauthorized') {
          result[d.id] = { error: 'unauthorized' }
          return
        }
      }
      if (!result[d.id]) result[d.id] = 0
    }))

    return NextResponse.json({ ok: true, year: yearParam || null, counts: result })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 })
  }
}
