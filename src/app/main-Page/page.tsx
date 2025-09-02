"use client"
import NavigationBar from '@/components/molecules/navigationbar/navigationbar'
import { Intern } from '@/components/organisms/intern-section'
import React, { useState } from 'react'
import { PostFeed } from '@/components/organisms/post/post-feed'

function AdminDashboardPage() {
    const [tab, setTab] = useState("intern")
    return (
        <div className='w-full min-h-screen px-4 py-2'>
            <div className="mx-auto w-full max-w-md">
                <h1 className='font-bold text-xl'>Sawala Learnhub</h1>
                <NavigationBar value={tab} onChange={setTab} className='pt-4 overflow-x-auto' />
                <div className="mt-6">
                {tab === "intern" ? (
                    <div className="space-y-3">
                        <Intern />
                    </div>
                ) : (
                    <div className="w-full">
                         <PostFeed />
                    </div>
                )}
                </div>
            </div>
        </div>
    )
}

export default AdminDashboardPage  