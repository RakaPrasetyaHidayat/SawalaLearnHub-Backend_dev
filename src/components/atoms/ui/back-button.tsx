"use client"

import { useRouter } from "next/navigation"
import React from "react"

export default function BackButton({ className, children }: { className?: string; children?: React.ReactNode }) {
  const router = useRouter()
  return (
    <button
      className={className}
      onClick={() => router.back()}
      aria-label="Go back"
    >
      {children}
    </button>
  )
}
