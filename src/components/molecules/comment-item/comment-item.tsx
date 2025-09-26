"use client"

import React from "react"

type CommentItemProps = {
  authorName: string
  authorRole: "mentor" | "user"
  date: string
  message: string
  avatarId?: number
  className?: string
}

export default function CommentItem({ 
  authorName, 
  authorRole, 
  date, 
  message,
  avatarId = 1,
  className = "" 
}: CommentItemProps) {
  return (
    <div className={`flex gap-3 ${className}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <img 
          src={`https://i.pravatar.cc/40?img=${avatarId}`}
          alt={`${authorName} avatar`}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>

      {/* Comment Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-semibold text-gray-900">
            {authorName}
          </h4>
          <span className="text-xs text-gray-500">
            {date}
          </span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  )
}