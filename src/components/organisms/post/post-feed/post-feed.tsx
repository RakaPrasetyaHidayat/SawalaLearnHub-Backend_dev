"use client"
import React, { useState } from 'react'
import Post from '../post/post'

interface PostData {
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
  likes: number
  comments: number
}

export default function PostFeed() {
  const [posts, setPosts] = useState<PostData[]>([
    {
      id: '1',
      user: {
        name: 'bimo_fikry',
        avatar: '/assets/icons/profile.png' // You'll need to add this image
      },
      content: 'Kehidupan itu seperti user journey penuh tikungan, bug, dan kadang error 404. Tapi tetap bisa diarahkan ke tujuan.',
      file: {
        name: 'photo.jpg',
        type: 'image'
      },
      timestamp: '12:10 AM Oct 30,2025',
      likes: 200000,
      comments: 123000
    },
    {
      id: '2',
      user: {
        name: 'bimo_fikry',
        avatar: '/assets/images/avatar1.jpg'
      },
      content: 'Kehidupan itu seperti user journey penuh tikungan, bug, dan kadang error 404. Tapi tetap bisa diarahkan ke tujuan.',
      timestamp: '12:10 AM Oct 30,2025',
      likes: 200000,
      comments: 123000
    },
    {
      id: '3',
      user: {
        name: 'bimo_fikry',
        avatar: '/assets/images/avatar1.jpg'
      },
      content: 'Kehidupan itu seperti user journey penuh tikungan, bug, dan kadang error 404. Tapi tetap bisa diarahkan ke tujuan.',
      timestamp: '12:10 AM Oct 30,2025',
      likes: 200000,
      comments: 123000
    }
  ])

  const handleCreatePost = ({ text, file }: { text: string; file?: File | null }) => {
    const newPost: PostData = {
      id: Date.now().toString(),
      user: {
        name: 'bimo_fikry',
        avatar: '/assets/images/avatar1.jpg'
      },
      content: text,
      file: file ? {
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'document'
      } : undefined,
      timestamp: new Date().toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      likes: 0,
      comments: 0
    }

    setPosts(prev => [newPost, ...prev])
  }

  const handleLike = (postId: string, isLiked: boolean) => {
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, likes: isLiked ? post.likes + 1 : post.likes - 1 }
        : post
    ))
  }

  const handleComment = (postId: string) => {
    // Handle comment functionality
    console.log('Comment on post:', postId)
  }

  return (
    <div className="space-y-4">

      {/* Posts Feed */}
      <div className="space-y-4 mt-3">
        {posts.map(post => (
          <Post
            key={post.id}
            id={post.id}
            user={post.user}
            content={post.content}
            file={post.file}
            timestamp={post.timestamp}
            initialLikes={post.likes}
            initialComments={post.comments}
            onLike={handleLike}
            onComment={handleComment}
          />

        ))}
        {/* Form Create Post */}
        <div className="p-4 border rounded-lg">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const form = e.currentTarget
              const text = (form.elements.namedItem("text") as HTMLInputElement).value
              handleCreatePost({ text })
              form.reset()
            }}
          >
            <input
              type="text"
              name="text"
              placeholder="Apa yang kamu pikirkan?"
              className="w-full border rounded px-3 py-2 mb-2"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
