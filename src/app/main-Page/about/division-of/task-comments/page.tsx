"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import TaskComments from "@/components/organisms/task-comments/task-comments"

function TaskCommentsContent() {
  const searchParams = useSearchParams()
  const taskId = searchParams.get('taskId')
  const title = searchParams.get('title') || 'Task'
  const deadline = searchParams.get('deadline') || 'No deadline'

  const handleBack = () => {
    window.history.back()
  }

  const handleAddComment = (comment: string) => {
    console.log('New comment added for task:', taskId, comment)
    // Here you would typically send the comment to your API
  }

  return (
    <TaskComments
      taskTitle={decodeURIComponent(title)}
      deadline={decodeURIComponent(deadline)}
      onBack={handleBack}
      onAddComment={handleAddComment}
    />
  )
}

export default function TaskCommentsPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading comments...</div>
      </div>
    }>
      <TaskCommentsContent />
    </Suspense>
  )
}