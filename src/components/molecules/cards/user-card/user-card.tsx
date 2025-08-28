"use client"

import Image from 'next/image'

type UserCardProps = {
  avatarSrc?: string
  avatarAlt?: string
  username: string
  division: string
  school: string
  onViewProfile?: () => void
  className?: string
}

export default function UserCard({
  avatarSrc = '/assets/icons/profile.png',
  avatarAlt = 'User avatar',
  username,
  division,
  school,
  onViewProfile,
  className,
}: UserCardProps) {
  return (
    <div
      className={`w-full bg-[#F7F7F7] rounded-md px-4 py-3 flex items-start justify-between ${className ?? ''}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-white flex-shrink-0">
          <Image src={avatarSrc} alt={avatarAlt} fill className="object-cover" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">{username}</p>
          <p className="text-sm text-gray-700 truncate">{division}</p>
          <p className="text-sm text-gray-500 truncate">{school}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onViewProfile}
        className="self-start text-[10px] text-gray-800 border bg-[#E3E3E3] px-3 py-1.5 rounded-sm hover:bg-gray-50"
      >
        View Profile
      </button>
    </div>
  )
}


