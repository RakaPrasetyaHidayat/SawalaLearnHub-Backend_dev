"use client"

import { useState } from 'react'
import { Input } from '@/components/atoms/ui/input'
import Title from '@/components/molecules/title'
import { UserCard } from '@/components/molecules/cards/user-card'

const mockMembers = [
  { id: 1, username: 'bimo_fikry', division: 'UI UX designer', school: 'SMKN 1 Sumedang', avatarSrc: '/assets/icons/profile.png' },
  { id: 2, username: 'bimo_fikry', division: 'UI UX designer', school: 'SMKN 1 Sumedang', avatarSrc: '/assets/icons/profile.png' },
  { id: 3, username: 'bimo_fikry', division: 'UI UX designer', school: 'SMKN 1 Sumedang', avatarSrc: '/assets/icons/profile.png' },
  { id: 4, username: 'bimo_fikry', division: 'UI UX designer', school: 'SMKN 1 Sumedang', avatarSrc: '/assets/icons/profile.png' },
  { id: 5, username: 'bimo_fikry', division: 'UI UX designer', school: 'SMKN 1 Sumedang', avatarSrc: '/assets/icons/profile.png' },
  { id: 6, username: 'bimo_fikry', division: 'UI UX designer', school: 'SMKN 1 Sumedang', avatarSrc: '/assets/icons/profile.png' },
]

export default function MembersPageClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [members] = useState(mockMembers)

  const filteredMembers = members.filter(member =>
    member.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.division.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.school.toLowerCase().includes(searchQuery.toLowerCase())
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

        {filteredMembers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No members found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}








