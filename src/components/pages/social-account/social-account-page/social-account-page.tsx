"use client";

import BackButton from "@/components/atoms/ui/back-button";
import { SocialAccountList, FloatingEditButton } from "./index";
import Image from 'next/image'
import { SocialAccountProvider } from "./context/social-account-context";

export function SocialAccountPage() {
  return (
    <SocialAccountProvider>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="flex items-center p-4">
          <BackButton>
            <Image src="/assets/icons/arrow-left.png" alt="Back" width={16} height={16} className="h-4 w-4 ml-1 cursor-pointer hover:bg-gray-100" />
          </BackButton>   
          <h1 className="text-xl font-bold text-gray-900 ml-3">
            Social Account
          </h1>
        </div>

        {/* Social Account List */}
        <div className="p-4">
          <SocialAccountList />
        </div>

        {/* Floating Edit Button */}
        <FloatingEditButton />
      </div>
    </SocialAccountProvider>
  );
}
