"use client";

import { useState, useRef } from "react";
import { Cloud } from "lucide-react";

interface FileUploadSectionProps {
  onFileSelect: (file: File | null) => void;
}

export function FileUploadSection({ onFileSelect }: FileUploadSectionProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.size <= 25 * 1024 * 1024) { // 25MB limit
        handleFileSelect(file);
      } else {
        alert("File size exceeds 25MB limit");
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size <= 25 * 1024 * 1024) { // 25MB limit
        handleFileSelect(file);
      } else {
        alert("File size exceeds 25MB limit");
      }
    }
  };

  const handleChooseFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-blue-300 hover:border-blue-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Cloud Icon */}
        <div className="flex justify-center mb-4">
          <Cloud className="w-12 h-12 text-blue-500" />
        </div>
        
        {/* Upload Text */}
        <div className="space-y-2">
          <p className="text-gray-700">
            Drag and drop or{' '}
            <button
              type="button"
              onClick={handleChooseFileClick}
              className="text-blue-500 hover:text-blue-600 underline cursor-pointer"
            >
              Choose file
            </button>
            {' '}to upload
          </p>
          <p className="text-sm text-gray-500">
            (Max. File size: 25MB)
          </p>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInputChange}
          className="hidden"
          accept="*/*"
        />
      </div>

      {/* Selected File Display */}
      {selectedFile && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Selected file:</strong> {selectedFile.name}
          </p>
          <p className="text-xs text-green-600">
            Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
      )}
    </div>
  );
}
