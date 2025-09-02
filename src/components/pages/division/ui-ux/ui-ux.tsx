"use client"

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NavigationBar from '@/components/molecules/navigationbar/navigationbar'
import UserCard from '@/components/molecules/cards/user-card/user-card'
import TaskCard from '@/components/molecules/cards/task-card/task-card'
// import { ResourcesHeader } from '@/components/molecules/cards/resources/resource-header'
// import ResourceCard from '@/components/molecules/cards/resources/resource-card'
import { Resource as Resources } from '@/components/organisms/resources/resources'

export default function UiUxSection({
  imageSrc = '/assets/images/download.png',
  imageAlt = 'UI/UX Landing Preview',
}) {
  const router = useRouter()
  const [tab, setTab] = useState('people')
  const items = [
    { key: 'people', label: 'People' },
    { key: 'tasks', label: 'Tasks' },
    { key: 'resources', label: 'Resources' },
  ]

  return (
    <div className="w-full relative">
      <div className="mx-auto w-full max-w-4xl px-4">
        <div className="overflow-hidden shadow-md">
          <div className="relative w-full aspect-[16/9] overflow-hidden">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>

        <NavigationBar items={items} value={tab} onChange={setTab} className="mt-4" />

        {tab === 'people' && (
          <div className="mt-4 space-y-3">
            {/* Dummy list; later replace with data from API/DB */}
            <UserCard username="bimo_fikry" division="UI UX designer" school="SMKN 1 Sumedang" />
            <UserCard username="siti_ayu" division="Frontend Dev" school="SMKN 2 Bandung" />
            <UserCard username="andre_t" division="Backend Dev" school="SMKN 1 Cimahi" />
            <UserCard username="andre_t" division="Backend Dev" school="SMKN 1 Cimahi" />
            <UserCard username="andre_t" division="Backend Dev" school="SMKN 1 Cimahi" />
          </div>
        )}

        {tab === 'tasks' && (
          <div className="mt-4 space-y-3">
            {/* Dummy tasks list with status icons */}
            <TaskCard
              status="submitted"
              title="Pre Test 1 for All Intern"
              deadline="14 Aug 2024, 18:00"
              statusIcons={{ submitted: '/assets/icons/submitted.png' }}
              onViewDetail={() => router.push('/main-Page/about/division-of/detail-task')}
            />
            <TaskCard
              status="revision"
              title="Pre Test 1 for All Intern"
              deadline="14 Aug 2024, 18:00"
              unread
              statusIcons={{ revision: '/assets/icons/revisi.png' }}
              onViewDetail={() => router.push('/main-Page/about/division-of/detail-task')}
            />
            <TaskCard
              status="approved"
              title="Pre Test 1 for All Intern"
              deadline="14 Aug 2024, 18:00"
              statusIcons={{ approved: '/assets/icons/approved.png' }}
              onViewDetail={() => router.push('/main-Page/about/division-of/detail-task')}
            />
          </div>
        )}
        {tab === 'resources' && (
          <Resources />
        )}
      </div>
    </div>
  )
}


