"use client"

import React from "react"
import { ArrowLeft } from "lucide-react"
import FileAttachment from "@/components/molecules/file-attachment/file-attachment"
import StatusSection from "@/components/molecules/status-section/status-section"

type SubmissionDetailProps = {
  date: string
  description: string
  fileName: string
  fileSize: string
  status: "submitted" | "approved" | "pending" | "rejected"
  feedback?: string
  onBack?: () => void
  onFileClick?: () => void
  onBackToTasks?: () => void
  className?: string
}

export default function SubmissionDetail({ 
  date,
  description,
  fileName,
  fileSize,
  status,
  feedback,
  onBack,
  onFileClick,
  onBackToTasks,
  className = "" 
}: SubmissionDetailProps) {
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
        <h1 className="text-base font-medium text-gray-900">Detail Task</h1>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Date */}
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">{date}</p>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {description}
          </p>
        </div>

        {/* File Attachment */}
        <div>
          <FileAttachment
            fileName={fileName}
            fileSize={fileSize}
            onClick={onFileClick}
          />
        </div>

        {/* Status and Feedback */}
        <StatusSection
          status={status}
          feedback={feedback}
        />

        {/* Back to Tasks Button */}
        <div className="pt-4">
          <button
            onClick={onBackToTasks}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    </div>
  )
}