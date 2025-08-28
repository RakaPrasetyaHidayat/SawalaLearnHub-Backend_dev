"use client"

import { Button } from '@/components/atoms/ui/button'

interface SimpleTaskCardProps {
  title: string
  deadline: string
  onViewDetail?: () => void
  onComment?: () => void
  className?: string
}

export default function SimpleTaskCard({
  title,
  deadline,
  onViewDetail,
  onComment,
  className = ""
}: SimpleTaskCardProps) {
  return (
    <div className={`w-full bg-white rounded-md shadow-sm border border-gray-200 p-4 ${className}`}>
      <h3 className="text-gray-900 font-semibold text-base mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">Deadline: {deadline}</p>
      
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onViewDetail}
          className="text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          View detail
        </Button>
        <Button
          size="sm"
          onClick={onComment}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Comment
        </Button>
      </div>
    </div>
  )
}

