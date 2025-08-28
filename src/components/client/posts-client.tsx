"use client"

import Image from 'next/image'
import Post from '@/components/organisms/post/post/post'
import BackButton from '@/components/atoms/ui/back-button'

interface PostData {
  id: string
  user: { name: string; avatar: string }
  content: string
  file?: { name: string; type: 'image' | 'document' }
  timestamp: string
  initialLikes: number
  initialComments: number
}

export default function PostsClient({ posts }: { posts: PostData[] }) {
  return (
    <div className='justify-center items-center h-full'>
      {/* Top bar */}
      <div className="justify-center items-center h-full flex relative">
        <div className=" items-center flex h-full relative w-[350px] max-[340px]:w-full pt-4 pb-2">
          <BackButton className="ml-2 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Image src="/assets/icons/arrow-left.png" alt="Back" width={8} height={8} style={{ width: 'auto', height: 'auto' }} />
          </BackButton>
          <h1 className='font-bold text-xl'>My Post</h1>
        </div>
      </div>

      {/* Feed */}
      <div className='space-y-3 p-4'>
        {posts.map(p => (
          <Post
            key={p.id}
            id={p.id}
            user={p.user}
            content={p.content}
            file={p.file}
            timestamp={p.timestamp}
            initialLikes={p.initialLikes}
            initialComments={p.initialComments}
            className="shadow-sm"
            // likesTextClassName="text-blue-500"
            // commentsTextClassName="text-gray-500"
          />
        ))}
      </div>
    </div>
  )
}
