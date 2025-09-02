"use client"

import { useRouter } from 'next/navigation'
import ResourceCard from "@/components/molecules/cards/resources/resource-card/resource-card"
import ResourcesHeader from "@/components/molecules/cards/resources/resource-header/resources-header"
import { useEffect, useState } from 'react'

interface ResourceItem {
  id: string
  title: string
  author: string
  role?: string
  description: string
  date: string
  likes: number | string
}

export default function Resources() {
  const router = useRouter()
  const [items, setItems] = useState<ResourceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    let ignore = false
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/resources', { cache: 'no-store' })
        const contentType = res.headers.get('content-type') || ''
        const data = contentType.includes('application/json') ? await res.json().catch(() => []) : []
        if (!res.ok) throw new Error((data && (data.message || data.error)) || 'Failed to load')
        if (!ignore) setItems(data)
      } catch (e: unknown) {
        const message = e instanceof Error ? (e.message || 'Failed to load resources') : 'Failed to load resources'
        if (!ignore) setError(message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => { ignore = true }
  }, [])

  return (
    <div className="mt-4 space-y-3 relative">
      <ResourcesHeader
        valueCategory="all"
        valueSort="newest"
        onChangeCategory={() => { }}
        onChangeSort={() => { }}
      />

      {loading && (
        <div className="text-sm text-gray-500">Loading...</div>
      )}
      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="text-sm text-gray-600">No resources yet.</div>
      )}

      {items.map((r) => (
        <ResourceCard
          key={r.id}
          title={r.title}
          author={r.author || 'Anonymous'}
          role={r.role}
          description={r.description}
          date={r.date}
          likes={r.likes}
          onView={() => router.push(`/main-Page/resources/${r.id}`)}
        />
      ))}

      <button
        onClick={() => router.push('/main-Page/resources/add')}
        className="fixed bottom-20 left-[58%] translate-x-[-45%] max-md:left-[80%] max-sm:translate-x-[-20%] md:right-[calc((100vw-1024px)/2+12px)] h-11 w-11 rounded-lg bg-blue-600 text-white shadow-lg hover:bg-blue-700 z-30 flex items-center justify-center"
      >
        +
      </button>
    </div>
  )
}