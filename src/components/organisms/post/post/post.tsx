"use client"
import React, { useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ThumbsUp, MessageCircle, FileText } from 'lucide-react'
import Image from 'next/image';

interface PostProps {
  id: string
  user: {
    name: string
    avatar: string
  }
  content: string
  file?: {
    name: string
    type: 'image' | 'document'
  }
  timestamp: string
  initialLikes: number
  initialComments: number
  onLike?: (postId: string, isLiked: boolean) => void
  onComment?: (postId: string) => void
  className?: string
}

export default function Post({
  id,
  user,
  content,
  file,
  timestamp,
  initialLikes,
  initialComments,
  onLike,
  onComment,
  className = ''
}: PostProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(Number.isFinite(initialLikes) ? initialLikes : 0)
  const [comments,] = useState(Number.isFinite(initialComments) ? initialComments : 0)

  const handleLike = () => {
    const newLikedState = !isLiked
    setIsLiked(newLikedState)

    if (newLikedState) {
      setLikes(prev => prev + 1)
    } else {
      setLikes(prev => Math.max(0, prev - 1))
    }

    onLike?.(id, newLikedState)
  }

  const handleComment = () => {
    onComment?.(id)
  }

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {/* Header - User Info */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src="/assets/icons/profile.png"
            alt="foto"
            width={40}
            height={40}
            // className="w-full h-full object-cover"
          />
        </div>
        <span className="font-bold text-base text-gray-900">Someone</span>
      </div>

      {/* File Attachment (if exists) */}
      {file && (
        <div className="flex items-center space-x-2 mb-3 ml-13">
          <FileText className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-gray-700">{file.name}</span>
        </div>
      )}

      {/* Post Content */}
      <div className="mb-3 ml-13">
        <p className="text-base text-gray-800 leading-relaxed">{content}</p>
      </div>
      
      {/* Timestamp */}
      <div className="mb-3 ml-13">
        <span className="text-[16px] text-gray-500">{timestamp}</span>
      </div>
      
      {/* Footer - Interactions */}
      <div className="flex items-center space-x-4 ml-13 justify-between pr-6 flex">
        {/* Likes */}
        <button
          onClick={handleLike}
          className="flex items-center space-x-1 hover:opacity-80 transition-opacity"
        >
          <ThumbsUp 
            className={`w-4 h-4 ${isLiked ? 'text-blue-500 fill-current' : 'text-gray-400'}`} 
          />
          <span className="text-sm text-gray-700">{formatCount(likes)}</span>
        </button>

        {/* Comments */}
        <button
          onClick={handleComment}
          className="flex items-center space-x-1 hover:opacity-80 transition-opacity"
        >
          <MessageCircle className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700">{formatCount(comments)}</span>
        </button>
      </div>
    </div>
  )
}
