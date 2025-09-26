"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

type StatusSectionProps = {
  status: "submitted" | "approved" | "pending" | "rejected"
  feedback?: string
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

export default function StatusSection({ 
  status, 
  feedback,
  className = "" 
}: StatusSectionProps) {
  const statusInfo = statusConfig[status]

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Status */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Status</h3>
        <Badge 
          variant={statusInfo.variant}
          className={`${statusInfo.className} text-xs px-3 py-1 rounded-full`}
        >
          {statusInfo.label}
        </Badge>
      </div>

      {/* Feedback */}
      {feedback && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Feedback</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {feedback}
          </p>
        </div>
      )}
    </div>
  )
}