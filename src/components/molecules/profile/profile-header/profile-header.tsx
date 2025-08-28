"use client"

import { Button } from "@/components/atoms/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/ui/avatar"

interface ProfileHeaderProps {
  username: string
  role: string
  institution: string
  profileImage?: string
  onEditProfile?: () => void
}

export default function ProfileHeader({
  username,
  role,
  institution,
  profileImage,
  onEditProfile
}: ProfileHeaderProps) {
  return (
    <div className="bg-blue-500 text-white p-6 pb-8 rounded-b-[16px] relative z-20">
      <div className="flex items-start gap-4 mb-5">
        <Avatar className="w-20 mt-5 h-20 border-4 border-white/20 shadow-lg">
          <AvatarImage src={profileImage} alt={username} />
          <AvatarFallback className="bg-white/20 text-white text-2xl font-semibold">
            {username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 pt-4">
          <h1 className="text-xl font-semibold text-white">{username}</h1>
          <p className="text-white/90 mb-1 font-medium">{role}</p>
          <p className="text-white/80 text-sm">{institution}</p>
        </div>
      </div>
      
      <div className="flex justify-left">
        <Button
          variant="outline"
          size="sm"
          onClick={onEditProfile}
          className="border-white/80 mb-2 bg-transparent text-white px-6 py-2 rounded-sm font-medium shadow-sm"
        >
          Edit Profile
        </Button>
      </div>
    </div>
  )
}
