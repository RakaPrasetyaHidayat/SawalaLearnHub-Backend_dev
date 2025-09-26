"use client"

import React, { useState } from "react"

type CommentFormProps = {
  onSubmit?: (comment: string) => void
  placeholder?: string
  className?: string
}

export default function CommentForm({ 
  onSubmit,
  placeholder = "Write your comment",
  className = "" 
}: CommentFormProps) {
  const [comment, setComment] = useState("")

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit?.(comment.trim())
      setComment("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        rows={3}
        className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        onClick={handleSubmit}
        disabled={!comment.trim()}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Send
      </button>
    </div>
  )
}