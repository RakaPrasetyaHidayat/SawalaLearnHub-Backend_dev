"use client"

import React from "react"

type TextareaWithLabelProps = {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (v: string) => void
  error?: string
  className?: string
}

export default function TextareaWithLabel({ label, placeholder, value, onChange, error, className = "" }: TextareaWithLabelProps) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-800 mb-1">{label}</label>}
      <textarea
        className={`w-full border h-[37px] rounded-sm px-3 py-2 text-sm outline-none ${error ? 'border-red-500' : 'border-gray-300'}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        rows={3}
      />
      {error && (
        <div className="mt-2 text-red-600 text-sm flex items-center gap-2">
          <span className="text-base leading-none">✖</span>
          {error}
        </div>
      )}
    </div>
  )
}


