"use client"

import React from "react"
import { FileText, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type SubmissionListItemProps = {
  fileName: string
  date: string
  status: "submitted" | "approved" | "pending" | "rejected"
  onClick?: () => void
  className?: string
}

const statusConfig = {
  submitted: {
    label: "Submitted",
    variant: "secondary" as const,
    className: "bg-blue-100 text-blue-700 border-blue-200"
  },
  approved: {
    label: "Approved", 
    variant: "secondary" as const,
    className: "bg-green-100 text-green-700 border-green-200"
  },
  pending: {
    label: "Pending",
    variant: "secondary" as const,
    className: "bg-yellow-100 text-yellow-700 border-yellow-200"
  },
  rejected: {
    label: "Rejected",
    variant: "destructive" as const,
    className: "bg-red-100 text-red-700 border-red-200"
  }
}

export default function SubmissionListItem({ 
  fileName, 
  date, 
  status, 
  onClick,
  className = "" 
}: SubmissionListItemProps) {
  const statusInfo = statusConfig[status]

  return (
    <div 
      className={`flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors ${className}`}
      onClick={onClick}
    >
      {/* File Icon */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
          <FileText size={20} className="text-white" />
        </div>
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-medium text-gray-900 truncate mb-1">
          {fileName}
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          {date}
        </p>
        <Badge 
          variant={statusInfo.variant}
          className={`${statusInfo.className} text-xs px-3 py-1 rounded-full`}
        >
          {statusInfo.label}
        </Badge>
      </div>

      {/* Arrow Icon */}
      <div className="flex-shrink-0">
        <ChevronRight size={20} className="text-gray-400" />
      </div>
    </div>
  )
}