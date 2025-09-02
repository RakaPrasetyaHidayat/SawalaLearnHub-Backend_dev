"use client"
import React, { useRef, useState } from 'react'
import Image from 'next/image'

type InputPostProps = {
  placeholder?: string
  onSubmit?: (data: { text: string; file?: File | null }) => void
  className?: string
  disabled?: boolean
}

export default function InputPost({
  placeholder = "Share your thoughts...",
  onSubmit,
  className = '',
  disabled = false,
}: InputPostProps) {
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function handlePickImage() {
    if (disabled) return
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null
    setFile(selected)
    if (selected) {
      const url = URL.createObjectURL(selected)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
  }

  function handleRemoveImage() {
    setFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (disabled) return
    onSubmit?.({ text: text.trim(), file })
    setText('')
    handleRemoveImage()
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      {/* Label */}
      <label className="block text-gray-900 font-regular text-sm mb-2">
        What&apos;s on your mind?
      </label>

      {/* Input field with preview */}
      <div className="relative w-full border h-[37px] border-gray-200 rounded-lg bg-white flex items-center">
        <div className="flex items-center px-4 py-3 w-full">
          <div className="flex-1 flex items-center gap-3">
            {previewUrl ? (
              <div className="flex items-center gap-3 w-full">
                <div className="relative w-[27px] h-[27px] rounded-sm overflow-hidden flex-shrink-0">
                  <Image
                    src={previewUrl}
                    alt="preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 flex items-center justify-center text-xs font-bold"
                  >
                    ×
                  </button>
                </div>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={placeholder}
                  disabled={disabled}
                  className="flex-1 text-sm placeholder:text-gray-400 outline-none"
                />
              </div>
            ) : (
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className="flex-1 text-sm placeholder:text-gray-400 outline-none"
              />
            )}
          </div>

          {/* Plus icon button */}
          <button
            type="button"
            onClick={handlePickImage}
            disabled={disabled}
            aria-label="Add image"
            className="ml-3 h-8 w-8 absolute right-1.5 top-1.5 inline-flex items-center justify-center border-gray-200 text-2xl hover:bg-gray-50 disabled:opacity-50 text-gray-500"
            title="Add image"
          >
            <span className="text-2xl leading-none mb-auto">+</span>
          </button>
        </div>
        

      </div>
      {/* Button submit postingan baru */}
      <button
        type="submit"
        disabled={disabled || (!text.trim() && !previewUrl)}
        className="mt-2 w-full py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold disabled:opacity-50"
      >
        Post
      </button>


      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </form>
  )
}
