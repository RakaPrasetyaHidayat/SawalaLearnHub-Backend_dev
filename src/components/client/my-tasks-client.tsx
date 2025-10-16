"use client"

import Image from 'next/image'
import BackButton from '@/components/atoms/ui/back-button'
import SimpleTaskCard from '@/components/molecules/cards/simple-task-card/simple-task-card'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TasksService, Task } from '@/services/tasksService'

export default function MyTasksClient() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await TasksService.getMyTasks()
        setTasks(data)
      } catch (e) {
        console.error('Failed to load my tasks', e)
        setError('Gagal memuat tugas saya')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleViewDetail = (taskId: string | number) => {
    router.push(`/main-Page/about/division-of/detail-task?id=${taskId}`)
  }

  const handleComment = (taskId: string | number) => {
    console.log('Open comments for task:', taskId)
  }

  if (loading) return <div className="p-4 text-center text-gray-500">Memuat...</div>
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>

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
        {tasks.length === 0 && <div className="text-gray-500">Tidak ada tugas</div>}
        {tasks.map(task => (
          <SimpleTaskCard
            key={String(task.id)}
            title={task.title}
            deadline={task.deadline || ''}
            onViewDetail={() => handleViewDetail(task.id)}
            onComment={() => handleComment(task.id)}
            className="shadow-sm"
          />
        ))}
      </div>
    </div>
  )
}
