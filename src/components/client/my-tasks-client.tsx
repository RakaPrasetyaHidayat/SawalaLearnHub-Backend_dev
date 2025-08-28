"use client"

import Image from 'next/image'
import BackButton from '@/components/atoms/ui/back-button'
import SimpleTaskCard from '@/components/molecules/cards/simple-task-card/simple-task-card'
import { useRouter } from 'next/navigation'

interface ApprovedTask {
  id: string
  title: string
  deadline: string
  submittedAt: string
}

// Mock data for approved tasks - in real app this would come from API
const mockApprovedTasks: ApprovedTask[] = [
  {
    id: '1',
    title: 'Pre Test 1 for All Intern',
    deadline: '14 Aug 2024, 18:00',
    submittedAt: '2024-08-10T10:00:00Z'
  },
  {
    id: '2',
    title: 'Pre Test 1 for All Intern',
    deadline: '14 Aug 2024, 18:00',
    submittedAt: '2024-08-10T10:00:00Z'
  },
  {
    id: '3',
    title: 'Pre Test 1 for All Intern',
    deadline: '14 Aug 2024, 18:00',
    submittedAt: '2024-08-10T10:00:00Z'
  },
  {
    id: '4',
    title: 'Pre Test 1 for All Intern',
    deadline: '14 Aug 2024, 18:00',
    submittedAt: '2024-08-10T10:00:00Z'
  }
]

export default function MyTasksClient() {
  const router = useRouter()

  const handleViewDetail = (taskId: string) => {
    // Navigate to task detail page
    router.push(`/main-Page/about/division-of/detail-task?id=${taskId}`)
  }

  const handleComment = (taskId: string) => {
    // Navigate to comment/feedback page or open comment modal
    console.log('Open comments for task:', taskId)
    // router.push(`/profile/tasks/${taskId}/comments`)
  }

  return (
    <div className='justify-center items-center h-full'>
      {/* Top bar */}
      <div className="justify-center items-center h-full flex relative">
        <div className=" items-center flex h-full relative w-[350px] max-[340px]:w-full pt-4 pb-2">
          <BackButton className="ml-2 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Image src="/assets/icons/arrow-left.png" alt="Back" width={8} height={8} style={{ width: 'auto', height: 'auto' }} />
          </BackButton>
          <h1 className='font-bold text-xl'>Tasks</h1>
        </div>
      </div>

      {/* Tasks List */}
      <div className='space-y-3 p-4'>
        {mockApprovedTasks.map(task => (
          <SimpleTaskCard
            key={task.id}
            title={task.title}
            deadline={task.deadline}
            onViewDetail={() => handleViewDetail(task.id)}
            onComment={() => handleComment(task.id)}
            className="shadow-sm"
          />
        ))}
      </div>
    </div>
  )
}
