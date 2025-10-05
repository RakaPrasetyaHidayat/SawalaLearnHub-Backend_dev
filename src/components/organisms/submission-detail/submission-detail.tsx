"use client"

import React, { useEffect, useState } from "react"
import { ArrowLeft, FileText } from "lucide-react"
import FileAttachment from "@/components/molecules/file-attachment/file-attachment"
import StatusSection from "@/components/molecules/status-section/status-section"
import { TasksService } from "@/services/tasksService"

type SubmissionDetailProps = {
  submissionId?: string | number
  // Legacy props for backward compatibility
  date?: string
  description?: string
  fileName?: string
  fileSize?: string
  status?: "submitted" | "approved" | "pending" | "rejected"
  feedback?: string
  onBack?: () => void
  onFileClick?: () => void
  onBackToTasks?: () => void
  className?: string
}

export default function SubmissionDetail({ 
  submissionId,
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
  const [submissionData, setSubmissionData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (submissionId) {
      fetchSubmissionDetail()
    }
  }, [submissionId])

  const fetchSubmissionDetail = async () => {
    if (!submissionId) return
    
    setLoading(true)
    setError(null)
    
    try {
      const data = await TasksService.getTaskSubmissionById(submissionId)
      setSubmissionData(data)
    } catch (err: any) {
      console.error("Error fetching submission detail:", err)
      setError("Failed to load submission details")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short", 
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateString
    }
  }

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Use API data if available, otherwise fall back to props
  const displayData = submissionData || {
    date,
    description,
    fileName,
    fileSize,
    status,
    feedback
  }

  if (loading) {
    return (
      <div className={`w-full min-h-screen bg-gray-50 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading submission details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`w-full min-h-screen bg-gray-50 ${className}`}>
        <div className="bg-white px-4 py-3 flex items-center gap-3 border-b">
          <button 
            onClick={onBack}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-base font-medium text-gray-900">Detail Task</h1>
        </div>
        
        <div className="p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    )
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
        <h1 className="text-base font-medium text-gray-900">Detail Task</h1>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Date */}
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">
            {formatDate(displayData.submitted_at || displayData.createdAt || displayData.created_at || displayData.date)}
          </p>
        </div>

        {/* Task Info */}
        {(displayData.task?.title || displayData.taskTitle) && (
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">Task</p>
            <p className="text-sm text-gray-700">{displayData.task?.title || displayData.taskTitle}</p>
          </div>
        )}

        {/* Description */}
        <div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {displayData.description || "No description provided"}
          </p>
        </div>

        {/* Files */}
        {displayData.files && displayData.files.length > 0 ? (
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">Attached Files</p>
            <div className="space-y-2">
              {displayData.files.map((file: any, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                  <FileText className="text-gray-400" size={20} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{file.name || file.filename}</p>
                    {file.size && (
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    )}
                  </div>
                  {file.url && (
                    <a 
                      href={file.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm hover:underline"
                      onClick={onFileClick}
                    >
                      View
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (displayData.fileName || fileName) && (
          <div>
            <FileAttachment
              fileName={displayData.fileName || fileName}
              fileSize={displayData.fileSize || fileSize}
              onClick={onFileClick}
            />
          </div>
        )}

        {/* Status and Feedback */}
        <StatusSection
          status={displayData.status || status}
          feedback={displayData.feedback || feedback}
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