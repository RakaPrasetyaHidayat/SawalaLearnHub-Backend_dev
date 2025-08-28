"use client"

import React, { useState } from 'react'
import NavigationBar from '@/components/molecules/navigationbar/navigationbar'
import { Intern } from '@/components/organisms/intern-section'
import { InputPost } from '@/components/molecules/inputs/input-post'
import { PostFeed } from '@/components/organisms/post/post-feed'

export default function AdminTabsClient() {
  const [tab, setTab] = useState("intern")
  return (
    <>
      <NavigationBar value={tab} onChange={setTab} className='pt-4 overflow-x-auto' />
      <div className="mt-6">
        {tab === "intern" ? (
          <div className="space-y-3">
            <Intern />
          </div>
        ) : (
          <div className="w-full">
            <InputPost
              placeholder="What's on your mind?"
              onSubmit={({ text, file }) => {
                console.log('posting...', { text, file })
              }}
            />
            <PostFeed />
          </div>
        )}
      </div>
    </>
  )
}




