"use client"

import React, { useState } from "react"
import { ArrowLeft } from "lucide-react"
import CommentItem from "@/components/molecules/comment-item/comment-item"
import CommentForm from "@/components/molecules/comment-form/comment-form"

type Comment = {
  id: string
  authorName: string
  authorRole: "mentor" | "user"
  date: string
  message: string
  avatarId: number
}

type TaskCommentsProps = {
  taskTitle?: string
  deadline?: string
  comments?: Comment[]
  onBack?: () => void
  onAddComment?: (comment: string) => void
  className?: string
}

const defaultComments: Comment[] = [
  {
    id: "1",
    authorName: "Mentor",
    authorRole: "mentor",
    date: "14 Aug 2024, 18:00",
    message: "Tolong tambahkan penjelasan lebih detail di bagian wireframing.",
    avatarId: 5
  },
  {
    id: "2", 
    authorName: "User",
    authorRole: "user",
    date: "14 Aug 2024, 18:12",
    message: "Oke kak, nanti saya update sore ini",
    avatarId: 3
  }
]

export default function TaskComments({ 
  taskTitle = "Pre Test 1 for All Intern",
  deadline = "14 Aug 2024, 18:00",
  comments = defaultComments,
  onBack,
  onAddComment,
  className = "" 
}: TaskCommentsProps) {
  const [allComments, setAllComments] = useState<Comment[]>(comments)

  const handleAddComment = (commentText: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      authorName: "User",
      authorRole: "user",
      date: new Date().toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      message: commentText,
      avatarId: 3
    }
    
    setAllComments(prev => [...prev, newComment])
    onAddComment?.(commentText)
  }

  return (
    <div className={`w-full min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b">
        <button 
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-base font-medium text-gray-900">{taskTitle}</h1>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Task Info */}
        <div>
          <p className="text-sm text-gray-600">Deadline: {deadline}</p>
        </div>

        {/* Comments Section */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-4">Comments</h2>
          
          <div className="space-y-4 mb-6">
            {allComments.map((comment) => (
              <CommentItem
                key={comment.id}
                authorName={comment.authorName}
                authorRole={comment.authorRole}
                date={comment.date}
                message={comment.message}
                avatarId={comment.avatarId}
              />
            ))}
          </div>

          {/* Comment Form */}
          <CommentForm onSubmit={handleAddComment} />
        </div>
      </div>
    </div>
  )
}