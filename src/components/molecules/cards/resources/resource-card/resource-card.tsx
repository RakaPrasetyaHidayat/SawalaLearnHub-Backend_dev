"use client"

import { FileText, ThumbsUp } from "lucide-react"
import React from "react"

type ResourceCardProps = {
  iconColor?: string
  title: string
  author: string
  role?: string
  description: string
  date: string
  likes: string | number
  onView?: () => void
  className?: string
}

export default function ResourceCard({
  iconColor = "text-blue-600",
  title,
  author,
  role,
  description,
  date,
  likes,
  onView,
  className = "",
}: ResourceCardProps) {
  return (
    <div className={`w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${iconColor}`}>
          <FileText className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 leading-snug">{title}</h3>
          <p className="text-[12px] text-gray-600 mt-0.5">{author}{role ? ` (${role})` : ""}</p>
          <p className="text-[12px] text-gray-700 mt-3 line-clamp-2">{description}</p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4 text-[12px] text-gray-600">
              <span>{date}</span>
              <span className="inline-flex items-center gap-1 text-blue-600">
                <ThumbsUp className="h-4 w-4" />
                {likes}
              </span>
            </div>
            <button
              type="button"
              onClick={onView}
              className="h-8 w-[80px] px-3 inline-flex items-center justify-center text-xs text-blue-600 border border-blue-600 rounded-sm"
            >
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


