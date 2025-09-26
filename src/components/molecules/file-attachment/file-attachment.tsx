"use client"

import React from "react"
import { FileText } from "lucide-react"

type FileAttachmentProps = {
  fileName: string
  fileSize: string
  onClick?: () => void
  className?: string
}

export default function FileAttachment({ 
  fileName, 
  fileSize, 
  onClick,
  className = "" 
}: FileAttachmentProps) {
  return (
    <div 
      className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${className}`}
      onClick={onClick}
    >
      {/* File Icon */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
          <FileText size={16} className="text-white" />
        </div>
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {fileName}
        </h4>
        <p className="text-xs text-gray-500">
          {fileSize}
        </p>
      </div>
    </div>
  )
}