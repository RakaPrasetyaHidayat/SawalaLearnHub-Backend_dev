"use client";
import NavigationBar from "@/components/molecules/navigationbar/navigationbar";
import { Intern } from "@/components/organisms/intern-section";
import { PostFeed } from "@/components/organisms/post/post-feed";
import React, { useState } from "react";

export default function AdminHomePage() {
  const [tab, setTab] = useState("intern");

  return (
    <div className="w-full min-h-screen px-4 py-2">
      <div className="mx-auto w-full max-w-md">
        {/* Header: Title + Admin Badge + Action Button */}
        <div className="flex items-center justify-between mt-4">
          <h1 className="font-bold text-xl">
            Sawala Learnhub
            <span className="ml-2 align-middle rounded bg-blue-600 text-white text-xs px-2 py-0.5">
              Admin
            </span>
          </h1>
        </div>

        {/* Navigation + Content (identik dengan main-Page) */}
        <NavigationBar
          value={tab}
          onChange={setTab}
          className="pt-4 overflow-x-auto"
        />
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
  );
}
