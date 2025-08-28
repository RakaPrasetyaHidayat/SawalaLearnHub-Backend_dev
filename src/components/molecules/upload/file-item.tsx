"use client"

import React from "react"
import { X, File } from "lucide-react"

type FileItemProps = {
  name: string
  sizeLabel?: string
  onRemove?: () => void
  className?: string
}

export default function FileItem({ name, sizeLabel, onRemove, className = "" }: FileItemProps) {
  return (
    <div className={`w-full border rounded-md p-2 flex items-center gap-2 ${className}`}>
      <File className="h-4 w-4 text-blue-600" />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-800 truncate">{name}</div>
        {sizeLabel && <div className="text-xs text-gray-500">{sizeLabel}</div>}
      </div>
      <button type="button" className="p-1" aria-label="Remove file" onClick={onRemove}>
        <X className="h-4 w-4 text-gray-600" />
      </button>
    </div>
  )
}



