"use client"

import { CheckCircle2, Circle, CircleDot, MessageCircle, Eye } from 'lucide-react'
import Image from 'next/image'

type TaskStatus = 'submitted' | 'revision' | 'approved'

type TaskCardProps = {
  status: TaskStatus
  title: string
  deadline: string
  unread?: boolean
  onViewDetail?: () => void
  onComment?: () => void
  className?: string
  statusIcons?: Partial<Record<TaskStatus, string>>
}

function statusConfig(status: TaskStatus) {
  switch (status) {
    case 'submitted':
      return { label: 'Submitted', color: 'text-blue-600', dot: <Circle className="h-6 w-6 text-blue-600" /> }
    case 'revision':
      return { label: 'Revisi', color: 'text-yellow-700', dot: <CircleDot className="h-6 w-6 text-yellow-600" /> }
    case 'approved':
      return { label: 'Approved', color: 'text-green-700', dot: <CheckCircle2 className="h-6 w-6 text-green-600" /> }
  }
}

export default function TaskCard({
  status,
  title,
  deadline,
  unread,
  onViewDetail,
  onComment,
  className,
  statusIcons,
}: TaskCardProps) {
  const s = statusConfig(status)
  return (
    <div className={`w-full bg-white rounded-md shadow-sm border border-gray-200 p-4 ${className ?? ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`inline-flex items-center gap-2 py-1 rounded-full`}>
          {statusIcons?.[status] ? (
            <span className="relative inline-block h-6 w-6">
              <Image src={statusIcons[status] as string} alt={`${s.label} icon`} fill sizes="24px" className="object-contain" />
            </span>
          ) : (
            s.dot
          )}
          <span className={`text-xs font-medium ${s.color}`}>{s.label}</span>
        </div>
        {unread && <span className="h-2 w-2 rounded-full bg-red-500"></span>}
      </div>

      <h3 className="text-gray-900 font-semibold">{title}</h3>
      <p className="text-xs text-gray-600 mt-1">Deadline: {deadline}</p>

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={onViewDetail}
          className="inline-flex items-center gap-2 h-[37px] text-blue-600 border border-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-sm text-xs"
        >
          <Eye className="h-4 w-4" />
          View detail
        </button>
        <button
          type="button"
          onClick={onComment}
          className="inline-flex items-center h-[37px] gap-2 bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-sm text-xs"
        >
          <MessageCircle className="h-4 w-4" />
          Comment
        </button>
      </div>
    </div>
  )
}


