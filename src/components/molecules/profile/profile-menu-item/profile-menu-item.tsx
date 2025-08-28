"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface ProfileMenuItemProps {
  icon: React.ReactNode
  label: string
  href?: string
  onClick?: () => void
  showArrow?: boolean
}

export default function ProfileMenuItem({
  icon,
  label,
  href,
  onClick,
  showArrow = true
}: ProfileMenuItemProps) {
  const content = (
    <div className="flex items-center justify-between py-2 px-6 border mt-2 border-black-100 ml-2 mr-2 rounded-md hover:bg-white transition-all duration-200">
      <div className="flex items-center gap-4">
        <div className="text-gray-600 group-hover:text-blue-500 transition-colors">
          {icon}
        </div>
        <span className="text-gray-800 font-medium group-hover:text-blue-500 transition-colors">{label}</span>
      </div>  
      {showArrow && (
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    )
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left hover:bg-gray-50 transition-colors "
    >
      {content}
    </button>
  )
}
