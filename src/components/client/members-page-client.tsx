"use client"

import { useState, useEffect } from 'react'
import { Input } from '@/components/atoms/ui/input'
import Title from '@/components/molecules/title'
import { UserCard } from '@/components/molecules/cards/user-card'
import { apiFetcher } from '@/services/fetcher'

export default function MembersPageClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true)
        const raw = await apiFetcher<any>('/api/users')

        // Normalize various possible API response shapes
        const extractUsers = (data: any): any[] => {
          let arr: any[] = []
          if (Array.isArray(data)) arr = data
          else if (Array.isArray(data?.data)) arr = data.data
          else if (Array.isArray(data?.users)) arr = data.users
          else if (Array.isArray(data?.data?.users)) arr = data.data.users
          else if (Array.isArray(data?.data?.data)) arr = data.data.data
          else arr = []

          return arr.map((u: any) => ({
            id: u.id ?? u._id ?? u.userId ?? u.uuid ?? Math.random(),
            // Show full name explicitly
            username: u.full_name ?? u.fullname ?? u.fullName ?? u.name ?? u.username ?? '',
            // Show division by id/name, do NOT fall back to role; try nested/camelCase too
            division: String(
              u.division_id ??
              u.divisionId ??
              u.profile?.division_id ??
              u.profile?.divisionId ??
              u.division_name ??
              u.divisionName ??
              u.profile?.division_name ??
              u.profile?.divisionName ??
              u.division?.name ??
              u.profile?.division?.name ??
              u.division ??
              u.profile?.division ??
              ''
            ),
            // Prefer school_name; try nested/camelCase too
            school:
              u.school_name ??
              u.schoolName ??
              u.profile?.school_name ??
              u.profile?.schoolName ??
              u.school ??
              u.profile?.school ??
              u.university ??
              u.campus ??
              u.college ??
              '',
            avatarSrc: u.avatar ?? u.avatarUrl ?? u.photo ?? u.image ?? '/assets/icons/profile.png',
          }))
        }

        const users = extractUsers(raw)
        if (!users.length) console.warn('Unexpected users response shape:', raw)
        // Debug: lihat sample hasil mapping
        try {
          console.table(
            users.slice(0, 5).map((m) => ({ username: m.username, division: m.division, school: m.school }))
          )
        } catch {}
        setMembers(users)
      } catch (err) {
        console.error('Failed to fetch members:', err)
        setError('Failed to fetch members. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [])

  const filteredMembers = members.filter(member =>
    (member.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.division || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.school || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleViewProfile = (memberId: number) => {
    console.log(`View profile for member ${memberId}`)
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <Title 
          title="Member List" 
          containerClassName="mb-6"
          titleClassName='text-xl'
        />

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg 
              className="h-5 w-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading members...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMembers.map((member) => (
              <UserCard
                key={member.id}
                avatarSrc={member.avatarSrc}
                avatarAlt={`${member.username} avatar`}
                username={member.username}
                division={member.division}
                school={member.school}
                onViewProfile={() => handleViewProfile(member.id)}
              />
            ))}
          </div>
        )}

        {filteredMembers.length === 0 && !loading && !error && (
          <div className="text-center py-8">
            <p className="text-gray-500">No members found matching your search.</p>
          </div> 
        )}
      </div>
    </div>
  )
}








