"use client"

import React, { useCallback, useRef, useState } from "react"
import { UploadCloud } from "lucide-react"

type UploadDropzoneProps = {
  onFilesAdded?: (files: File[]) => void
  maxSizeMb?: number
  className?: string
}

export default function UploadDropzone({ onFilesAdded, maxSizeMb = 25, className = "" }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return
    const accepted: File[] = []
    const maxBytes = maxSizeMb * 1024 * 1024
    Array.from(files).forEach(f => {
      if (f.size <= maxBytes) accepted.push(f)
    })
    if (accepted.length && onFilesAdded) onFilesAdded(accepted)
  }, [onFilesAdded, maxSizeMb])

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files) }}
      className={`border-2 border-dotted rounded-sm p-6 text-center bg-blue-50 ${isDragging ? 'border-blue-500' : 'border-blue-400'} ${className}`}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <UploadCloud className="h-5 w-5 text-blue-600" />
        <p className="text-base text-gray-900">
          Drag and drop or{' '}
          <button type="button" className="text-blue-600 underline" onClick={() => inputRef.current?.click()}>
            Choose file
          </button>{' '}
          to upload
        </p>
        <p className="text-sm text-gray-500">(Max.File size:{maxSizeMb}mb)</p>
      </div>
      <input ref={inputRef} type="file" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
    </div>
  )
}


